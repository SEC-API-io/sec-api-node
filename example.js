const secApi = require('./index');

/**
 * Set your API key
 */
const yourApiKey = 'YOUR_API_KEY';

secApi.setApiKey(yourApiKey);

/**
 * Query API
 */
const { queryApi } = secApi;

const queryExample = async () => {
  const query = {
    query: { query_string: { query: 'formType:"10-Q"' } },
    from: '0',
    size: '10',
    sort: [{ filedAt: { order: 'desc' } }],
  };

  const data = await queryApi.getFilings(query);

  console.log(data);
};

// uncomment
// queryExample();

/**
 * Full-text search API
 */
const { fullTextSearchApi } = secApi;

const fullTextSearchExample = async () => {
  const query = {
    query: '"LPCN 1154"', // drug
    // formTypes: ['8-K', '10-Q'],
    startDate: '2021-01-01',
    endDate: '2021-06-14',
  };

  const data = await fullTextSearchApi.getFilings(query);

  console.log(data);
};

// uncomment
// fullTextSearchExample();

/**
 * Download API
 */
const { downloadApi } = secApi;

const downloadApiExample = async () => {
  const filingUrl =
    'https://www.sec.gov/Archives/edgar/data/1318605/000162828025045968/tsla-20250930.htm';

  const data = await downloadApi.getFile(filingUrl);

  console.log(data.slice(0, 1000));
};

// downloadApiExample();

/**
 * Render API
 */
const { renderApi } = secApi;

const renderApiExample = async () => {
  const filingUrl =
    'https://www.sec.gov/Archives/edgar/data/1841925/000121390021032758/ea142795-8k_indiesemic.htm';

  const data = await renderApi.getFilingContent(filingUrl);

  console.log(data);
};

// uncomment
// renderApiExample();

/**
 * Stream API
 */
const { streamApi } = secApi;

// uncomment
// streamApi.connect(yourApiKey);
// streamApi.on('filing', (filing) => console.log(filing));
// streamApi.on('filings', (filings) => console.log(filings));

/**
 * 10-K/10-Q Section Extraction API
 */
const { extractorApi } = secApi;

const extractorApiExample = async () => {
  const filingUrl =
    'https://www.sec.gov/Archives/edgar/data/1318605/000156459021004599/tsla-10k_20201231.htm';

  const sectionText = await extractorApi.getSection(filingUrl, '1A', 'text');
  const sectionHtml = await extractorApi.getSection(filingUrl, '1A', 'html');

  console.log(sectionText);
  console.log(sectionHtml);
};

// uncomment
// extractorApiExample();

/**
 * XBRL-to-JSON API
 */
const { xbrlApi } = secApi;

// xbrlApi.setApiKey('YOUR_API_KEY');

// 10-K HTM File URL example
// const xbrlJson = xbrlApi
//   .xbrlToJson({
//     htmUrl:
//       'https://www.sec.gov/Archives/edgar/data/320193/000032019320000096/aapl-20200926.htm',
//   })
//   .then(console.log);

// 10-K XBRL File URL Example
// const xbrlJson = xbrlApi
//   .xbrlToJson({
//     xbrlUrl:
//       'https://www.sec.gov/Archives/edgar/data/320193/000032019320000096/aapl-20200926_htm.xml',
//   })
//   .then(console.log);

// 10-K Accession Number Example
// const xbrlJson = xbrlApi
//   .xbrlToJson({ accessionNo: '0000320193-20-000096' })
//   .then(console.log);
