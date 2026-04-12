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
  const result = await secApi.insiderTradingApi.getData({
    query: 'issuer.tradingSymbol:TSLA AND remark:"award"',
    from: '0',
    size: '5',
    sort: [{ filedAt: { order: 'desc' } }],
  });

  log('Total transactions: ' + result.total);

  result.transactions.forEach((tx) => {
    log(
      tx.filedAt +
        ' | ' +
        tx.reportingOwner.name +
        ' | ' +
        tx.issuer.tradingSymbol,
    );
  });
};

main().catch(log);
