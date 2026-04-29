#!/usr/bin/env node

const config = require('./config');
const {
  getJson,
  postJson,
  getBuffer,
  getText,
  get,
} = require('./modules/http-client');
const datasets = require('./modules/datasets');

const store = { apiKey: '' };

const setApiKey = (apiKey) => {
  store.apiKey = apiKey;
  datasets.setApiKey(apiKey);
};

/**
 * Helper: POST query to endpoint with token as query param, return JSON.
 */
const postWithToken = async (endpoint, query) => {
  const url = endpoint + '?token=' + store.apiKey;
  return postJson({ url, body: query });
};

/**
 * Helper: GET endpoint with token as query param, return JSON.
 */
const getWithToken = async (url) => {
  return getJson(url);
};

/*
 * Query API
 */
const getFilingsQuery = async (query) => {
  return postJson({
    url: config.queryApi.endpoint,
    body: query,
    headers: { Authorization: store.apiKey },
  });
};

/**
 * Full-text Search API
 */
const getFilingsFullText = async (query) => {
  return postJson({
    url: config.fullTextApi.endpoint,
    body: query,
    headers: { Authorization: store.apiKey },
  });
};

/**
 * Download API
 */
const removeIxbrlRenderingQuery = (urlPath) => {
  return urlPath.replace('/ix?doc=/', '/').replace('/ix.xhtml?doc=/', '/');
};

