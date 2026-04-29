const config = require('../config');
const path = require('path');
const { getJson, downloadToFile } = require('./http-client');

const { log } = console;

const DEFAULT_DOWNLOAD_DIR = './sec-api-datasets';

const store = { apiKey: '' };

const setApiKey = (apiKey) => {
  store.apiKey = apiKey;
};
module.exports.setApiKey = setApiKey;

// list all available datasets, no API key required
const getAll = async () => {
  return getJson(config.datasetsApi.indexEndpoint);
};
module.exports.getAll = getAll;

// pretty-print all datasets to stdout
const showAll = async () => {
  const datasets = await getAll();
  const idCol = 50;
  const nameCol = 55;
  const fmtCol = 10;
  const sizeCol = 12;
  log('');
  log(
    '  ' +
      'ID'.padEnd(idCol) +
      ' ' +
      'Name'.padEnd(nameCol) +
      ' ' +
      'Format'.padEnd(fmtCol) +
      ' ' +
      'Size'.padStart(sizeCol),
  );
  log(
    '  ' +
      '─'.repeat(idCol) +
      ' ' +
      '─'.repeat(nameCol) +
      ' ' +
      '─'.repeat(fmtCol) +
      ' ' +
      '─'.repeat(sizeCol),
  );
  datasets.forEach((ds) => {
    const total = ds.totalSize || 0;
    const sizeStr =
      total >= 1_000_000_000
        ? (total / 1_000_000_000).toFixed(1) + ' GB'
        : (total / 1_000_000).toFixed(1) + ' MB';
    const id = (ds.datasetIdInUrl || '').padEnd(idCol);
    const name = (ds.name || '').slice(0, nameCol).padEnd(nameCol);
    const fmt = (ds.containerFormat || '').padEnd(fmtCol);
    log('  ' + id + ' ' + name + ' ' + fmt + ' ' + sizeStr.padStart(sizeCol));
  });
  log('');
  log(
    '  ' +
      datasets.length +
      ' datasets available. Browse all at https://sec-api.io/datasets',
  );
  log('');
  return datasets;
};
module.exports.showAll = showAll;

// get details for one dataset
const getDetails = async (name) => {
  const url = config.datasetsApi.detailEndpoint + '/' + name + '.json';
  try {
    return await getJson(url);
  } catch (err) {
    const all = await getAll();
    const available = all.map((d) => d.datasetIdInUrl).join(', ');
    throw new Error(
      'Dataset "' + name + '" not found. Available datasets: ' + available,
    );
  }
};
module.exports.getDetails = getDetails;

// pretty-print dataset details to stdout
const showDetails = async (name) => {
  const ds = await getDetails(name);
  const sizeMb = (ds.totalSize || 0) / 1_000_000;
  const description = (ds.description || '').slice(0, 100);
  log('  Name:             ' + ds.name);
  log('  Description:      ' + description + '...');
  log('  Updated:          ' + (ds.updatedAt || 'N/A'));
  log('  Earliest data:    ' + (ds.earliestSampleDate || 'N/A'));
  log('  Form types:       ' + (ds.formTypes || []).join(', '));
  log('  Format:           ' + (ds.containerFormat || 'N/A'));
  log(
    '  Total records:    ' +
      (ds.totalRecords ? ds.totalRecords.toLocaleString() : 'N/A'),
  );
  log('  Total size:       ' + sizeMb.toFixed(1) + ' MB');
  log('  Containers:       ' + (ds.containers || []).length);
  return ds;
};
module.exports.showDetails = showDetails;

// append api token to a download URL
const appendToken = (url, apiKey) => {
  const sep = url.includes('?') ? '&' : '?';
  return url + sep + 'token=' + apiKey;
};

// download a dataset. accepts either a dataset name string, or an options
// object { name, path, strategy }. strategy="containers" (default) downloads
// each container file individually for resumable, incremental syncs.
// strategy="zip" downloads the entire dataset as a single zip file. files are
// written atomically; on re-run, files matching the remote size are skipped.
const download = async (nameOrOptions) => {
  const options =
    typeof nameOrOptions === 'string'
      ? { name: nameOrOptions }
      : nameOrOptions || {};
  const { name, path: downloadPath, strategy = 'containers' } = options;
  const dataset = await getDetails(name);

  if (strategy === 'zip') {
    const targetDir = downloadPath || DEFAULT_DOWNLOAD_DIR;
    const url = appendToken(dataset.datasetDownloadUrl, store.apiKey);
    const dest = path.join(targetDir, name + '.zip');
    return downloadToFile({
      url,
      destPath: dest,
      expectedSize: dataset.totalSize,
    });
  }

  const targetDir = downloadPath || path.join(DEFAULT_DOWNLOAD_DIR, name);
  const containers = dataset.containers || [];
  const downloaded = [];

  for (const container of containers) {
    const url = appendToken(container.downloadUrl, store.apiKey);
    const dest = path.join(targetDir, container.key);
    await downloadToFile({
      url,
      destPath: dest,
      expectedSize: container.size,
    });
    downloaded.push(dest);
  }

  return downloaded;
};
module.exports.download = download;

// alias for download — keeps a local copy in sync with the remote
const sync = async (nameOrOptions) => {
  return download(nameOrOptions);
};
module.exports.sync = sync;
