#!/usr/bin/env node

// const io = require('socket.io-client');
const config = require('./config');
// const events = require('events');
const axios = require('axios');

const store = { apiKey: '' };

const setApiKey = (apiKey) => {
  store.apiKey = apiKey;
};

/*
 * Stream API
 */
// const streamApiStore = {};

// const initSocket = (apiKey) => {
//   const uri = config.io.server + '/' + config.io.namespace.allFilings;
//   const params = {
//     query: { apiKey },
//     transports: ['websocket'], // ensure traffic goes through load balancer
//   };
//   streamApiStore.socket = io(uri, params);
//   streamApiStore.socket.on('connect', () =>
//     console.log('Socket connected to', uri),
//   );
//   streamApiStore.socket.on('filing', handleNewFiling);
//   streamApiStore.socket.on('filings', handleNewFilings);
//   streamApiStore.socket.on('error', console.error);
// };

// const handleNewFiling = (filing) => {
//   streamApiStore.eventEmitter.emit('filing', filing);
// };

// const handleNewFilings = (filings) => {
//   streamApiStore.eventEmitter.emit('filings', filings);
// };

// const close = () => {
//   if (streamApiStore.socket.close) {
//     streamApiStore.socket.close();
//   }
// };

// const connect = (apiKey) => {
//   setApiKey(apiKey);
//   initSocket(apiKey);
//   streamApiStore.eventEmitter = new events.EventEmitter();
//   modules.streamApi.on = streamApiStore.eventEmitter.on;
//   return streamApiStore.eventEmitter;
// };

/*
 * Query API
 */

/**
 * Query filings
 *
 * @param {String} query The query string
 * @returns {Object}     The response from the API
 */
const getFilingsQuery = async (query) => {
  const options = {
    method: 'post',
    url: config.queryApi.endpoint,
    headers: { Authorization: store.apiKey },
    data: query,
  };

  const { data } = await axios(options);

  return data;
};

/**
 * Full-text Search API
 */
const getFilingsFullText = async (query) => {
  const options = {
    method: 'post',
    url: config.fullTextApi.endpoint,
    headers: { Authorization: store.apiKey },
    data: query,
  };

  const { data } = await axios(options);

  return data;
};

/**
 * Download API
 */
const removeIxbrlRenderingQuery = (urlPath) => {
  return urlPath.replace('/ix?doc=/', '/').replace('/ix.xhtml?doc=/', '/');
};

// in:  https://www.sec.gov/Archives/edgar/data/2065821/0001213900-25-073836-index-headers.html
// out: /2065821/000121390025073836/0001213900-25-073836-index-headers.html
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
    // true: decompress gzip response
    // false: return raw gzip buffer
    decompress: true,
    // true: return string for text content-types, buffer for others (PDFs, images, etc)
    // false: return raw buffer for all content-types
    autoConvertToString: true,
  },
) => {
  const normalizedEdgarFileUrl = removeIxbrlRenderingQuery(edgarFileUrl);
  let urlPath = edgarFileUrlToUrlPath(normalizedEdgarFileUrl);
  urlPath = addLeadingSlash(urlPath);

  const url =
    config.downloadApiV2.endpoint + urlPath + '?token=' + store.apiKey;

  const options = {
    method: 'get',
    url,
    responseType: 'arraybuffer',
    decompress: params.decompress,
  };

  const { data, headers } = await axios(options);

  if (!params.autoConvertToString) {
    return data;
  }

  // check content-type to determine how buffer response should be returned
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
    _url = config.renderApi.endpoint + +'&type=' + type + '&url=' + url;
  } else {
    const filename = url.replace(
      'https://www.sec.gov/Archives/edgar/data/',
      '',
    );
    _url = config.downloadApi.endpoint + filename + '?token=' + store.apiKey;
  }

  const options = {
    method: 'get',
    url: _url,
  };

  const { data } = await axios(options);

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

  const { data } = await axios.get(requestUrl);

  return data;
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

  const { data } = await axios.get(requestUrl);

  return data;
};

/**
 * Helpers
 */
const modules = {
  setApiKey,
  // streamApi: {
  //   setApiKey,
  //   connect,
  //   close,
  // },
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
  xbrlApi: {
    setApiKey,
    xbrlToJson,
  },
  extractorApi: {
    setApiKey,
    getSection,
  },
};

module.exports = modules;

/**
 * Command Line Execution - Stream API
 */
if (require.main === module) {
  // const apiKey = process.argv[2];
  // const emitter = connect(apiKey);
  // let messageCounter = 0;
  // emitter.on('filing', (filing) => {
  //   // console.log(JSON.stringify(filing, null, 1))
  //   messageCounter++;
  //   console.log(filing.id, filing.formType, filing.filedAt, messageCounter);
  // });
  console.log(
    'sec-api npm package working. Please import the package and use the provided methods to interact with the API.',
  );
}
