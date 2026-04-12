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
  // extract "Risk Factors" (section 1A) from a Tesla 10-K
  const text = await secApi.extractorApi.getSection(
    'https://www.sec.gov/Archives/edgar/data/1318605/000156459021004599/tsla-10k_20201231.htm',
    '1A',
    'text',
  );

  log('Section 1A length: ' + text.length + ' characters');
  log('First 500 chars:\n' + text.substring(0, 500));
};

main().catch(log);
