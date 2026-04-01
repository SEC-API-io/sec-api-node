const fs = require('fs');
const path = require('path');
const secApi = require('../index');

// Load API key from .env
const envFile = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf-8');
const apiKey = envFile.match(/SEC_API_IO_API_KEY=(.+)/)[1].trim();

// Set API key for all APIs
secApi.setApiKey(apiKey);

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (err) {
    failed++;
    console.log(`  ❌ ${name}`);
    console.log(`    ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

(async () => {
  console.log('\nQuery API');
  await test('getFilings returns results', async () => {
    const result = await secApi.queryApi.getFilings({
      query: 'formType:"10-Q" AND ticker:AAPL',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.filings && result.filings.length > 0, 'No filings returned');
  });

  console.log('\nFull-Text Search API');
  await test('getFilings returns results', async () => {
    const result = await secApi.fullTextSearchApi.getFilings({
      query: '"LPCN 1154"',
      formTypes: ['8-K', '10-Q'],
      startDate: '2021-01-01',
      endDate: '2021-06-14',
    });
    assert(result.filings && result.filings.length > 0, 'No filings returned');
  });

  console.log('\nDownload API');
  await test('getFile downloads filing content', async () => {
    const content = await secApi.downloadApi.getFile(
      'https://www.sec.gov/Archives/edgar/data/1318605/000162828025045968/tsla-20250930.htm',
    );
    assert(typeof content === 'string', 'Expected string content');
    assert(content.length > 1000, 'Content too short');
  });

  console.log('\nXBRL-to-JSON API');
  await test('xbrlToJson converts by accession number', async () => {
    const result = await secApi.xbrlApi.xbrlToJson({
      accessionNo: '0000320193-20-000096',
    });
    assert(result.CoverPage, 'Missing CoverPage');
    assert(result.StatementsOfIncome, 'Missing StatementsOfIncome');
  });

  console.log('\nExtractor API');
  await test('getSection extracts 10-K section', async () => {
    const text = await secApi.extractorApi.getSection(
      'https://www.sec.gov/Archives/edgar/data/1318605/000156459021004599/tsla-10k_20201231.htm',
      '1A',
      'text',
    );
    assert(typeof text === 'string', 'Expected string');
    assert(text.length > 100, 'Section text too short');
  });

  console.log('\nMapping API');
  await test('resolve ticker returns company data', async () => {
    const result = await secApi.mappingApi.resolve('ticker', 'TSLA');
    assert(Array.isArray(result), 'Expected array');
    assert(result.length > 0, 'No results');
    assert(result[0].ticker === 'TSLA', 'Wrong ticker');
  });

  console.log('\nInsider Trading API');
  await test('getData returns insider transactions', async () => {
    const result = await secApi.insiderTradingApi.getData({
      query: 'issuer.tradingSymbol:TSLA',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(
      result.transactions && result.transactions.length > 0,
      'No transactions returned',
    );
  });

  console.log('\nForm 144 API');
  await test('getData returns Form 144 filings', async () => {
    const result = await secApi.form144Api.getData({
      query: 'entities.ticker:TSLA',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.data, 'No data property');
  });

  console.log('\nForm 13F Holdings API');
  await test('getData returns 13F holdings', async () => {
    const result = await secApi.form13FHoldingsApi.getData({
      query: 'cik:1067983',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.data && result.data.length > 0, 'No data returned');
  });

  console.log('\nForm 13F Cover Pages API');
  await test('getData returns 13F cover pages', async () => {
    const result = await secApi.form13FCoverPagesApi.getData({
      query: 'cik:1067983',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.data && result.data.length > 0, 'No data returned');
  });

  console.log('\nForm 13D/13G API');
  await test('getData returns 13D/13G filings', async () => {
    const result = await secApi.form13DGApi.getData({
      query: 'accessionNo:*',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.filings, 'No filings property');
  });

  console.log('\nForm N-PORT API');
  await test('getData returns N-PORT filings', async () => {
    const result = await secApi.formNportApi.getData({
      query: 'fundInfo.totAssets:[100000000 TO *]',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.filings && result.filings.length > 0, 'No filings returned');
  });

  console.log('\nForm N-CEN API');
  await test('getData returns N-CEN filings', async () => {
    const result = await secApi.formNcenApi.getData({
      query: 'accessionNo:*',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.data, 'No data property');
  });

  console.log('\nForm N-PX API');
  await test('getMetadata returns N-PX metadata', async () => {
    const result = await secApi.formNpxApi.getMetadata({
      query: 'cik:884546',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.data, 'No data property');
  });

  console.log('\nForm S-1/424B4 API');
  await test('getData returns S-1 filings', async () => {
    const result = await secApi.formS1424B4Api.getData({
      query: 'ticker:RIVN',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.data, 'No data property');
  });

  console.log('\nForm D API');
  await test('getData returns Form D filings', async () => {
    const result = await secApi.formDApi.getData({
      query: 'offeringData.offeringSalesAmounts.totalOfferingAmount:[1000000 TO *]',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.offerings, 'No offerings property');
  });

  console.log('\nForm C API');
  await test('getData returns Form C filings', async () => {
    const result = await secApi.formCApi.getData({
      query: 'id:*',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.data, 'No data property');
  });

  console.log('\nReg A Search API');
  await test('getData returns Reg A filings', async () => {
    const result = await secApi.regASearchApi.getData({
      query: 'filedAt:[2024-01-01 TO 2024-12-31]',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.data, 'No data property');
  });

  console.log('\nForm 8-K API');
  await test('getData returns 8-K filings', async () => {
    const result = await secApi.form8KApi.getData({
      query: 'item4_01:* AND filedAt:[2024-01-01 TO 2024-12-31]',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.data, 'No data property');
  });

  console.log('\nForm ADV API');
  await test('getFirms returns advisory firms', async () => {
    const result = await secApi.formAdvApi.getFirms({
      query: 'Info.BusNm:"Bridgewater"',
      from: '0',
      size: '1',
      sort: [{ 'Info.FirmCrdNb': { order: 'desc' } }],
    });
    assert(result.filings && result.filings.length > 0, 'No filings returned');
  });

  console.log('\nExecutive Compensation API');
  await test('getData by ticker returns compensation data', async () => {
    const result = await secApi.execCompApi.getData('TSLA');
    assert(Array.isArray(result), 'Expected array');
    assert(result.length > 0, 'No results');
  });

  console.log('\nDirectors & Board Members API');
  await test('getData returns directors data', async () => {
    const result = await secApi.directorsBoardMembersApi.getData({
      query: 'ticker:AAPL',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.data, 'No data property');
  });

  console.log('\nFloat API');
  await test('getFloat returns share data', async () => {
    const result = await secApi.floatApi.getFloat({ ticker: 'AAPL' });
    assert(result && result.data, 'No data returned');
  });

  console.log('\nSubsidiary API');
  await test('getData returns subsidiary data', async () => {
    const result = await secApi.subsidiaryApi.getData({
      query: 'ticker:AAPL',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.data, 'No data property');
  });

  console.log('\nSEC Enforcement Actions API');
  await test('getData returns enforcement actions', async () => {
    const result = await secApi.secEnforcementActionsApi.getData({
      query: 'releasedAt:[2024-01-01 TO 2024-12-31]',
      from: '0',
      size: '1',
      sort: [{ releasedAt: { order: 'desc' } }],
    });
    assert(result.data && result.data.length > 0, 'No data returned');
  });

  console.log('\nSEC Litigation Releases API');
  await test('getData returns litigation releases', async () => {
    const result = await secApi.secLitigationsApi.getData({
      query: 'releasedAt:[2024-01-01 TO 2024-12-31]',
      from: '0',
      size: '1',
      sort: [{ releasedAt: { order: 'desc' } }],
    });
    assert(result.data && result.data.length > 0, 'No data returned');
  });

  console.log('\nSEC Administrative Proceedings API');
  await test('getData returns admin proceedings', async () => {
    const result = await secApi.secAdminProceedingsApi.getData({
      query: 'releasedAt:[2024-01-01 TO 2024-12-31]',
      from: '0',
      size: '1',
      sort: [{ releasedAt: { order: 'desc' } }],
    });
    assert(result.data && result.data.length > 0, 'No data returned');
  });

  console.log('\nAAER API');
  await test('getData returns AAERs', async () => {
    const result = await secApi.aaerApi.getData({
      query: 'dateTime:[2020-01-01 TO 2024-12-31]',
      from: '0',
      size: '1',
      sort: [{ dateTime: { order: 'desc' } }],
    });
    assert(result.data && result.data.length > 0, 'No data returned');
  });

  console.log('\nSRO Filings API');
  await test('getData returns SRO filings', async () => {
    const result = await secApi.sroFilingsApi.getData({
      query: 'sro:NYSE',
      from: '0',
      size: '1',
      sort: [{ issueDate: { order: 'desc' } }],
    });
    assert(result.data && result.data.length > 0, 'No data returned');
  });

  console.log('\nEDGAR Entities API');
  await test('getData returns entities', async () => {
    const result = await secApi.edgarEntitiesApi.getData({
      query: 'name:"Tesla"',
      from: '0',
      size: '1',
      sort: [{ cikUpdatedAt: { order: 'desc' } }],
    });
    assert(result.data && result.data.length > 0, 'No data returned');
  });

  console.log('\nAudit Fees API');
  await test('getData returns audit fees', async () => {
    const result = await secApi.auditFeesApi.getData({
      query: 'cik:1318605',
      from: '0',
      size: '1',
      sort: [{ filedAt: { order: 'desc' } }],
    });
    assert(result.data, 'No data property');
  });

  console.log('\nEDGAR Index Ingestion Log API');
  await test('getIngestionLog returns filings for a date', async () => {
    const result = await secApi.edgarIndexApi.getIngestionLog('2025-12-02');
    assert(result.data && result.data.length > 0, 'No data returned');
  });

  // Summary
  console.log(
    `\n${passed + failed} tests, ${passed} passed, ${failed} failed\n`,
  );
  process.exit(failed > 0 ? 1 : 0);
})();