const edgarFileUrlToUrlPath = (edgarFileUrl) => {
  return edgarFileUrl.replace(/.*\/edgar\/data\//, '/');
};

const addLeadingSlash = (urlPath) => {
  if (urlPath.charAt(0) !== '/') {
    return '/' + urlPath;
  }
  return urlPath;
};

const getFile = async (
  edgarFileUrl,
  params = {
    decompress: true,
    autoConvertToString: true,
  },
) => {
  const normalizedEdgarFileUrl = removeIxbrlRenderingQuery(edgarFileUrl);
  let urlPath = edgarFileUrlToUrlPath(normalizedEdgarFileUrl);
  urlPath = addLeadingSlash(urlPath);

  const url =
    config.downloadApiV2.endpoint + urlPath + '?token=' + store.apiKey;

  const { data, headers } = await getBuffer(url);

  if (!params.autoConvertToString) {
    return data;
  }

  const contentType = headers['content-type'];

  if (contentType && contentType.includes('text')) {
    return data.toString('utf-8');
  }

  return data;
};

/**
 * Render API
 */
const getFilingContent = async (url, type = 'html') => {
  let _url;

  if (type === 'pdf') {
    _url = config.renderApi.endpoint + '&type=' + type + '&url=' + url;
  } else {
    const filename = url.replace(
      'https://www.sec.gov/Archives/edgar/data/',
      '',
    );
    _url = config.downloadApi.endpoint + filename + '?token=' + store.apiKey;
  }

  return getText(_url);
};

/**
 * PDF Generator API
 */
const getPdf = async (url) => {
  const fileUrl = url.replace(/ix\?doc=\//, '');
  const requestUrl =
    config.pdfGeneratorApi.endpoint +
    '?type=pdf&url=' +
    fileUrl +
    '&token=' +
    store.apiKey;

  const { data } = await getBuffer(requestUrl);
  return data;
};

/**
 * XBRL-to-JSON converter and parser
 */
const xbrlToJson = async ({ htmUrl, xbrlUrl, accessionNo } = {}) => {
  if (!htmUrl && !xbrlUrl && !accessionNo) {
    throw new Error(
      'Please provide one of the following arguments: htmUrl, xbrlUrl or accessionNo',
    );
  }

  let requestUrl = config.xbrlToJsonApi.endpoint + '?token=' + store.apiKey;

  if (htmUrl) {
    requestUrl += '&htm-url=' + htmUrl;
  }
  if (xbrlUrl) {
    requestUrl += '&xbrl-url=' + xbrlUrl;
  }
  if (accessionNo) {
    requestUrl += '&accession-no=' + accessionNo;
  }

  return getJson(requestUrl);
};

/**
 * Extractor API
 */
const getSection = async (filingUrl, section = '1A', returnType = 'text') => {
  if (!filingUrl || !filingUrl.length) {
    throw new Error('No valid filing URL provided');
  }

  const requestUrl =
    config.extractorApi.endpoint +
    `?token=${store.apiKey}&url=${filingUrl}&item=${section}&type=${returnType}`;

  return get(requestUrl);
};

/**
 * Mapping API
 */
const MAPPING_SUPPORTED_PARAMS = [
  'cik',
  'ticker',
  'cusip',
  'name',
  'exchange',
  'sector',
  'industry',
];

const resolve = async (parameter, value) => {
  if (!MAPPING_SUPPORTED_PARAMS.includes(parameter.toLowerCase())) {
    throw new Error(
      'Parameter not supported. Supported parameters: ' +
        MAPPING_SUPPORTED_PARAMS.join(', '),
    );
  }

  const url =
    config.mappingApi.endpoint +
    '/' +
    parameter.toLowerCase() +
    '/' +
    value +
    '?token=' +
    store.apiKey;

  return getWithToken(url);
};

/**
 * Form ADV API
 */
const getAdvFirms = async (query) => {
  return postWithToken(config.formAdvApi.endpoint + '/firm', query);
};

const getAdvIndividuals = async (query) => {
  return postWithToken(config.formAdvApi.endpoint + '/individual', query);
};

const getAdvDirectOwners = async (crd) => {
  const url =
    config.formAdvApi.endpoint +
    '/schedule-a-direct-owners/' +
    crd +
    '?token=' +
    store.apiKey;
  return getWithToken(url);
};

const getAdvIndirectOwners = async (crd) => {
  const url =
    config.formAdvApi.endpoint +
    '/schedule-b-indirect-owners/' +
    crd +
    '?token=' +
    store.apiKey;
  return getWithToken(url);
};

const getAdvPrivateFunds = async (crd) => {
  const url =
    config.formAdvApi.endpoint +
    '/schedule-d-7-b-1/' +
    crd +
    '?token=' +
    store.apiKey;
  return getWithToken(url);
};

const getAdvOtherBusinessNames = async (crd) => {
  const url =
    config.formAdvApi.endpoint +
    '/schedule-d-1-b/' +
    crd +
    '?token=' +
    store.apiKey;
  return getWithToken(url);
};

const getAdvSeparatelyManagedAccounts = async (crd) => {
  const url =
    config.formAdvApi.endpoint +
    '/schedule-d-5-k/' +
    crd +
    '?token=' +
    store.apiKey;
  return getWithToken(url);
};

const getAdvFinancialIndustryAffiliations = async (crd) => {
  const url =
    config.formAdvApi.endpoint +
    '/schedule-d-7-a/' +
    crd +
    '?token=' +
    store.apiKey;
  return getWithToken(url);
};

const getAdvBrochures = async (crd) => {
  const url =
    config.formAdvApi.endpoint + '/brochures/' + crd + '?token=' + store.apiKey;
  return getWithToken(url);
};

/**
 * Executive Compensation API
 */
const getExecComp = async (parameter) => {
  if (typeof parameter === 'string') {
    const url =
      config.execCompApi.endpoint +
      '/' +
      parameter.toUpperCase() +
      '?token=' +
      store.apiKey;
    return getWithToken(url);
  } else if (typeof parameter === 'object') {
    return postWithToken(config.execCompApi.endpoint, parameter);
  } else {
    throw new Error(
      'Invalid parameter. Provide a ticker string or a query object.',
    );
  }
};

/**
 * Float API (Outstanding Shares & Public Float)
 */
const getFloat = async ({ ticker, cik } = {}) => {
  if (!ticker && !cik) {
    throw new Error('Please provide either a ticker or cik parameter.');
  }

  const searchTerm = ticker ? '&ticker=' + ticker : '&cik=' + cik;
  const url = config.floatApi.endpoint + '?token=' + store.apiKey + searchTerm;

  return getWithToken(url);
};

/**
 * Form N-PX API
 */
const getNpxMetadata = async (query) => {
  return postWithToken(config.formNpxApi.endpoint, query);
};

const getNpxVotingRecords = async (accessionNo) => {
  const url =
    config.formNpxApi.endpoint + '/' + accessionNo + '?token=' + store.apiKey;
  return getWithToken(url);
};

/**
 * Simple POST-based API wrappers
 */
const getInsiderTrading = async (query) => {
  return postWithToken(config.insiderTradingApi.endpoint, query);
};

const getForm144 = async (query) => {
  return postWithToken(config.form144Api.endpoint, query);
};

const getForm13FHoldings = async (query) => {
  return postWithToken(config.form13FHoldingsApi.endpoint, query);
};

const getForm13FCoverPages = async (query) => {
  return postWithToken(config.form13FCoverPagesApi.endpoint, query);
};

const getFormNport = async (query) => {
  return postWithToken(config.formNportApi.endpoint, query);
};

const getForm13DG = async (query) => {
  return postWithToken(config.form13DGApi.endpoint, query);
};

const getFormNcen = async (query) => {
  return postWithToken(config.formNcenApi.endpoint, query);
};

const getFormS1424B4 = async (query) => {
  return postWithToken(config.formS1424B4Api.endpoint, query);
};

const getFormD = async (query) => {
  return postWithToken(config.formDApi.endpoint, query);
};

const getFormC = async (query) => {
  return postWithToken(config.formCApi.endpoint, query);
};

const getRegASearch = async (query) => {
  return postWithToken(config.regASearchApi.endpoint, query);
};

const getForm1A = async (query) => {
  return postWithToken(config.form1AApi.endpoint, query);
};

const getForm1K = async (query) => {
  return postWithToken(config.form1KApi.endpoint, query);
};

const getForm1Z = async (query) => {
  return postWithToken(config.form1ZApi.endpoint, query);
};

const getForm8K = async (query) => {
  return postWithToken(config.form8KApi.endpoint, query);
};

const getDirectorsAndBoardMembers = async (query) => {
  return postWithToken(config.directorsBoardMembersApi.endpoint, query);
};

const getSubsidiaries = async (query) => {
  return postWithToken(config.subsidiaryApi.endpoint, query);
};

const getSecEnforcementActions = async (query) => {
  return postWithToken(config.secEnforcementActionsApi.endpoint, query);
};

const getSecLitigations = async (query) => {
  return postWithToken(config.secLitigationsApi.endpoint, query);
};

const getSecAdminProceedings = async (query) => {
  return postWithToken(config.secAdminProceedingsApi.endpoint, query);
};

const getAaer = async (query) => {
  return postWithToken(config.aaerApi.endpoint, query);
};

const getSroFilings = async (query) => {
  return postWithToken(config.sroApi.endpoint, query);
};

const getEdgarEntities = async (query) => {
  return postWithToken(config.edgarEntitiesApi.endpoint, query);
};

const getAuditFees = async (query) => {
  return postWithToken(config.auditFeesApi.endpoint, query);
};

const getIngestionLog = async (date) => {
  const url =
    config.edgarIndexIngestionLogApi.endpoint +
    '/' +
    date +
    '?token=' +
    store.apiKey;
  return getWithToken(url);
};

/**
 * Exports
 */
const modules = {
  setApiKey,
  queryApi: {
    setApiKey,
    getFilings: getFilingsQuery,
  },
  fullTextSearchApi: {
    setApiKey,
    getFilings: getFilingsFullText,
  },
  downloadApi: {
    setApiKey,
    getFile,
  },
  renderApi: {
    setApiKey,
    getFilingContent,
  },
  pdfGeneratorApi: {
    setApiKey,
    getPdf,
  },
  xbrlApi: {
    setApiKey,
    xbrlToJson,
  },
  extractorApi: {
    setApiKey,
    getSection,
  },
  mappingApi: {
    setApiKey,
    resolve,
  },
  formAdvApi: {
    setApiKey,
    getFirms: getAdvFirms,
    getIndividuals: getAdvIndividuals,
    getDirectOwners: getAdvDirectOwners,
    getIndirectOwners: getAdvIndirectOwners,
    getPrivateFunds: getAdvPrivateFunds,
    getOtherBusinessNames: getAdvOtherBusinessNames,
    getSeparatelyManagedAccounts: getAdvSeparatelyManagedAccounts,
    getFinancialIndustryAffiliations: getAdvFinancialIndustryAffiliations,
    getBrochures: getAdvBrochures,
  },
  insiderTradingApi: {
    setApiKey,
    getData: getInsiderTrading,
  },
  form144Api: {
    setApiKey,
    getData: getForm144,
  },
  form13FHoldingsApi: {
    setApiKey,
    getData: getForm13FHoldings,
  },
  form13FCoverPagesApi: {
    setApiKey,
    getData: getForm13FCoverPages,
  },
  formNportApi: {
    setApiKey,
    getData: getFormNport,
  },
  form13DGApi: {
    setApiKey,
    getData: getForm13DG,
  },
  formNcenApi: {
    setApiKey,
    getData: getFormNcen,
  },
  formNpxApi: {
    setApiKey,
    getMetadata: getNpxMetadata,
    getVotingRecords: getNpxVotingRecords,
  },
  formS1424B4Api: {
    setApiKey,
    getData: getFormS1424B4,
  },
  formDApi: {
    setApiKey,
    getData: getFormD,
  },
  formCApi: {
    setApiKey,
    getData: getFormC,
  },
  regASearchApi: {
    setApiKey,
    getData: getRegASearch,
  },
  form1AApi: {
    setApiKey,
    getData: getForm1A,
  },
  form1KApi: {
    setApiKey,
    getData: getForm1K,
  },
  form1ZApi: {
    setApiKey,
    getData: getForm1Z,
  },
  form8KApi: {
    setApiKey,
    getData: getForm8K,
  },
  execCompApi: {
    setApiKey,
    getData: getExecComp,
  },
  directorsBoardMembersApi: {
    setApiKey,
    getData: getDirectorsAndBoardMembers,
  },
  floatApi: {
    setApiKey,
    getFloat,
  },
  subsidiaryApi: {
    setApiKey,
    getData: getSubsidiaries,
  },
  secEnforcementActionsApi: {
    setApiKey,
    getData: getSecEnforcementActions,
  },
  secLitigationsApi: {
    setApiKey,
    getData: getSecLitigations,
  },
  secAdminProceedingsApi: {
    setApiKey,
    getData: getSecAdminProceedings,
  },
  aaerApi: {
    setApiKey,
    getData: getAaer,
  },
  sroFilingsApi: {
    setApiKey,
    getData: getSroFilings,
  },
  edgarEntitiesApi: {
    setApiKey,
    getData: getEdgarEntities,
  },
  auditFeesApi: {
    setApiKey,
    getData: getAuditFees,
  },
  edgarIndexApi: {
    setApiKey,
    getIngestionLog,
  },
  datasetsApi: {
    setApiKey,
    getAll: datasets.getAll,
    showAll: datasets.showAll,
    getDetails: datasets.getDetails,
    showDetails: datasets.showDetails,
    download: datasets.download,
    sync: datasets.sync,
  },
};

module.exports = modules;

/**
 * Command Line Execution
 */
if (require.main === module) {
  console.log(
    'sec-api npm package working. Please import the package and use the provided methods to interact with the API.',
  );
}
