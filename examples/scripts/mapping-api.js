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
  // resolve ticker to company details
  const result = await secApi.mappingApi.resolve('ticker', 'TSLA');

  result.forEach((company) => {
    log(company.name + ' (CIK: ' + company.cik + ')');
    log('  Exchange: ' + company.exchange);
    log('  Sector: ' + company.sector);
    log('  Industry: ' + company.industry);
  });
};

main().catch(log);
