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
  // download a 10-K filing as text
  const content = await secApi.downloadApi.getFile(
    'https://www.sec.gov/Archives/edgar/data/1318605/000162828025045968/tsla-20250930.htm',
  );

  log('Content type: ' + typeof content);
  log('Content length: ' + content.length + ' characters');
  log('First 200 chars:\n' + content.substring(0, 200));
};

main().catch(log);
