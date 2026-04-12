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

const main = async () => {
  const result = await secApi.fullTextSearchApi.getFilings({
    query: '"artificial intelligence"',
    formTypes: ['10-K', '10-Q'],
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  });

  log('Total filings found: ' + JSON.stringify(result.total));

  result.filings.forEach((filing) => {
    log(filing.filedAt + ' | ' + filing.formType + ' | ' + filing.companyName);
  });
};

main().catch(log);
