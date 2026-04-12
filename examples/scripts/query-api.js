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
  const result = await secApi.queryApi.getFilings({
    query: 'formType:"10-K" AND ticker:TSLA',
    from: '0',
    size: '5',
    sort: [{ filedAt: { order: 'desc' } }],
  });

  log('Total filings found: ' + JSON.stringify(result.total));

  result.filings.forEach((filing) => {
    log(filing.filedAt + ' | ' + filing.formType + ' | ' + filing.companyName);
  });
};

main().catch(log);
