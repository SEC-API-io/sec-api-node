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
  // list all datasets (no API key required)
  log('--- All Datasets ---');
  await secApi.datasetsApi.showAll();

  // show details for one dataset
  log('--- Dataset Details: audit-fees ---');
  await secApi.datasetsApi.showDetails('audit-fees');

  // download a small dataset (commented out to avoid large downloads)
  // const files = await secApi.datasetsApi.download({ name: 'audit-fees' });
  // log('Downloaded ' + files.length + ' files');

  // sync a dataset to a custom path
  // await secApi.datasetsApi.sync({ name: 'audit-fees', path: './my-data' });

  // download as a single zip
  // await secApi.datasetsApi.download({ name: 'audit-fees', strategy: 'zip' });
};

main().catch(log);
