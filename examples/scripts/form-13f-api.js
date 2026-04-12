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
  // Berkshire Hathaway 13F holdings (CIK: 1067983)
  const result = await secApi.form13FHoldingsApi.getData({
    query: 'cik:1067983',
    from: '0',
    size: '5',
    sort: [{ filedAt: { order: 'desc' } }],
  });

  log('Total holdings filings: ' + result.total);

  result.data.forEach((holding) => {
    log(
      holding.filedAt + ' | ' + holding.nameOfIssuer + ' | $' + holding.value,
    );
  });
};

main().catch(log);
