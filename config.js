module.exports = {
  io: {
    server: 'https://api.sec-api.io:3334',
    // server: 'http://localhost:3333',
    namespace: {
      allFilings: 'all-filings',
    },
  },
  queryApi: {
    endpoint: 'https://api.sec-api.io',
  },
  fullTextApi: {
    endpoint: 'https://api.sec-api.io/full-text-search',
  },
  downloadApiV1: {
    endpoint: 'https://archive.sec-api.io',
  },
  downloadApiV2: {
    endpoint: 'https://edgar-mirror.sec-api.io',
  },
  renderApi: {
    endpoint: 'https://api.sec-api.io/filing-reader',
  },
  downloadApi: {
    endpoint: 'https://archive.sec-api.io/',
  },
  xbrlToJsonApi: {
    endpoint: 'https://api.sec-api.io/xbrl-to-json',
  },
  extractorApi: {
    endpoint: 'https://api.sec-api.io/extractor',
  },
};
