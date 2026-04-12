const fs = require('fs');
const path = require('path');
const secApi = require('../../index');

const { log } = console;

// use .env if present, otherwise fall back to inline key
let apiKey = 'YOUR_API_KEY';
const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  const match = fs
    .readFileSync(envPath, 'utf-8')
    .match(/SEC_API_IO_API_KEY=(.+)/);
  if (match) {
    apiKey = match[1].trim();
  }
}
secApi.setApiKey(apiKey);

const {
  queryApi,
  fullTextSearchApi,
  downloadApi,
  renderApi,
  extractorApi,
  xbrlApi,
} = secApi;

const queryExample = async () => {
  log('--- Query API ---');
  const data = await queryApi.getFilings({
    query: 'formType:"10-Q" AND ticker:AAPL',
    from: '0',
    size: '3',
    sort: [{ filedAt: { order: 'desc' } }],
  });
  data.filings.forEach((f) => {
    log(f.filedAt + ' | ' + f.formType + ' | ' + f.companyName);
  });
};

const fullTextSearchExample = async () => {
  log('\n--- Full-Text Search API ---');
  const data = await fullTextSearchApi.getFilings({
    query: '"LPCN 1154"',
    startDate: '2021-01-01',
    endDate: '2021-06-14',
  });
  data.filings.forEach((f) => {
    log(f.filedAt + ' | ' + f.formType + ' | ' + f.companyName);
  });
};

const downloadExample = async () => {
  log('\n--- Download API ---');
  const data = await downloadApi.getFile(
    'https://www.sec.gov/Archives/edgar/data/1318605/000162828025045968/tsla-20250930.htm',
  );
  log('Downloaded ' + data.length + ' characters');
};

const renderExample = async () => {
  log('\n--- Render API ---');
  const data = await renderApi.getFilingContent(
    'https://www.sec.gov/Archives/edgar/data/1841925/000121390021032758/ea142795-8k_indiesemic.htm',
  );
  log('Rendered ' + data.length + ' characters');
};

const extractorExample = async () => {
  log('\n--- Extractor API ---');
  const text = await extractorApi.getSection(
    'https://www.sec.gov/Archives/edgar/data/1318605/000156459021004599/tsla-10k_20201231.htm',
    '1A',
    'text',
  );
  log('Section 1A: ' + text.length + ' characters');
};

const xbrlExample = async () => {
  log('\n--- XBRL-to-JSON API ---');
  const data = await xbrlApi.xbrlToJson({
    accessionNo: '0000320193-20-000096',
  });
  log('Sections: ' + Object.keys(data).join(', '));
};

const main = async () => {
  await queryExample();
  await fullTextSearchExample();
  await downloadExample();
  await renderExample();
  await extractorExample();
  await xbrlExample();
};

main().catch(log);
