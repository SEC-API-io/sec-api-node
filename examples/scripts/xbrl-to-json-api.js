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
  // convert Apple 10-K XBRL to JSON by accession number
  const result = await secApi.xbrlApi.xbrlToJson({
    accessionNo: '0000320193-20-000096',
  });

  log('Available sections: ' + Object.keys(result).join(', '));

  if (result.StatementsOfIncome) {
    log('\nStatements of Income keys:');
    Object.keys(result.StatementsOfIncome).forEach((key) => {
      log('  ' + key);
    });
  }
};

main().catch(log);
