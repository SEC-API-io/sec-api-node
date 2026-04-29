const https = require('https');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const MAX_REDIRECTS = 5;
const MAX_RETRIES = 3;

const agent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 15000,
  maxSockets: 10,
  scheduling: 'fifo',
});

// decompress response stream based on content-encoding header
const decompressStream = (res) => {
  const encoding = (res.headers['content-encoding'] || '').toLowerCase();
  if (encoding === 'gzip') {
    return res.pipe(zlib.createGunzip());
  }
  if (encoding === 'deflate') {
    return res.pipe(zlib.createInflate());
  }
  if (encoding === 'br') {
    return res.pipe(zlib.createBrotliDecompress());
  }
  return res;
};

// single http request, follows redirects, no retry
const singleRequest = ({
  url,
  method = 'GET',
  headers = {},
  body,
  _redirectCount = 0,
}) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);

    const req = https.request(
      parsedUrl,
      {
        method,
        headers: { 'Accept-Encoding': 'gzip, deflate', ...headers },
        agent,
      },
      (res) => {
        const status = res.statusCode;

        // follow 3xx redirects
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          if (_redirectCount >= MAX_REDIRECTS) {
            const error = new Error('Too many redirects');
            error.response = { status };
            reject(error);
            return;
          }
          const redirectUrl = new URL(res.headers.location, url).href;
          resolve(
            singleRequest({
              url: redirectUrl,
              method,
              headers,
              body,
              _redirectCount: _redirectCount + 1,
            }),
          );
          return;
        }

        if (status < 200 || status >= 300) {
          const stream = decompressStream(res);
          const chunks = [];
          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('end', () => {
            const body = Buffer.concat(chunks).toString('utf-8');
            let parsed = {};
            try {
              parsed = JSON.parse(body);
            } catch (_) {
              // not JSON
            }
            const errorMessage = parsed.error || body;
            const error = new Error(errorMessage);
            error.response = {
              status: parsed.status || status,
              httpStatus: status,
              error: parsed.error,
            };
            reject(error);
          });
          stream.on('error', reject);
          return;
        }

        const stream = decompressStream(res);
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => {
          resolve({
            status,
            headers: res.headers,
            data: Buffer.concat(chunks),
          });
        });
        stream.on('error', reject);
      },
    );

    req.on('error', reject);

    if (body) {
      req.write(body);
    }

    req.end();
  });
};

// request with automatic 429 retry and backoff
const requestWithRetry = async (options) => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await singleRequest(options);
    } catch (error) {
      const is429 = error.response && error.response.httpStatus === 429;
      const isFreeTierExhausted =
        is429 &&
        error.response.error &&
        error.response.error.includes('you exceeded the free');
      if (is429 && !isFreeTierExhausted && i < MAX_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
};

// GET request, parse response as JSON
const getJson = async (url) => {
  const { data } = await requestWithRetry({ url });
  return JSON.parse(data.toString('utf-8'));
};
module.exports.getJson = getJson;

// POST JSON body, parse response as JSON
const postJson = async ({ url, body, headers = {} }) => {
  const { data } = await requestWithRetry({
    url,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return JSON.parse(data.toString('utf-8'));
};
module.exports.postJson = postJson;

// GET request, return raw Buffer and response headers
const getBuffer = async (url) => {
  const { data, headers } = await requestWithRetry({ url });
  return { data, headers };
};
module.exports.getBuffer = getBuffer;

// GET request, return response body as a UTF-8 string
const getText = async (url) => {
  const { data } = await requestWithRetry({ url });
  return data.toString('utf-8');
};
module.exports.getText = getText;

// GET request, auto-detect JSON vs text based on content-type header
const get = async (url) => {
  const { data, headers } = await requestWithRetry({ url });
  const contentType = headers['content-type'] || '';
  if (contentType.includes('json')) {
    return JSON.parse(data.toString('utf-8'));
  }
  return data.toString('utf-8');
};
module.exports.get = get;

// stream a GET response directly to a file. follows redirects, no decompression
// (file payloads like .zip are already compressed). resolves on completion.
const streamToFile = ({ url, destPath, _redirectCount = 0 }) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);

    const req = https.request(parsedUrl, { method: 'GET', agent }, (res) => {
      const status = res.statusCode;

      // follow 3xx redirects
      if (status >= 300 && status < 400 && res.headers.location) {
        res.resume();
        if (_redirectCount >= MAX_REDIRECTS) {
          const error = new Error('Too many redirects');
          error.response = { status, httpStatus: status };
          reject(error);
          return;
        }
        const redirectUrl = new URL(res.headers.location, url).href;
        resolve(
          streamToFile({
            url: redirectUrl,
            destPath,
            _redirectCount: _redirectCount + 1,
          }),
        );
        return;
      }

      if (status < 200 || status >= 300) {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf-8');
          let parsed = {};
          try {
            parsed = JSON.parse(body);
          } catch (_) {
            // not JSON
          }
          const errorMessage = parsed.error || body;
          const error = new Error(errorMessage);
          error.response = {
            status: parsed.status || status,
            httpStatus: status,
            error: parsed.error,
          };
          reject(error);
        });
        res.on('error', reject);
        return;
      }

      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(() => {
          return resolve();
        });
      });
      fileStream.on('error', reject);
      res.on('error', reject);
    });

    req.on('error', reject);
    req.end();
  });
};

// download a URL to a local file with atomic write, retry, and skip-if-exists
// based on expected file size. writes to .tmp then renames on completion.
const downloadToFile = async ({ url, destPath, expectedSize }) => {
  if (fs.existsSync(destPath)) {
    if (
      expectedSize === undefined ||
      expectedSize === null ||
      fs.statSync(destPath).size === expectedSize
    ) {
      return destPath;
    }
  }

  const dir = path.dirname(destPath);
  if (dir && dir !== '.') {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tmpPath = destPath + '.tmp';

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await streamToFile({ url, destPath: tmpPath });
      fs.renameSync(tmpPath, destPath);
      return destPath;
    } catch (error) {
      if (fs.existsSync(tmpPath)) {
        try {
          fs.unlinkSync(tmpPath);
        } catch (_) {
          // ignore cleanup error
        }
      }
      if (
        error.response &&
        error.response.httpStatus === 429 &&
        attempt < MAX_RETRIES - 1
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, 500 * (attempt + 1)),
        );
        continue;
      }
      throw error;
    }
  }
};
module.exports.downloadToFile = downloadToFile;
