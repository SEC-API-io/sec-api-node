# SEC-API.io JavaScript API Library

<a href="https://sec-api.io/docs"><img src="https://sec-api.io/favicon.svg" alt="" width="48" align="left"/></a>

**The industry-standard for SEC & EDGAR data**, trusted by the world's largest hedge funds, investment banks, exchanges, law firms, and universities. Developed by PhDs in finance and physics.

<br clear="left"/>

[![Documentation](https://img.shields.io/badge/Documentation-sec--api.io-blue)](https://sec-api.io/docs)
[![npm downloads](https://img.shields.io/npm/dm/sec-api)](https://www.npmjs.com/package/sec-api)

- **20+ million EDGAR filings** and **100+ million exhibits** — from investor presentations, credit agreements, M&A, government contracts, and executive employment agreements to board composition and subsidiaries
- **800,000+ entities, survivorship-bias free** — covers every SEC-regulated filer that ever reported, including delisted companies, dissolved funds, terminated advisors, and entities no longer reporting. From insiders and public/private companies to ETFs, mutual funds, hedge funds, foreign private issuers, BDCs, REITs, shell companies, and more
- **All 500+ EDGAR form types** — annual and quarterly reports (10-K, 10-Q, 20-F, 40-F), proxy statements (DEF 14A) and voting records, registration statements and prospectuses, and everything in between, including form types no longer in use
- **Full historical time range** — from 1993 to present, with data updated in real-time

The full API documentation is available at [sec-api.io/docs](https://sec-api.io/docs).

## Quick Start

```bash
npm install sec-api
```

Both CommonJS and ESM imports are supported:

```js
const { downloadApi } = require('sec-api'); // CommonJS
import { downloadApi } from 'sec-api'; // ESM
```

**Download EDGAR Filings Free of Charge**

```js
const { downloadApi } = require('sec-api');

// optional, only needed for higher rate limits.
// downloadApi.setApiKey('YOUR_API_KEY');

const filingUrl =
  'https://www.sec.gov/Archives/edgar/data/1318605/000162828025045968/tsla-20250930.htm';

const data = await downloadApi.getFile(filingUrl);

console.log(data.slice(0, 1000));
```

## Feature Overview

**EDGAR Filing Search & Download APIs**

- [SEC Filing Search API](#sec-edgar-filings-query-api)
- [Full-Text Search API](#full-text-search-api)
- [Real-Time Filing Stream API](#filings-real-time-stream-api)
- [Download API - Download any SEC filing, exhibit and attached file](#filing--exhibit-download-api)
- [PDF Generator API - Download SEC filings and exhibits as PDF](#pdf-generator-api)
- [EDGAR Filings Ingestion Logs API](#edgar-filings-ingestion-logs-api)

**Bulk Datasets**

- [Bulk Datasets - Download complete EDGAR filing datasets](#bulk-datasets)

**Converter & Extractor APIs**

- [XBRL-to-JSON Converter API + Financial Statements](#xbrl-to-json-converter-api)
- [10-K/10-Q/8-K Section Extraction API](#10-k10-q8-k-section-extractor-api)

**Investment Advisers**

- [Form ADV API - Investment Advisors (Firm & Indvl. Advisors, Brochures, Schedules)](#form-adv-api)

**Ownership Data APIs**

- [Form 3/4/5 API - Insider Trading Disclosures](#insider-trading-data-api)
  - [Form 3 - Initial Ownership Statements](#form-3---initial-ownership-statements)
  - [Form 4 - Changes in Ownership](#form-4---changes-in-ownership)
  - [Form 5 - Annual Ownership Statements](#form-5---annual-ownership-statements)
- [Form 144 API - Restricted Stock Sales by Insiders](#form-144-api)
- [Form 13F API - Institutional Investment Manager Holdings & Cover Pages](#form-13f-institutional-holdings-database)
- [Form 13D/13G API - Activist and Passive Investor Holdings](#form-13d-13g-api)
- [Form N-PORT API - Mutual Funds, ETFs and Closed-End Fund Holdings](#form-n-port-api)

**Investment Companies**

- [Form N-CEN API - Annual Reports](#form-n-cen-api---annual-reports-by-investment-companies)
- [Form N-PX API - Proxy Voting Records](#form-n-px-proxy-voting-records-api)

**Security Offerings APIs**

- [Form S-1/424B4 API - Registration Statements and Prospectuses (IPOs, Debt/Warrants/... Offerings)](#form-s-1424b4-api)
- [Form C API - Crowdfunding Offerings & Campaigns](#form-c-api---crowdfunding-campaigns)
- [Form D API - Private Security Offerings](#form-d-api)
- [Regulation A APIs - Offering Statements by Small Companies (Form 1-A, Form 1-K, Form 1-Z)](#regulation-a-apis)

**Structured Material Event Data from Form 8-K**

- [Auditor and Accountant Changes (Item 4.01)](#auditor-and-accountant-changes-item-401)
- [Financial Restatements & Non-Reliance on Prior Financial Results (Item 4.02)](#financial-restatements--non-reliance-on-prior-financial-results-item-402)
- [Changes of Directors, Board Members and Compensation Plans (Item 5.02)](#changes-of-directors-executives-board-members-and-compensation-plans-item-502)

**Public Company Data**

- [Directors & Board Members API](#directors--board-members-data-api)
- [Executive Compensation Data API](#executive-compensation-data-api)
- [Outstanding Shares & Public Float](#outstanding-shares--public-float-api)
- [Company Subsidiary API](#subsidiary-api)
- [Audit Fees Data API](#audit-fees-data-api)

**Enforcement Actions, Proceedings, AAERs & SRO Filings**

- [SEC Enforcement Actions](#sec-enforcement-actions-database-api)
- [SEC Litigation Releases](#sec-litigation-releases-database-api)
- [SEC Administrative Proceedings](#sec-administrative-proceedings-database-api)
- [AAER Database API - Accounting and Auditing Enforcement Releases](#aaer-database-api)
- [SRO Filings Database API](#sro-filings-database-api)

**Other APIs**

- [CUSIP/CIK/Ticker Mapping API](#cusipcikticker-mapping-api)
- [EDGAR Entities Database API](#edgar-entities-database)

## SEC EDGAR Filings Query API

The Query API allows searching and filtering all 20 million filings and 100 million exhibits published on the SEC EDGAR database since 1993 to present, with new filings being added in 300 milliseconds after their publication on EDGAR.

```js
const { queryApi } = require('sec-api');

queryApi.setApiKey('YOUR_API_KEY');

const query = {
  query: 'formType:"10-Q" AND ticker:AAPL',
  from: '0', // used for pagination. set to 50 to retrieve the next 50 metadata objects.
  size: '50', // number of results per response
  sort: [{ filedAt: { order: 'desc' } }], // sort result by filedAt
};

const filings = await queryApi.getFilings(rawQuery);
// response: { total, filings }
```

<details>
  <summary>Full Response Example</summary>
  
```json
{
  "total": {  "value": 47,  "relation": "eq" },
  "filings": [
    {
      "id": "3ba530142cd52e76b7e15cc9000d2c33",
      "ticker": "TSLA",
      "formType": "10-Q",
      "description": "Form 10-Q - Quarterly report [Sections 13 or 15(d)]",
      "accessionNo": "0001628280-25-045968",
      "cik": "1318605",
      "companyNameLong": "Tesla, Inc. (Filer)",
      "companyName": "Tesla, Inc.",
      "filedAt": "2025-10-22T21:08:43-04:00",
      "periodOfReport": "2025-09-30",
      "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1318605/000162828025045968/0001628280-25-045968-index.htm",
      "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1318605/000162828025045968/tsla-20250930.htm",
      "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1318605/000162828025045968/0001628280-25-045968.txt",
      "entities": [
        {
          "fiscalYearEnd": "1231",
          "stateOfIncorporation": "TX",
          "act": "34",
          "cik": "1318605",
          "fileNo": "001-34756",
          "irsNo": "912197729",
          "companyName": "Tesla, Inc. (Filer)",
          "type": "10-Q",
          "sic": "3711 Motor Vehicles &amp; Passenger Car Bodies",
          "filmNo": "251411222",
          "undefined": "04 Manufacturing)"
        }
      ],
      "documentFormatFiles": [
        {
          "sequence": "1",
          "size": "1573631",
          "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1318605/000162828025045968/tsla-20250930.htm",
          "description": "10-Q",
          "type": "10-Q"
        },
        // ... more files
      ],
      "dataFiles": [
        {
          "sequence": "5",
          "size": "54524",
          "documentUrl": "https://www.sec.gov/Archives/edgar/data/1318605/000162828025045968/tsla-20250930.xsd",
          "description": "XBRL TAXONOMY EXTENSION SCHEMA DOCUMENT",
          "type": "EX-101.SCH"
        },
        // ... more files
      ],
    },
  ]
}
```

</details>

<details>
  <summary>8-K Filing Response Example (Item 2.02)</summary>

```json
{
  "total": { "value": 10000, "relation": "gte" },
  "query": { "from": 0, "size": 1 },
  "filings": [
    {
      "id": "74c44f9aefc62f7788ffdccf30596225",
      "ticker": "FFAI",
      "formType": "8-K",
      "accessionNo": "0001213900-26-037931",
      "cik": "1805521",
      "companyNameLong": "FARADAY FUTURE INTELLIGENT ELECTRIC INC. (Filer)",
      "companyName": "FARADAY FUTURE INTELLIGENT ELECTRIC INC.",
      "description": "Form 8-K - Current report - Item 2.02 Item 8.01 Item 9.01",
      "filedAt": "2026-04-01T06:11:36-04:00",
      "periodOfReport": "2026-03-31",
      "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1805521/000121390026037931/0001213900-26-037931-index.htm",
      "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1805521/000121390026037931/ea0284262-8k_faraday.htm",
      "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1805521/000121390026037931/0001213900-26-037931.txt",
      "entities": [
        {
          "fiscalYearEnd": "1231",
          "stateOfIncorporation": "DE",
          "act": "34",
          "cik": "1805521",
          "fileNo": "001-39395",
          "irsNo": "844720320",
          "companyName": "FARADAY FUTURE INTELLIGENT ELECTRIC INC. (Filer)",
          "type": "8-K",
          "sic": "3711 Motor Vehicles & Passenger Car Bodies"
        }
      ],
      "documentFormatFiles": [
        {
          "sequence": "1",
          "size": "31779",
          "documentUrl": "https://www.sec.gov/ix?doc=/Archives/edgar/data/1805521/000121390026037931/ea0284262-8k_faraday.htm",
          "description": "CURRENT REPORT",
          "type": "8-K"
        },
        {
          "sequence": "2",
          "size": "137883",
          "documentUrl": "https://www.sec.gov/Archives/edgar/data/1805521/000121390026037931/ea028426201ex99-1.htm",
          "description": "PRESS RELEASE",
          "type": "EX-99.1"
        }
        // ... more files
      ],
      "dataFiles": []
    }
  ]
}
```

</details>

<details>
  <summary>Series & Classes Filing Response Example</summary>

```json
{
  "total": { "value": 874, "relation": "eq" },
  "query": { "from": 0, "size": 1 },
  "filings": [
    {
      "id": "74c44f9aefc62f7788ffdccf30596225",
      "ticker": "",
      "formType": "24F-2NT",
      "accessionNo": "0001410368-25-042647",
      "cik": "832808",
      "companyNameLong": "BERNSTEIN SANFORD C FUND INC (Filer)",
      "companyName": "BERNSTEIN SANFORD C FUND INC",
      "description": "Form 24F-2NT - Rule 24f-2 notice",
      "filedAt": "2025-12-29T08:59:06-05:00",
      "periodOfReport": "2025-09-30",
      "linkToHtml": "https://www.sec.gov/Archives/edgar/data/832808/000141036825042647/0001410368-25-042647-index.htm",
      "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/832808/000141036825042647/xsl24F-2NT/primary_doc.xml",
      "linkToTxt": "https://www.sec.gov/Archives/edgar/data/832808/000141036825042647/0001410368-25-042647.txt",
      "entities": [
        {
          "fiscalYearEnd": "0930",
          "stateOfIncorporation": "MD",
          "act": "33",
          "cik": "832808",
          "fileNo": "033-21844",
          "irsNo": "133464161",
          "companyName": "BERNSTEIN SANFORD C FUND INC (Filer)",
          "type": "24F-2NT"
        }
      ],
      "seriesAndClassesContractsInformation": [
        {
          "series": "S000011051",
          "name": "California Municipal Portfolio",
          "classesContracts": [
            {
              "ticker": "AICAX",
              "name": "AB Intermediate California Municipal Class A",
              "classContract": "C000030481"
            },
            {
              "ticker": "ACMCX",
              "name": "AB Intermediate California Municipal Class C",
              "classContract": "C000030483"
            },
            {
              "ticker": "SNCAX",
              "name": "California Municipal Class",
              "classContract": "C000084881"
            }
            // ... more classes
          ]
        },
        {
          "series": "S000011055",
          "name": "Diversified Municipal Portfolio",
          "classesContracts": [
            {
              "ticker": "AIDAX",
              "name": "AB Intermediate Diversified Municipal Class A",
              "classContract": "C000030490"
            }
            // ... more classes
          ]
        }
        // ... more series
      ],
      "documentFormatFiles": [
        {
          "sequence": "1",
          "size": "5162",
          "documentUrl": "https://www.sec.gov/Archives/edgar/data/832808/000141036825042647/primary_doc.xml",
          "type": "24F-2NT"
        }
      ],
      "dataFiles": []
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/query-api

## Full-Text Search API

The SEC Filing Full-Text Search API enables searches across the full text of all EDGAR filings submitted since 2001. Each search scans the entire filing content, including all attachments, such as exhibits.

The following example returns all 8-K and 10-Q filings and their exhibits, filed between 01-01-2021 and 14-06-2021, that include the exact phrase "LPCN 1154".

```js
const { fullTextSearchApi } = require('sec-api');

fullTextSearchApi.setApiKey('YOUR_API_KEY');

const query = {
  query: '"LPCN 1154"',
  formTypes: ['8-K', '10-Q'],
  startDate: '2021-01-01',
  endDate: '2021-06-14',
};

const filings = await fullTextSearchApi.getFilings(rawQuery);
// response: { total, filings }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 3, "relation": "eq" },
  "filings": [
    {
      "accessionNo": "0001104659-21-080527",
      "cik": "1535955",
      "companyNameLong": "Lipocine Inc. (LPCN) (CIK 0001535955)",
      "ticker": "LPCN",
      "description": "EXHIBIT 99.1",
      "formType": "8-K",
      "type": "EX-99.1",
      "filingUrl": "https://www.sec.gov/Archives/edgar/data/1535955/000110465921080527/tm2119438d1_ex99-1.htm",
      "filedAt": "2021-06-14"
    }
    // ... more filings
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/full-text-search-api

## Filings Real-Time Stream API

The Stream API provides a real-time feed of the latest filings submitted to the SEC EDGAR database via a WebSocket connection. This push-based technology ensures immediate delivery of metadata for each new filing as it becomes publicly available.

```js
const WebSocket = require('ws');

const API_KEY = 'YOUR_API'; // replace this with your actual API key
const STREAM_API_URL = 'wss://stream.sec-api.io?apiKey=' + API_KEY;

const ws = new WebSocket(STREAM_API_URL);

ws.on('open', () => console.log('✅ Connected to:', STREAM_API_URL));
ws.on('close', () => console.log('Connection closed'));
ws.on('error', (err) => console.log('Error:', err.message));

ws.on('message', (message) => {
  const filings = JSON.parse(message.toString());
  filings.forEach((filing) => {
    console.log(
      filing.id,
      filing.cik,
      filing.formType,
      filing.filedAt,
      filing.linkToFilingDetails,
    );
  });
});
```

> See the documentation for more details: https://sec-api.io/docs/stream-api

## Filing & Exhibit Download API

On the free plan, you can download up to 20 SEC filings per second without an API key. Paid plans allow for higher throughput—up to 60,000 filings within a 5-minute window. Access is provided to all 20+ million EDGAR filings dating back to 1993, including over 100 million attachments and exhibits such as Exhibit 99, complete submission files, SGML headers, and more.

```js
const { downloadApi } = require('sec-api');

downloadApi.setApiKey('YOUR_API_KEY');

const filingUrl =
  'https://www.sec.gov/Archives/edgar/data/1841925/000121390021032758/ea142795-8k_indiesemic.htm';

const filingContent = await downloadApi.getFile(filingUrl);
// response: string (HTML/text) or Buffer (PDF/binary)
```

> See the documentation for more details: https://sec-api.io/docs/sec-filings-render-api

## XBRL-To-JSON Converter API

Parse and standardize any XBRL data and convert it to standardized JSON format in seconds without coding. Extract financial statements from annual and quarterly reports (10-K, 10-Q, 20-F, 40-F), offerings such as S-1 filings, and post-effective amendements for registration statements (POS AM), accounting policies and footnotes, risk-return summaries of mutual fund and ETF prospectuses (485BPOS) and general information from event filings (8-K). All XBRL-supported filing types can be converterd.

### Income Statement Item Example

```json
{
  "StatementsOfIncome": {
    "RevenueFromContractWithCustomerExcludingAssessedTax": [
      {
        "decimals": "-6",
        "unitRef": "usd",
        "period": {
          "startDate": "2019-09-29",
          "endDate": "2020-09-26"
        },
        "value": "274515000000"
      },
      {
        "decimals": "-6",
        "unitRef": "usd",
        "period": {
          "startDate": "2018-09-30",
          "endDate": "2019-09-28"
        },
        "value": "260174000000"
      }
    ]
  }
}
```

### Usage

Convert XBRL filings to JSON using one of the following three input methods:

1. **`htmUrl`** - URL of the filing’s HTML page (typically ending in `.htm`).
   Example: `https://www.sec.gov/Archives/edgar/data/1318605/000156459021004599/tsla-10k_20201231.htm`
2. **`xbrlUrl`** - Direct URL to the XBRL instance document (ending in `.xml`).
   This URL is available in the `dataFiles` array returned by the query API. Look for an item with the description `"EXTRACTED XBRL INSTANCE DOCUMENT"` or similar.
   Example: `https://www.sec.gov/Archives/edgar/data/1318605/000156459021004599/tsla-10k_20201231_htm.xml`
3. **`accessionNo`** - SEC accession number of the filing (e.g., `0001564590-21-004599`).

```js
const { xbrlApi } = secApi;

xbrlApi.setApiKey('YOUR_API_KEY');

// 10-K HTM File URL example
const xbrlJson1 = await xbrlApi.xbrlToJson({
  htmUrl:
    'https://www.sec.gov/Archives/edgar/data/320193/000032019320000096/aapl-20200926.htm',
});

// 10-K XBRL File URL Example
const xbrlJson2 = await xbrlApi.xbrlToJson({
  xbrlUrl:
    'https://www.sec.gov/Archives/edgar/data/320193/000032019320000096/aapl-20200926_htm.xml',
});

// 10-K Accession Number Example
const xbrlJson3 = await xbrlApi.xbrlToJson({
  accessionNo: '0000320193-20-000096',
});
// response: { CoverPage, StatementsOfIncome, BalanceSheets, StatementsOfCashFlows, ... }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "CoverPage": {
    "DocumentPeriodEndDate": "2020-09-26",
    "EntityRegistrantName": "Apple Inc.",
    "EntityIncorporationStateCountryCode": "CA",
    "EntityTaxIdentificationNumber": "94-2404110",
    "EntityAddressAddressLine1": "One Apple Park Way",
    "EntityAddressCityOrTown": "Cupertino",
    "EntityAddressStateOrProvince": "CA",
    "EntityAddressPostalZipCode": "95014",
    "CityAreaCode": "408",
    "LocalPhoneNumber": "996-1010",
    "TradingSymbol": "AAPL",
    "EntityPublicFloat": {
      "decimals": "-6",
      "unitRef": "usd",
      "period": {
        "instant": "2020-03-27"
      },
      "value": "1070633000000"
    },
    "EntityCommonStockSharesOutstanding": {
      "decimals": "-3",
      "unitRef": "shares",
      "period": {
        "instant": "2020-10-16"
      },
      "value": "17001802000"
    },
    "DocumentFiscalPeriodFocus": "FY",
    "CurrentFiscalYearEndDate": "--09-26"
  },
  "StatementsOfIncome": {
    "RevenueFromContractWithCustomerExcludingAssessedTax": [
      {
        "decimals": "-6",
        "unitRef": "usd",
        "period": {
          "startDate": "2019-09-29",
          "endDate": "2020-09-26"
        },
        "segment": {
          "dimension": "srt:ProductOrServiceAxis",
          "value": "us-gaap:ProductMember"
        },
        "value": "220747000000"
      },
      {
        "decimals": "-6",
        "unitRef": "usd",
        "period": {
          "startDate": "2018-09-30",
          "endDate": "2019-09-28"
        },
        "segment": {
          "dimension": "srt:ProductOrServiceAxis",
          "value": "us-gaap:ProductMember"
        },
        "value": "213883000000"
      }
    ]
  },
  "BalanceSheets": {
    "CashAndCashEquivalentsAtCarryingValue": [
      {
        "decimals": "-6",
        "unitRef": "usd",
        "period": {
          "instant": "2020-09-26"
        },
        "value": "38016000000"
      },
      {
        "decimals": "-6",
        "unitRef": "usd",
        "period": {
          "instant": "2019-09-28"
        },
        "value": "48844000000"
      },
      {
        "decimals": "-6",
        "unitRef": "usd",
        "period": {
          "instant": "2020-09-26"
        },
        "segment": {
          "dimension": "us-gaap:FinancialInstrumentAxis",
          "value": "us-gaap:CashMember"
        },
        "value": "17773000000"
      }
    ]
  }
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/xbrl-to-json-converter-api

## 10-K/10-Q/8-K Section Extractor API

The Extractor API extracts any text section from 10-Q, 10-K and 8-K SEC filings, and returns the extracted content in cleaned and standardized text or HTML format.

Supported sections:

<details>
  <summary>10-K Sections</summary>

- 1 - Business
- 1A - Risk Factors
- 1B - Unresolved Staff Comments
- 1C - Cybersecurity
- 2 - Properties
- 3 - Legal Proceedings
- 4 - Mine Safety Disclosures
- 5 - Market for Registrant’s Common Equity, Related Stockholder Matters and Issuer Purchases of Equity Securities
- 6 - Selected Financial Data (prior to February 2021)
- 7 - Management’s Discussion and Analysis of Financial Condition and Results of Operations
- 7A - Quantitative and Qualitative Disclosures about Market Risk
- 8 - Financial Statements and Supplementary Data
- 9 - Changes in and Disagreements with Accountants on Accounting and Financial Disclosure
- 9A - Controls and Procedures
- 9B - Other Information
- 10 - Directors, Executive Officers and Corporate Governance
- 11 - Executive Compensation
- 12 - Security Ownership of Certain Beneficial Owners and Management and Related Stockholder Matters
- 13 - Certain Relationships and Related Transactions, and Director Independence
- 14 - Principal Accountant Fees and Services
- 15 - Exhibits and Financial Statement Schedules

</details>

<details>
  <summary>10-Q Sections</summary>

- **Part 1:**
  - 1 - Financial Statements
  - 2 - Management’s Discussion and Analysis of Financial Condition and Results of Operations
  - 3 - Quantitative and Qualitative Disclosures About Market Risk
  - 4 - Controls and Procedures

- **Part 2:**
  - 1 - Legal Proceedings
  - 1A - Risk Factors
  - 2 - Unregistered Sales of Equity Securities and Use of Proceeds
  - 3 - Defaults Upon Senior Securities
  - 4 - Mine Safety Disclosures
  - 5 - Other Information
  - 6 - Exhibits

</details>
<details>
  <summary>8-K Sections</summary>

- 1.01: Entry into a Material Definitive Agreement
- 1.02: Termination of a Material Definitive Agreement
- 1.03: Bankruptcy or Receivership
- 1.04: Mine Safety - Reporting of Shutdowns and Patterns of Violations
- 1.05: Material Cybersecurity Incidents (introduced in 2023)
- 2.01: Completion of Acquisition or Disposition of Assets
- 2.02: Results of Operations and Financial Condition
- 2.03: Creation of a Direct Financial Obligation or an Obligation under an Off-Balance Sheet Arrangement of a Registrant
- 2.04: Triggering Events That Accelerate or Increase a Direct Financial Obligation or an Obligation under an Off-Balance Sheet Arrangement
- 2.05: Cost Associated with Exit or Disposal Activities
- 2.06: Material Impairments
- 3.01: Notice of Delisting or Failure to Satisfy a Continued Listing Rule or Standard; Transfer of Listing
- 3.02: Unregistered Sales of Equity Securities
- 3.03: Material Modifications to Rights of Security Holders
- 4.01: Changes in Registrant's Certifying Accountant
- 4.02: Non-Reliance on Previously Issued Financial Statements or a Related Audit Report or Completed Interim Review
- 5.01: Changes in Control of Registrant
- 5.02: Departure of Directors or Certain Officers; Election of Directors; Appointment of Certain Officers: Compensatory Arrangements of Certain Officers
- 5.03: Amendments to Articles of Incorporation or Bylaws; Change in Fiscal Year
- 5.04: Temporary Suspension of Trading Under Registrant's Employee Benefit Plans
- 5.05: Amendments to the Registrant's Code of Ethics, or Waiver of a Provision of the Code of Ethics
- 5.06: Change in Shell Company Status
- 5.07: Submission of Matters to a Vote of Security Holders
- 5.08: Shareholder Nominations Pursuant to Exchange Act Rule 14a-11
- 6.01: ABS Informational and Computational Material
- 6.02: Change of Servicer or Trustee
- 6.03: Change in Credit Enhancement or Other External Support
- 6.04: Failure to Make a Required Distribution
- 6.05: Securities Act Updating Disclosure
- 6.06: Static Pool
- 6.10: Alternative Filings of Asset-Backed Issuers
- 7.01: Regulation FD Disclosure
- 8.01: Other Events
- 9.01: Financial Statements and Exhibits
- Signature

</details>

### Usage

```js
const { extractorApi } = secApi;

// Tesla 10-K filing
const filingUrl =
  'https://www.sec.gov/Archives/edgar/data/1318605/000156459021004599/tsla-10k_20201231.htm';

const sectionText = await extractorApi.getSection(filingUrl, '1A', 'text');
const sectionHtml = await extractorApi.getSection(filingUrl, '1A', 'html');

// response: string (plain text or HTML)
console.log(sectionText);
console.log(sectionHtml);
```

> See the documentation for more details: https://sec-api.io/docs/sec-filings-item-extraction-api

## PDF Generator API

Download any SEC filing or exhibit as a PDF file.

```js
const { pdfGeneratorApi } = require('sec-api');

pdfGeneratorApi.setApiKey('YOUR_API_KEY');

const filingUrl =
  'https://www.sec.gov/Archives/edgar/data/1318605/000156459021004599/tsla-10k_20201231.htm';

const pdfBuffer = await pdfGeneratorApi.getPdf(filingUrl);

// write PDF to file
const fs = require('fs');
// response: Buffer (PDF binary)
fs.writeFileSync('tesla-10k.pdf', pdfBuffer);
```

> See the documentation for more details: https://sec-api.io/docs/sec-filings-render-api

## EDGAR Filings Ingestion Logs API

Retrieve a log of all filings ingested from SEC EDGAR on a specific date. Returns accession numbers, form types, and filing timestamps for all filings published on the requested date. Data is available from December 2, 2025 onwards.

```js
const { edgarIndexApi } = require('sec-api');

edgarIndexApi.setApiKey('YOUR_API_KEY');

const log = await edgarIndexApi.getIngestionLog('2025-12-02');
// response: { lastUpdatedAt, total, data }
```

<details>
  <summary>Example Response</summary>

```json
{
  "lastUpdatedAt": "2025-12-02T21:57:46-05:00",
  "total": { "value": 3041, "relation": "eq" },
  "data": [
    {
      "accessionNo": "0001193125-25-305761",
      "formType": "S-1MEF",
      "filedAt": "2025-12-02T21:57:17-05:00"
    },
    {
      "accessionNo": "0001493152-25-025840",
      "formType": "4",
      "filedAt": "2025-12-02T21:56:21-05:00"
    }
    // ... more filings
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/edgar-index-apis

## Bulk Datasets

Download complete datasets for offline analysis and large-scale processing. All datasets are updated daily between 10:30 PM and 11:30 PM EST. Browse all available datasets at [sec-api.io/datasets](https://sec-api.io/datasets).

| Dataset                                             | Form Types                  | Coverage     | Format               |
| --------------------------------------------------- | --------------------------- | ------------ | -------------------- |
| Form 10-K - Annual Reports                          | 10-K, 10-K/A, 10-KSB, 10-KT | 1993-present | ZIP (HTML, TXT)      |
| Form 10-Q - Quarterly Reports                       | 10-Q, 10-Q/A                | 1993-present | ZIP (HTML, TXT)      |
| Form 8-K Exhibit 99 - Press Releases                | 8-K, 8-K/A                  | 1994-present | ZIP (HTML, TXT, PDF) |
| Earnings Results (Item 2.02)                        | 8-K, 8-K/A                  | 2004-present | ZIP (HTML, TXT, PDF) |
| Form 3 - Initial Ownership                          | 3, 3/A                      | 2009-present | JSONL                |
| Form 4 - Changes in Ownership                       | 4, 4/A                      | 2009-present | JSONL                |
| Form 5 - Annual Ownership                           | 5, 5/A                      | 2009-present | JSONL                |
| Form 13F - Institutional Holdings                   | 13F-HR, 13F-HR/A            | 2013-present | JSONL                |
| Form N-PORT - Fund Holdings                         | NPORT, NPORT/A              | 2019-present | JSONL                |
| Form DEF 14A - Proxy Statements                     | DEF 14A                     | 1994-present | ZIP (HTML, TXT)      |
| [View all datasets...](https://sec-api.io/datasets) |                             |              |                      |

## Form ADV API

Search and access Form ADV data for registered investment advisers, including firm information, individual advisors, direct/indirect owners, private fund data, and brochures.

### Search Advisory Firms

```js
const { formAdvApi } = require('sec-api');

formAdvApi.setApiKey('YOUR_API_KEY');

const firms = await formAdvApi.getFirms({
  query: 'Info.BusNm:"Bridgewater"',
  from: '0',
  size: '10',
  sort: [{ 'Info.FirmCrdNb': { order: 'desc' } }],
});
// response: { total, filings }
```

<details>
  <summary>Example Response (shortened)</summary>

```json
{
  "total": { "value": 1, "relation": "eq" },
  "filings": [
    {
      "Info": {
        "SECRgnCD": "NYRO",
        "FirmCrdNb": 361,
        "SECNb": "801-16048",
        "BusNm": "GOLDMAN SACHS & CO. LLC",
        "LegalNm": "GOLDMAN SACHS & CO. LLC",
        "UmbrRgstn": "N"
      },
      "MainAddr": {
        "Strt1": "200 WEST STREET",
        "City": "NEW YORK",
        "State": "NY",
        "Cntry": "United States",
        "PostlCd": "10282",
        "PhNb": "212-902-1000"
      },
      "MailingAddr": {},
      "Rgstn": [
        { "FirmType": "Registered", "St": "APPROVED", "Dt": "1981-05-13" }
      ],
      "NoticeFiled": {
        "States": [{ "RgltrCd": "AL", "St": "FILED", "Dt": "1992-10-28" }]
      },
      "Filing": [{ "Dt": "2026-03-31", "FormVrsn": "10/2021" }],
      "FormInfo": {
        "Part1A": {
          "Item1": { "Q1F5": 18, "Q1ODesc": "More than $50 billion" },
          "Item5A": { "TtlEmp": 2268 },
          "Item5F": { "Q5F2C": 133644228926, "Q5F2F": 46269 }
          // ... Items 2A-11H included in full response
        }
      },
      "id": 361
    }
  ]
}
```

</details>

[Full example response](https://github.com/janlukasschroeder/sec-api/blob/master/examples/api-responses/form-adv-firms.json)

### Search Individual Advisors

```js
const individuals = await formAdvApi.getIndividuals({
  query: 'CrntEmps.CrntEmp.orgPK:149777',
  from: '0',
  size: '10',
  sort: [{ id: { order: 'desc' } }],
});
// response: { total, filings }
```

<details>
  <summary>Example Response (shortened)</summary>

```json
{
  "total": { "value": 10000, "relation": "gte" },
  "filings": [
    {
      "Info": {
        "lastNm": "Nebot",
        "firstNm": "Roman",
        "indvlPK": 8213636,
        "actvAGReg": "Y",
        "link": "https://adviserinfo.sec.gov/individual/summary/8213636"
      },
      "OthrNms": {
        "OthrNm": [
          { "lastNm": "Nebot creus", "firstNm": "Roman", "midNm": "D" }
        ]
      },
      "CrntEmps": {
        "CrntEmp": [
          {
            "CrntRgstns": {
              "CrntRgstn": [
                {
                  "regAuth": "FL",
                  "regCat": "RA",
                  "st": "APPROVED",
                  "stDt": "2026-02-02"
                }
              ]
            },
            "orgNm": "MORGAN STANLEY",
            "orgPK": 149777
          }
        ]
      },
      "Exms": {
        "Exm": [
          {
            "exmCd": "S66",
            "exmNm": "Uniform Combined State Law Examination",
            "exmDt": "2025-12-08"
          }
        ]
      },
      "EmpHss": {
        "EmpHs": [
          {
            "fromDt": "02/2019",
            "toDt": "01/2026",
            "orgNm": "Santander Internacional S.A.",
            "city": "Miami",
            "state": "FL"
          }
        ]
      },
      "DRPs": {},
      "id": 8213636
      // ... also includes: Dsgntns, PrevRgstns, OthrBuss, BrnchOfLocs
    }
  ]
}
```

</details>

[Full example response](https://github.com/janlukasschroeder/sec-api/blob/master/examples/api-responses/form-adv-individuals.json)

### Get Direct Owners (Schedule A)

```js
const directOwners = await formAdvApi.getDirectOwners('793');
// response: [...] array of direct owners
```

<details>
  <summary>Example Response</summary>

```json
[
  {
    "name": "ZEMLYAK, JAMES MARK",
    "ownerType": "I",
    "titleStatus": "EXECUTIVE VICE PRESIDENT & DIRECTOR",
    "dateTitleStatusAcquired": "2002-08",
    "ownershipCode": "NA",
    "isControlPerson": true,
    "isPublicReporting": false,
    "crd": "1586132"
  },
  {
    "name": "STIFEL FINANCIAL CORP.",
    "ownerType": "DE",
    "titleStatus": "SHAREHOLDER",
    "dateTitleStatusAcquired": "1982-02",
    "ownershipCode": "E",
    "isControlPerson": true,
    "isPublicReporting": true,
    "crd": ""
  }
  // ... more owners
]
```

</details>

[Full example response](https://github.com/janlukasschroeder/sec-api/blob/master/examples/api-responses/form-adv-direct-owners.json)

### Get Indirect Owners (Schedule B)

```js
const indirectOwners = await formAdvApi.getIndirectOwners('326262');
// response: [...] array of indirect owners
```

<details>
  <summary>Example Response</summary>

```json
[
  {
    "name": "CORIENT PARTNERS LLC",
    "ownerType": "DE",
    "entityOwned": "CORIENT PRIVATE WEALTH LLC",
    "status": "OWNER",
    "dateStatusAcquired": "2022-02",
    "ownershipCode": "E",
    "isControlPerson": true,
    "isPublicReporting": false,
    "crd": ""
  },
  {
    "name": "CI FINANCIAL CORP.",
    "ownerType": "FE",
    "entityOwned": "CORIENT HOLDINGS INC",
    "status": "OWNER",
    "dateStatusAcquired": "2019-11",
    "ownershipCode": "E",
    "isControlPerson": true,
    "isPublicReporting": false,
    "crd": ""
  }
  // ... more owners
]
```

</details>

[Full example response](https://github.com/janlukasschroeder/sec-api/blob/master/examples/api-responses/form-adv-indirect-owners.json)

### Get Other Business Names (Schedule D, Section 1.B)

```js
const otherBusinessNames = await formAdvApi.getOtherBusinessNames('149777');
// response: [...] array of other business names
```

<details>
  <summary>Example Response (shortened)</summary>

```json
[
  {
    "name": "MORGAN STANLEY SMITH BARNEY",
    "jurisdictions": [
      "AL",
      "AK",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "DC",
      "FL"
    ]
  },
  {
    "name": "MORGAN STANLEY WEALTH MANAGEMENT",
    "jurisdictions": [
      "AL",
      "AK",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "DC",
      "FL"
    ]
  }
  // ... more business names, each with full list of jurisdictions
]
```

</details>

[Full example response](https://github.com/janlukasschroeder/sec-api/blob/master/examples/api-responses/form-adv-other-business-names.json)

### Get Separately Managed Accounts (Schedule D, Section 5.K)

Retrieve details about separately managed accounts, including asset type distributions, borrowings, derivative exposures, and custodians.

```js
const smaData = await formAdvApi.getSeparatelyManagedAccounts('149777');
// response: { ... } separately managed account details
```

<details>
  <summary>Example Response (shortened)</summary>

```json
{
  "1-separatelyManagedAccounts": {
    "a": {
      "i-exchangeTradedEquity": { "midYear": "58 %", "endOfYear": "58 %" },
      "ii-nonExchangeTradedEquity": { "midYear": "0 %", "endOfYear": "0 %" },
      "iii-usGovernmentBonds": { "midYear": "2 %", "endOfYear": "2 %" }
      // ... iv through xii also included
    }
  },
  "2-borrowingsAndDerivatives": {
    "a-i-midYear": {
      "regulatoryAssetsUnderManagement": {
        "lessThan10": "$ 1,556,490,216,199",
        "between10And149": "$ 113,832,393,489",
        "moreThan150": "$ 16,522,479,023"
      },
      "borrowings": {
        "lessThan10": "$ 1,640,415,435",
        "between10And149": "$ 53,635,978,014",
        "moreThan150": "$ 67,201,944,992"
      },
      "derivativeExposures": {
        "lessThan10": { "interestRate": "0 %", "equity": "4 %" },
        "between10And149": { "equity": "58 %" },
        "moreThan150": { "equity": "185 %" }
      }
    }
    // ... end of year data also included
  },
  "3-custodiansForSeparatelyManagedAccounts": [
    {
      "a-legalName": "MORGAN STANLEY SMITH BARNEY LLC",
      "b-businessName": "MORGAN STANLEY",
      "d-isRelatedPerson": true,
      "g-amountHeldAtCustodian": "$ 1,733,996,722,410"
    }
  ]
}
```

</details>

[Full example response](https://github.com/janlukasschroeder/sec-api/blob/master/examples/api-responses/form-adv-separately-managed-accounts.json)

### Get Financial Industry Affiliations (Schedule D, Section 7.A)

Retrieve related persons and financial industry affiliations, such as affiliated broker-dealers, investment advisers, insurance companies, and pooled investment vehicle sponsors.

```js
const affiliations =
  await formAdvApi.getFinancialIndustryAffiliations('149777');
// response: [...] array of financial industry affiliations
```

<details>
  <summary>Example Response (shortened)</summary>

```json
[
  {
    "1-nameOfRelatedPerson": "MS CAPITAL PARTNERS ADVISER INC.",
    "2-businessName": "MS CAPITAL PARTNERS ADVISER INC.",
    "3-secFileNumber": "80169426",
    "4a-crdNumber": "147521",
    "5-typesOfRelatedPerson": ["b-otherAdviser", "f-commodityPoolOperator"],
    "6-controlsRelatedPerson": false,
    "7-underCommonControl": false,
    "8a-relatedPersonActsAsCustodian": false,
    "9a-exemptFromRegistration": false,
    "11-shareSupervisedPersons": true,
    "12-shareSameLocation": false
    // ... also includes: 4b-cikNumbers, 8b, 8c-locationOfRelatedPerson, 9b, 10a, 10b
  }
  // ... more affiliations
]
```

</details>

[Full example response](https://github.com/janlukasschroeder/sec-api/blob/master/examples/api-responses/form-adv-financial-industry-affiliations.json)

### Get Private Funds (Schedule D, Section 7.B.1)

```js
const privateFunds = await formAdvApi.getPrivateFunds('793');
// response: [...] array of private fund details
```

<details>
  <summary>Example Response (shortened)</summary>

```json
[
  {
    "1a-nameOfFund": "EI FUND II LLC",
    "1b-fundIdentificationNumber": "805-4502496130",
    "2-lawOrganizedUnder": { "state": "Missouri", "country": "United States" },
    "3a-namesOfGeneralPartnerManagerTrusteeDirector": [
      "STIFEL NICOLAUS & COMPANY, INC."
    ],
    "4-2-exclusionUnder3c7": true,
    "6c-isFeederFundInMasterFeederAgreement": true,
    "6d-nameIdOfMasterFund": "EI FUND V, LP",
    "8a-isFundOfFunds": true,
    "10-typeOfFund": {
      "selectedTypes": ["other private fund"],
      "otherFundType": "FEEDER INTO PRIVATE EQUITY FUND"
    },
    "11-grossAssetValue": 2027469,
    "12-minInvestmentCommitment": 100000,
    "13-numberOfBeneficialOwners": 25,
    "23b-f-auditors": [
      {
        "23b-name": "KATZ SAPPER MILLER",
        "23d-isIndependentPublicAccountant": true
      }
    ],
    "25b-g-custodians": [
      {
        "25b-legalName": "STIFEL, NICOLAUS & COMPANY, INCORPORATED",
        "25e-isRelatedPerson": true
      }
    ]
    // ... 28 fields per fund in full response
  }
  // ... more funds
]
```

</details>

[Full example response](https://github.com/janlukasschroeder/sec-api/blob/master/examples/api-responses/form-adv-private-funds.json)

### Get Brochures

```js
const brochures = await formAdvApi.getBrochures('149777');
// response: { brochures }
```

<details>
  <summary>Example Response</summary>

```json
{
  "brochures": [
    {
      "versionId": 1033575,
      "name": "CONSULTING GROUP ADVISOR PROGRAM BROCHURE",
      "dateSubmitted": "2026-03-30",
      "url": "https://files.adviserinfo.sec.gov/IAPD/Content/Common/crd_iapd_Brochure.aspx?BRCHR_VRSN_ID=1033575"
    },
    {
      "versionId": 1033576,
      "name": "PORTFOLIO MANAGEMENT AND INSTITUTIONAL CASH ADVISORY PROGRAM BROCHURE",
      "dateSubmitted": "2026-03-30",
      "url": "https://files.adviserinfo.sec.gov/IAPD/Content/Common/crd_iapd_Brochure.aspx?BRCHR_VRSN_ID=1033576"
    },
    {
      "versionId": 1033577,
      "name": "ALTERNATIVE INVESTMENTS WRAP PROGRAM BROCHURE",
      "dateSubmitted": "2026-03-30",
      "url": "https://files.adviserinfo.sec.gov/IAPD/Content/Common/crd_iapd_Brochure.aspx?BRCHR_VRSN_ID=1033577"
    }
    // ... more brochures
  ]
}
```

</details>

[Full example response](https://github.com/janlukasschroeder/sec-api/blob/master/examples/api-responses/form-adv-brochures.json)

> See the documentation for more details: https://sec-api.io/docs/investment-adviser-and-adv-api

## Insider Trading Data API

Access Form 3, 4, and 5 filings that disclose insider ownership and trading activity by company officers, directors, and beneficial owners.

### Form 3 - Initial Ownership Statements

```js
const { insiderTradingApi } = require('sec-api');

insiderTradingApi.setApiKey('YOUR_API_KEY');

const data = await insiderTradingApi.getData({
  query: 'documentType:3 AND issuer.tradingSymbol:NTB',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, transactions }
```

<details>
  <summary>Example Response</summary>

```json
{
  "total": { "value": 10000, "relation": "gte" },
  "transactions": [
    {
      "id": "9ec6b4513d930d643aa7bd45821be7ab",
      "accessionNo": "0001975035-26-000012",
      "filedAt": "2026-04-01T08:46:43-04:00",
      "schemaVersion": "X0607",
      "documentType": "3",
      "periodOfReport": "2026-03-31",
      "notSubjectToSection16": false,
      "issuer": {
        "cik": "1653242",
        "name": "Bank of N.T. Butterfield & Son Ltd",
        "tradingSymbol": "NTB"
      },
      "reportingOwner": {
        "cik": "2120720",
        "name": "Henton Andrew Michael",
        "address": {
          "street1": "59 FRONT STREET",
          "city": "HAMILTON",
          "zipCode": "HM 12"
        },
        "relationship": {
          "isDirector": true,
          "isOfficer": false,
          "isTenPercentOwner": false,
          "isOther": false
        }
      },
      "nonDerivativeTable": {
        "holdings": [
          {
            "securityTitle": "Bank of N.T. Butterfield & Son Ltd",
            "coding": {},
            "postTransactionAmounts": {
              "sharesOwnedFollowingTransaction": 667
            },
            "ownershipNature": {
              "directOrIndirectOwnership": "D"
            }
          }
        ]
      },
      "ownerSignatureName": "Tara Hidalgo, by power of attorney for Andr",
      "ownerSignatureNameDate": "2026-04-01"
    }
  ]
}
```

</details>

### Form 4 - Changes in Ownership

```js
const data = await insiderTradingApi.getData({
  query: 'documentType:4 AND issuer.tradingSymbol:TSLA',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, transactions }
```

<details>
  <summary>Example Response</summary>

```json
{
  "total": { "value": 837, "relation": "eq" },
  "transactions": [
    {
      "id": "b5e3ff9eca7a16f1b7fef6aef6767fbc",
      "accessionNo": "0001104659-26-025379",
      "filedAt": "2026-03-09T19:00:14-04:00",
      "schemaVersion": "X0508",
      "documentType": "4",
      "periodOfReport": "2026-03-05",
      "notSubjectToSection16": false,
      "issuer": {
        "cik": "1318605",
        "name": "Tesla, Inc.",
        "tradingSymbol": "TSLA"
      },
      "reportingOwner": {
        "cik": "1771340",
        "name": "Taneja Vaibhav",
        "address": {
          "street1": "C/O TESLA, INC.",
          "street2": "1 TESLA ROAD",
          "city": "AUSTIN",
          "state": "TX",
          "zipCode": "78725"
        },
        "relationship": {
          "isDirector": false,
          "isOfficer": true,
          "officerTitle": "Chief Financial Officer",
          "isTenPercentOwner": false,
          "isOther": false
        }
      },
      "nonDerivativeTable": {
        "transactions": [
          {
            "securityTitle": "Common Stock",
            "transactionDate": "2026-03-05",
            "coding": {
              "formType": "4",
              "code": "M",
              "equitySwapInvolved": false,
              "footnoteId": ["F1"]
            },
            "amounts": {
              "shares": 6538,
              "pricePerShare": 0,
              "acquiredDisposedCode": "A"
            },
            "postTransactionAmounts": {
              "sharesOwnedFollowingTransaction": 20371,
              "sharesOwnedFollowingTransactionFootnoteId": ["F2"]
            },
            "ownershipNature": {
              "directOrIndirectOwnership": "D"
            }
          }
          // ... more transactions
        ],
        "holdings": [
          {
            "securityTitle": "Common Stock",
            "coding": {},
            "postTransactionAmounts": {
              "sharesOwnedFollowingTransaction": 111000
            },
            "ownershipNature": {
              "directOrIndirectOwnership": "I",
              "natureOfOwnership": "See Footnote",
              "natureOfOwnershipFootnoteId": ["F4"]
            }
          }
        ]
      },
      "derivativeTable": {
        "transactions": [
          {
            "securityTitle": "Restricted Stock Unit",
            "conversionOrExercisePrice": 0,
            "transactionDate": "2026-03-05",
            "coding": {
              "formType": "4",
              "code": "M",
              "equitySwapInvolved": false
            },
            "exerciseDateFootnoteId": ["F5"],
            "expirationDateFootnoteId": ["F5"],
            "underlyingSecurity": {
              "title": "Common Stock",
              "shares": 6538
            },
            "amounts": {
              "shares": 6538,
              "pricePerShare": 0,
              "acquiredDisposedCode": "D"
            },
            "postTransactionAmounts": {
              "sharesOwnedFollowingTransaction": 65382
            },
            "ownershipNature": {
              "directOrIndirectOwnership": "D"
            }
          }
        ]
      },
      "footnotes": [
        {
          "id": "F1",
          "text": "Shares of the Issuer's common stock were issued to the reporting person upon the vesting of restricted stock units on March 5, 2026."
        }
        // ... more footnotes
      ],
      "ownerSignatureName": "By: Aaron Beckman, Power of Attorney For: Vaibhav Taneja",
      "ownerSignatureNameDate": "2026-03-09"
    }
  ]
}
```

</details>

### Form 5 - Annual Ownership Statements

```js
const data = await insiderTradingApi.getData({
  query: 'documentType:5 AND issuer.tradingSymbol:SPWR',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, transactions }
```

<details>
  <summary>Example Response</summary>

```json
{
  "total": { "value": 10000, "relation": "gte" },
  "transactions": [
    {
      "id": "00101d987e5fd4e6d2bdcd1d9c17b170",
      "accessionNo": "0001213900-26-031111",
      "filedAt": "2026-03-18T18:49:54-04:00",
      "schemaVersion": "X0609",
      "documentType": "5",
      "periodOfReport": "2025-12-28",
      "notSubjectToSection16": false,
      "issuer": {
        "cik": "1838987",
        "name": "SunPower Inc.",
        "tradingSymbol": "SPWR"
      },
      "reportingOwner": {
        "cik": "1253573",
        "name": "MAIER LOTHAR",
        "address": {
          "street1": "C/O SUNPOWER INC.",
          "street2": "45600 NORTHPORT LOOP EAST",
          "city": "FREMONT",
          "state": "CA",
          "zipCode": "94538"
        },
        "relationship": {
          "isDirector": true,
          "isOfficer": false,
          "isTenPercentOwner": false,
          "isOther": false
        }
      },
      "nonDerivativeTable": {
        "transactions": [
          {
            "securityTitle": "Common Stock",
            "transactionDate": "2025-05-23",
            "coding": {
              "formType": "4",
              "code": "A",
              "equitySwapInvolved": false
            },
            "timeliness": "L",
            "amounts": {
              "shares": 243169,
              "pricePerShare": 0,
              "pricePerShareFootnoteId": ["F1"],
              "acquiredDisposedCode": "A"
            },
            "postTransactionAmounts": {
              "sharesOwnedFollowingTransaction": 243169
            },
            "ownershipNature": {
              "directOrIndirectOwnership": "D"
            }
          }
        ]
      },
      "footnotes": [
        {
          "id": "F1",
          "text": "On May 23, 2025, the Company granted the Reporting Person 243,169 restricted stock units pursuant to the Company's 2023 Equity Incentive Plan, as amended, each of which fully vested into one share of common stock on the grant date."
        }
      ],
      "ownerSignatureName": "/s/ Lothar Maier",
      "ownerSignatureNameDate": "2026-03-17"
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/insider-ownership-trading-api

## Form 144 API

Access Form 144 filings that report proposed sales of restricted securities by insiders.

```js
const { form144Api } = require('sec-api');

form144Api.setApiKey('YOUR_API_KEY');

const data = await form144Api.getData({
  query: 'entities.ticker:TSLA',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 72, "relation": "eq" },
  "data": [
    {
      "id": "3196e422cd21d5a12a3acf756bb3e0a1",
      "accessionNo": "0001950047-26-003078",
      "fileNo": "001-34756",
      "formType": "144",
      "filedAt": "2026-03-30T17:31:46-04:00",
      "entities": [
        {
          "cik": "1318605",
          "ticker": "TSLA",
          "companyName": "Tesla, Inc. (Subject)",
          "irsNo": "912197729",
          "fiscalYearEnd": "1231",
          "stateOfIncorporation": "TX",
          "sic": "3711 Motor Vehicles &amp; Passenger Car Bodies",
          "type": "144",
          "act": "33",
          "fileNo": "001-34756",
          "filmNo": "26813321"
        },
        { "cik": "1331680", "companyName": "Wilson-Thompson Kathleen (Reporting)", "type": "144" }
      ],
      "issuerInfo": {
        "issuerCik": "1318605",
        "issuerTicker": "TSLA",
        "issuerName": "Tesla, Inc.",
        "secFileNumber": "001-34756",
        "issuerAddress": {
          "street1": "1 Tesla Road",
          "city": "Austin",
          "stateOrCountry": "TX",
          "zipCode": "78725"
        },
        "issuerContactPhone": "5125168177",
        "nameOfPersonForWhoseAccountTheSecuritiesAreToBeSold": "KATHLEEN WILSON-THOMPSON",
        "relationshipsToIssuer": "Director"
      },
      "securitiesInformation": [
        {
          "securitiesClassTitle": "Common",
          "brokerOrMarketMakerDetails": {
            "name": "Morgan Stanley Smith Barney LLC Executive Financial Services",
            "address": {
              "street1": "1 New York Plaza",
              "street2": "8th Floor",
              "city": "New York",
              "stateOrCountry": "NY",
              "zipCode": "10004"
            }
          },
          "numberOfUnitsToBeSold": 25809,
          "aggregateMarketValue": 9338470.47,
          "noOfUnitsOutstanding": 3752431984,
          "approxSaleDate": "2026-03-30",
          "securitiesExchangeName": "NASDAQ"
        }
      ],
      "securitiesToBeSold": [
        {
          "securitiesClassTitle": "Common",
          "acquiredDate": "2026-03-30",
          "natureOfAcquisitionTransaction": "Exercise of Stock Options",
          "nameOfPersonFromWhomAcquired": "Issuer",
          "isGiftTransaction": false,
          "amountOfSecuritiesAcquired": 1648,
          "paymentDate": "2026-03-30",
          "natureOfPayment": "Cash"
        }
        // ... more items
      ],
      "nothingToReportFlagOnSecuritiesSoldInPast3Months": false,
      "securitiesSoldInPast3Months": [
        {
          "sellerDetails": {
            "name": "10b5-1 Sales for KATHLEEN WILSON-THOMPSON",
            "address": {
              "street1": "1 Tesla Road",
              "city": "Austin",
              "stateOrCountry": "TX",
              "zipCode": "78725"
            }
          },
          "securitiesClassTitle": "Common",
          "saleDate": "2026-02-25",
          "amountOfSecuritiesSold": 25731,
          "grossProceeds": 10692813.68
        }
      ],
      "noticeSignature": {
        "noticeDate": "2026-03-30",
        "planAdoptionDates": ["2025-11-26"],
        "signature": "/s/ Kathleen Wilson-Thompson"
      }
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/form-144-restricted-sales-api

## Form 13F Institutional Holdings Database

Access Form 13F filings that disclose quarterly holdings of institutional investment managers with over $100 million in assets under management. Separate endpoints are available for holdings data and cover pages.

### 13F Holdings

Query individual stock positions reported in 13F-HR filings, including issuer name, CUSIP, share count, market value, and voting authority.

```js
const { form13FHoldingsApi } = require('sec-api');

form13FHoldingsApi.setApiKey('YOUR_API_KEY');

const holdings = await form13FHoldingsApi.getData({
  query: 'cik:1067983',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 209, "relation": "eq" },
  "data": [
    {
      "id": "289428b455d4eb55f298d84f544d3d61",
      "accessionNo": "0001193125-26-054580",
      "cik": "1067983",
      "ticker": "BRK.B",
      "companyName": "BERKSHIRE HATHAWAY INC",
      "companyNameLong": "BERKSHIRE HATHAWAY INC (Filer)",
      "formType": "13F-HR",
      "description": "Form 13F-HR - Quarterly report filed by institutional managers, Holdings",
      "filedAt": "2026-02-17T16:05:04-05:00",
      "linkToTxt": "https://www.sec.gov/Archives/edgar/data/1067983/000119312526054580/0001193125-26-054580.txt",
      "linkToHtml": "https://www.sec.gov/Archives/edgar/data/1067983/000119312526054580/0001193125-26-054580-index.htm",
      "linkToXbrl": "",
      "linkToFilingDetails": "https://www.sec.gov/Archives/edgar/data/1067983/000119312526054580/xslForm13F_X02/primary_doc.xml",
      "entities": [
        {
          "companyName": "BERKSHIRE HATHAWAY INC (Filer)",
          "cik": "1067983",
          "irsNo": "470813844",
          "stateOfIncorporation": "DE",
          "fiscalYearEnd": "1231",
          "type": "13F-HR",
          "act": "34",
          "fileNo": "028-04545",
          "filmNo": "26640865",
          "sic": "6331 Fire, Marine &amp; Casualty Insurance",
          "undefined": "02 Finance)"
        }
      ],
      "documentFormatFiles": [
        {
          "sequence": "1",
          "documentUrl": "https://www.sec.gov/Archives/edgar/data/1067983/000119312526054580/xslForm13F_X02/primary_doc.xml",
          "type": "13F-HR",
          "size": " "
        }
        // ... more files
      ],
      "dataFiles": [],
      "seriesAndClassesContractsInformation": [],
      "periodOfReport": "2025-12-31",
      "effectivenessDate": "2026-02-17",
      "holdings": [
        {
          "nameOfIssuer": "ALLY FINL INC",
          "cusip": "02005N100",
          "titleOfClass": "COM",
          "value": 576074081,
          "shrsOrPrnAmt": { "sshPrnamt": 12719675, "sshPrnamtType": "SH" },
          "investmentDiscretion": "DFND",
          "votingAuthority": { "Sole": 12719675, "Shared": 0, "None": 0 },
          "otherManager": "4",
          "ticker": "ALLY",
          "cik": "40729"
        }
        // ... more holdings
      ]
    }
  ]
}
```

</details>

### 13F Cover Pages

Query cover page data from 13F filings, including the filing manager's name, report type, total holdings count, and aggregate portfolio value.

```js
const { form13FCoverPagesApi } = require('sec-api');

form13FCoverPagesApi.setApiKey('YOUR_API_KEY');

const coverPages = await form13FCoverPagesApi.getData({
  query: 'cik:1067983',
  from: '0',
  size: '10',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 13, "relation": "eq" },
  "data": [
    {
      "id": "1ef1c3fa0b53c72620f026f0ab47e7c6",
      "accessionNo": "0001350694-26-000001",
      "filedAt": "2026-02-13T16:03:50-05:00",
      "formType": "13F-HR",
      "cik": "1350694",
      "crdNumber": "105129",
      "secFileNumber": "801-35875",
      "form13FFileNumber": "028-11794",
      "periodOfReport": "2025-12-31",
      "isAmendment": false,
      "amendmentInfo": {},
      "filingManager": {
        "name": "Bridgewater Associates, LP",
        "address": {
          "street": "One Nyala Farms Road",
          "city": "Westport",
          "stateOrCountry": "CT",
          "zipCode": 6880
        }
      },
      "reportType": "13F HOLDINGS REPORT",
      "otherManagersReportingForThisManager": [],
      "provideInfoForInstruction5": false,
      "signature": {
        "name": "Michael Kitson",
        "title": "Chief Compliance Officer and Counsel",
        "phone": "203-226-3030",
        "signature": "/s/Michael Kitson",
        "city": "Westport",
        "stateOrCountry": "CT",
        "signatureDate": "02-13-2026"
      },
      "tableEntryTotal": 1040,
      "tableEntryTotalAsReported": 1040,
      "tableValueTotal": 27421613830,
      "tableValueTotalAsReported": 27421613830,
      "otherIncludedManagersCount": 0,
      "otherIncludedManagers": []
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/form-13-f-filings-institutional-holdings-api

## Form 13D 13G API

Access Form 13D and 13G filings that disclose activist and passive investor holdings exceeding 5% of a company's outstanding shares.

```js
const { form13DGApi } = require('sec-api');

form13DGApi.setApiKey('YOUR_API_KEY');

const data = await form13DGApi.getData({
  query: 'accessionNo:*',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, filings }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 10000, "relation": "gte" },
  "filings": [
    {
      "id": "a5d7c15340884b72fd2e95a5afde92e9",
      "accessionNo": "0001493152-26-014470",
      "formType": "SC 13D/A",
      "filedAt": "2026-04-01T06:20:43-04:00",
      "filers": [
        { "cik": "1983324", "name": "Real Messenger Corp (Subject)" },
        { "cik": "2099450", "name": "Ma Kwai Hoi (Filed by)" }
      ],
      "nameOfIssuer": "Real Messenger Corporation",
      "titleOfSecurities": "Ordinary Shares",
      "cusip": [],
      "eventDate": "2026-03-25",
      "amendmentNo": "1",
      "schedule13GFiledPreviously": false,
      "owners": [
        {
          "name": ["Kwai Hoi MA"],
          "memberOfGroup": { "a": false, "b": false },
          "sourceOfFunds": "OO",
          "legalProceedingsDisclosureRequired": false,
          "place": "X0",
          "soleVotingPower": 7217555,
          "sharedVotingPower": 0,
          "soleDispositivePower": 7217555,
          "sharedDispositivePower": 0,
          "aggregateAmountOwned": 7217555,
          "isAggregateExcludeShares": false,
          "amountAsPercent": 65.86,
          "typeOfReportingPerson": ["IN"]
        }
        // ... more items
      ],
      "item1": {
        "securityTitle": "Ordinary Shares",
        "issuerName": "Real Messenger Corporation",
        "issuerPrincipalAddress": {
          "street1": "695 Town Center Drive, Suite 1200",
          "street2": "",
          "city": "Costa Mesa",
          "stateOrCountry": "CA",
          "zipCode": "92626"
        },
        "commentText": "The following constitutes Amendment No. 1 (\"Amendment No. 1\") to the Schedule 13D filed with the Securities and Exchange Commission (\"SEC\")..."
      },
      "item2": {
        "filingPersonName": "",
        "principalBusinessAddress": "",
        "principalJob": "",
        "hasBeenConvicted": "",
        "convictionDescription": "",
        "citizenship": ""
      },
      "item3": {
        "fundsSource": "..."
      },
      "item4": {
        "transactionPurpose": "..."
      },
      "item5": {
        "percentageOfClassSecurities": "...",
        "numberOfShares": "...",
        "transactionDescription": "...",
        "listOfShareholders": "...",
        "date5PercentOwnership": "Not applicable"
      },
      "item6": {
        "contractDescription": ""
      },
      "item7": {
        "filedExhibits": "..."
      }
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/form-13d-13g-search-api

## Form N-PORT API

Access Form N-PORT filings that disclose monthly portfolio holdings of mutual funds, ETFs, and closed-end funds.

```js
const { formNportApi } = require('sec-api');

formNportApi.setApiKey('YOUR_API_KEY');

const data = await formNportApi.getData({
  query: 'fundInfo.totAssets:[100000000 TO *]',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, filings }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 10000, "relation": "gte" },
  "filings": [
    {
      "submissionType": "NPORT-P",
      "filerInfo": {
        "filer": {
          "issuerCredentials": { "cik": "0001552947", "ccc": "XXXXXXXX" }
        },
        "seriesClassInfo": {
          "seriesId": "S000075330",
          "classId": ["C000234270", "C000234271", "C000234272"]
        }
      },
      "genInfo": {
        "regName": "Two Roads Shared Trust",
        "regFileNumber": "811-22718",
        "regCik": "0001552947",
        "regLei": "549300REHU8QC2CK4V30",
        "regStreet1": "225 PICTORIA DRIVE",
        "regStreet2": "SUITE 450",
        "regCity": "CINCINNATI",
        "regStateConditional": { "regCountry": "US", "regState": "US-OH" },
        "regZipOrPostalCode": "45246",
        "regPhone": "402-895-1600",
        "seriesName": "Holbrook Structured Credit Income Fund",
        "seriesId": "S000075330",
        "seriesLei": "549300VN9LSTDZVMEG10",
        "repPdEnd": "2026-04-30",
        "repPdDate": "2026-01-31",
        "isFinalFiling": "N"
      },
      "fundInfo": {
        "totAssets": 589656494.57,
        "totLiabs": 26303874.88,
        "netAssets": 563352619.69,
        "assetsAttrMiscSec": 0,
        "assetsInvested": 0,
        "amtPayOneYrBanksBorr": 0,
        "amtPayOneYrCtrldComp": 0,
        "amtPayOneYrOthAffil": 0,
        "amtPayOneYrOther": 0,
        "amtPayAftOneYrBanksBorr": 0,
        "amtPayAftOneYrCtrldComp": 0,
        "amtPayAftOneYrOthAffil": 0,
        "amtPayAftOneYrOther": 0,
        "delayDeliv": 0,
        "standByCommit": 0,
        "liquidPref": 0,
        "cshNotRptdInCorD": 0,
        "curMetrics": {
          "curMetric": [
            {
              "curCd": "USD",
              "intrstRtRiskdv01": { "period10Yr": 16013.864121, "period1Yr": 11247.59154, "period30Yr": 4288.904006, "period3Mon": 797.324692, "period5Yr": 73979.610662 },
              "intrstRtRiskdv100": { "period10Yr": 1606509.028942, "period1Yr": 1101438.779831, "period30Yr": 435795.28333, "period3Mon": 82265.418559, "period5Yr": 7395155.726345 }
            }
          ]
        },
        "creditSprdRiskInvstGrade": { "period10Yr": 19059.318464, "period1Yr": 10289.915308, "period30Yr": 4867.597881, "period3Mon": 130.272532, "period5Yr": 73099.636591 },
        "creditSprdRiskNonInvstGrade": { "period10Yr": 1101.107886, "period1Yr": 11563.009059, "period30Yr": 815.163831, "period3Mon": 17920.825732, "period5Yr": 6039.88695 },
        "isNonCashCollateral": "N",
        "returnInfo": {
          "monthlyTotReturns": {
            "monthlyTotReturn": [
              { "classId": "C000234270", "rtn1": 0.47, "rtn2": 0.51, "rtn3": 0.55 }
              // ... more items
            ]
          },
          "othMon1": { "netRealizedGain": 7903.87, "netUnrealizedAppr": 41040.49 },
          "othMon2": { "netRealizedGain": 351039.84, "netUnrealizedAppr": -303753.72 },
          "othMon3": { "netRealizedGain": 13348.82, "netUnrealizedAppr": 370504.63 }
        },
        "mon1Flow": { "redemption": 20566862.72, "reinvestment": 2200048.38, "sales": 29009934.75 },
        "mon2Flow": { "redemption": 28416519.67, "reinvestment": 2121607.35, "sales": 45362488.84 },
        "mon3Flow": { "redemption": 15947059.37, "reinvestment": 2848443.49, "sales": 35033302.63 }
      },
      "invstOrSecs": [
        {
          "name": "A&D MORTGAGE TRUST 2023-NQM2",
          "lei": "N/A",
          "title": "ADMT 2023-NQM2 A1",
          "cusip": "00002DAA7",
          "identifiers": { "isin": { "value": "US00002DAA72" } },
          "balance": 1287717.11,
          "units": "PA",
          "curCd": "USD",
          "valUSD": 1289380.97,
          "pctVal": 0.228876360015,
          "payoffProfile": "Long",
          "assetCat": "ABS-O",
          "issuerCat": "CORP",
          "invCountry": "US",
          "isRestrictedSec": "Y",
          "fairValLevel": "2",
          "debtSec": {
            "maturityDt": "2068-05-25",
            "couponKind": "Floating",
            "annualizedRt": 6.131999,
            "isDefault": "N",
            "areIntrstPmntsInArrs": "N",
            "isPaidKind": "N"
          },
          "securityLending": {
            "isCashCollateral": "N",
            "isNonCashCollateral": "N",
            "isLoanByFund": "N"
          }
        }
        // ... more items
      ]
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/n-port-data-api

## Form N-CEN API - Annual Reports by Investment Companies

Access Form N-CEN annual report filings submitted by registered investment companies, including data on fund operations, service providers, and portfolio characteristics.

```js
const { formNcenApi } = require('sec-api');

formNcenApi.setApiKey('YOUR_API_KEY');

const data = await formNcenApi.getData({
  query: 'accessionNo:*',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 10000, "relation": "gte" },
  "data": [
    {
      "id": "8673f62b218d47bba6c85d8c101caba8",
      "accessionNo": "0001639553-26-000002",
      "fileNo": "811-23054",
      "formType": "N-CEN",
      "filedAt": "2026-03-16T17:18:30-04:00",
      "periodOfReport": "2025-12-31",
      "entities": [
        {
          "cik": "1639553",
          "companyName": "Variable Annuity-8 Series Account (of Empower Life & Annuity Insurance Co of New York) (Filer)",
          "irsNo": "132690792",
          "fiscalYearEnd": "1231",
          "stateOfIncorporation": "NY",
          "act": "40",
          "fileNo": "811-23054",
          "filmNo": "26757950"
        }
      ],
      "seriesClass": {
        "reportClass": [
          { "classIds": ["C000158471", "C000158472"] }
        ]
      },
      "generalInfo": {
        "reportEndingPeriod": "2025-12-31",
        "isReportPeriodLt12": false
      },
      "registrantInfo": {
        "registrantFullName": "Variable Annuity-8 Series Account (of Empower Life & Annuity Insurance Co of New York)",
        "investmentCompFileNo": "811-23054",
        "registrantCik": "1639553",
        "registrantLei": "00000000000000000000",
        "registrantStreet1": "370 Lexington Ave, Suite 703",
        "registrantCity": "New York",
        "registrantZipCode": "10017",
        "registrantState": "NY",
        "registrantCountry": "US",
        "registrantPhoneNumber": "800-537-2033",
        "websites": ["N/A"],
        "locationBooksRecords": [
          {
            "officeName": "Empower Annuity Insurance Company of America",
            "officeAddress1": "8515 East Orchard Road",
            "officeCity": "Greenwood Village",
            "officeState": "CO",
            "officeCountry": "US",
            "officeRecordsZipCode": "80111",
            "officePhone": "303-737-3000",
            "booksRecordsDesc": "All accounts, books, or other documents required to be maintained by Section 31(a) of the Investment Company Act of 1940..."
          }
        ],
        "isRegistrantFirstFiling": false,
        "isRegistrantLastFiling": false,
        "familyInvCompFullName": "Empower Funds, Inc.",
        "isRegistrantFamilyInvComp": true,
        "registrantClassificationType": "N-4",
        "isSecuritiesActRegistration": true,
        "chiefComplianceOfficers": [
          {
            "ccoName": "Ahmed Abdul-Jaleel",
            "crdNumber": "008065071",
            "ccoStreet1": "8515 East Orchard Road",
            "ccoCity": "Greenwood Village",
            "ccoState": "CO",
            "ccoCountry": "US",
            "ccoZipCode": "80111",
            "ccoPhone": "XXXXXX",
            "isCcoChangedSinceLastFiling": true,
            "ccoEmployers": [
              { "ccoEmployerName": "N/A", "ccoEmployerId": "N/A" }
            ]
          }
        ],
        "isRegistrantSubmittedMatter": false,
        "isPreviousLegalProceeding": false,
        "isPreviousProceedingTerminated": false,
        "isFinancialSupportDuringPeriod": false,
        "isExemptionFromAct": false,
        "principalUnderwriters": [
          {
            "principalUnderwriterName": "Empower Financial Services, Inc.",
            "principalUnderwriterFileNo": "008-33854",
            "principalUnderwriterCrdNumber": "000013109",
            "principalUnderwriterLei": "N/A",
            "principalUnderWriterState": "CO",
            "principalUnderWriterCountry": "US",
            "isPrincipalUnderwriterAffiliatedWithRegistrant": true
          }
        ],
        "isUnderwriterHiredOrTerminated": false,
        "publicAccountants": [
          {
            "publicAccountantName": "Deloitte & Touche LLP",
            "pcaobNumber": "34",
            "publicAccountantLei": "549300FJV7IV1ZHGAV28",
            "publicAccountantState": "CO",
            "publicAccountantCountry": "US"
          }
        ],
        "isPublicAccountantChanged": false,
        "isOpinionOffered": false,
        "isMaterialChange": false,
        "isAccountingPrincipleChange": false
      },
      "unitInvestmentTrust": {
        "depositors": [
          {
            "depositorName": "Empower Life & Annuity Insurance Company of New York",
            "depositorCrdNo": "N/A",
            "depositorLei": "0PLSTTA4SUBLGLKEJ576",
            "depositorState": "NY",
            "depositorCountry": "US",
            "depositorUltimateParentName": "Power Corporation of Canada"
          }
        ],
        "uitAdmins": [
          {
            "uitAdminName": "Empower Life & Annuity Insurance Company of New York",
            "uitAdminLei": "0PLSTTA4SUBLGLKEJ576",
            "uitAdminState": "NY",
            "uitAdminCountry": "US",
            "isUitAdminAffiliated": true,
            "isUitAdminSubAdmin": false
          }
        ],
        "isUitAdminHiredTerminated": false,
        "registrantSeparateInsuranceAccount": {
          "isRegistrantSeparateInsuranceAccount": true,
          "separateAccountSeriesId": "S000050203"
        },
        "numOfContracts": 20,
        "contractSecurities": [
          {
            "separateAccountSecurityName": "Empower SecureFoundation II Variable Annuity",
            "separateAccountContractId": "C000158471",
            "separateAccountTotalAsset": 1100626.28,
            "numContractsSold": 0,
            "grossPremiumReceived": 8.4,
            "grossPremiumReceivedSection1035": 0,
            "numContractsAffected": 0,
            "contractValueRedeemed": 92145.22,
            "contractValueRedeemedSection1035": 0,
            "numContractsAffectedRedeemed": 0
          }
          // ... more items
        ],
        "isRule6C7Reliance": false,
        "isRule11A2Reliance": false,
        "isRule12D1Dash4Reliance": false,
        "isRule12D1GReliance": false
      },
      "attachmentsTab": {
        "isLegalProceedings": false,
        "isProvisionFinancialSupport": false,
        "isIPAReportInternalControl": false,
        "isChangeAccPrinciples": false,
        "isInfoRequiredEO": false,
        "isOtherInfoRequired": false
      },
      "signature": {
        "registrantSignedName": "Variable Annuity-8 Series Account (of Empower Life & Annuity Insurance Co of New York)",
        "signedDate": "2026-03-16",
        "signature": "/s/ Elaina Ditillo",
        "title": "Counsel"
      }
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/form-ncen-api-annual-reports-investment-companies

## Form N-PX Proxy Voting Records API

Access Form N-PX filings that disclose proxy voting records of mutual funds and other registered management investment companies. Use `getMetadata` to search filings and `getVotingRecords` to retrieve individual voting records by accession number.

### Search N-PX Filing Metadata

```js
const { formNpxApi } = require('sec-api');

formNpxApi.setApiKey('YOUR_API_KEY');

const metadata = await formNpxApi.getMetadata({
  query: 'cik:884546',
  from: '0',
  size: '10',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>

```json
{
  "total": { "value": 2, "relation": "eq" },
  "data": [
    {
      "id": "723cc6d725f186bd4436136332d7fc98",
      "accessionNo": "0001021408-25-003152",
      "formType": "N-PX",
      "filedAt": "2025-08-25T14:01:44-04:00",
      "periodOfReport": "2025-06-30",
      "cik": "884546",
      "ticker": "",
      "companyName": "CHARLES SCHWAB INVESTMENT MANAGEMENT INC",
      "proxyVotingRecordsAttached": true,
      "headerData": {
        "submissionType": "N-PX",
        "filerInfo": {
          "registrantType": "IM",
          "filer": {
            "issuerCredentials": { "cik": "0000884546" }
          },
          "flags": {
            "overrideInternetFlag": false,
            "confirmingCopyFlag": false
          },
          "periodOfReport": "06/30/2025"
        }
      },
      "formData": {
        "coverPage": {
          "yearOrQuarter": "YEAR",
          "reportCalendarYear": "2025",
          "reportingPerson": {
            "name": "Charles Schwab Investment Management Inc",
            "phoneNumber": "4156677000",
            "address": {
              "street1": "211 Main Street",
              "city": "San Francisco",
              "stateOrCountry": "CA",
              "zipCode": "94105"
            }
          },
          "agentForService": {},
          "reportInfo": {
            "reportType": "INSTITUTIONAL MANAGER VOTING REPORT",
            "confidentialTreatment": false
          },
          "fileNumber": "028-03128",
          "explanatoryInformation": {
            "explanatoryChoice": false
          }
        },
        "summaryPage": {
          "otherIncludedManagersCount": 0
        },
        "signaturePage": {
          "reportingPerson": "Charles Schwab Investment Management Inc",
          "txSignature": "Omar Aguilar",
          "txPrintedSignature": "Omar Aguilar",
          "txTitle": "Chief Executive Officer",
          "txAsOfDate": "08/20/2025"
        }
      }
    }
  ]
}
```

</details>

### Get Voting Records by Accession Number

```js
const votingRecords = await formNpxApi.getVotingRecords('0001021408-25-003152');
// response: { id, accessionNo, formType, ..., proxyVotingRecords }
```

<details>
  <summary>Example Response</summary>

```json
{
  "id": "723cc6d725f186bd4436136332d7fc98",
  "accessionNo": "0001021408-25-003152",
  "formType": "N-PX",
  "filedAt": "2025-08-25T14:01:44-04:00",
  "periodOfReport": "2025-06-30",
  "cik": "884546",
  "ticker": "",
  "companyName": "CHARLES SCHWAB INVESTMENT MANAGEMENT INC",
  "proxyVotingRecordsAttached": true,
  "headerData": {
    "submissionType": "N-PX",
    "filerInfo": {
      "registrantType": "IM",
      "filer": {
        "issuerCredentials": { "cik": "0000884546" }
      },
      "flags": {
        "overrideInternetFlag": false,
        "confirmingCopyFlag": false
      },
      "periodOfReport": "06/30/2025"
    }
  },
  "formData": {
    "coverPage": {
      "yearOrQuarter": "YEAR",
      "reportCalendarYear": "2025",
      "reportingPerson": {
        "name": "Charles Schwab Investment Management Inc",
        "phoneNumber": "4156677000",
        "address": {
          "street1": "211 Main Street",
          "city": "San Francisco",
          "stateOrCountry": "CA",
          "zipCode": "94105"
        }
      },
      "agentForService": {},
      "reportInfo": {
        "reportType": "INSTITUTIONAL MANAGER VOTING REPORT",
        "confidentialTreatment": false
      },
      "fileNumber": "028-03128",
      "explanatoryInformation": {
        "explanatoryChoice": false
      }
    },
    "summaryPage": {
      "otherIncludedManagersCount": 0
    },
    "signaturePage": {
      "reportingPerson": "Charles Schwab Investment Management Inc",
      "txSignature": "Omar Aguilar",
      "txPrintedSignature": "Omar Aguilar",
      "txTitle": "Chief Executive Officer",
      "txAsOfDate": "08/20/2025"
    }
  },
  "proxyVotingRecords": [
    {
      "issuerName": "10x Genomics, Inc.",
      "cusip": "88025U109",
      "meetingDate": "06/03/2025",
      "voteDescription": "To approve, on a non-binding, advisory basis, the compensation of our named executive officers.",
      "voteCategories": {
        "voteCategory": [{ "categoryType": "SECTION 14A SAY-ON-PAY VOTES" }]
      },
      "voteSource": "ISSUER",
      "sharesVoted": 653315,
      "sharesOnLoan": 0,
      "vote": {
        "voteRecord": [
          {
            "howVoted": "AGAINST",
            "sharesVoted": 653315,
            "managementRecommendation": "AGAINST"
          }
        ]
      }
    }
    // ... more voting records
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/form-npx-proxy-voting-records-api

## Form S-1/424B4 API

Access Form S-1 registration statements and 424B prospectuses related to IPOs, debt offerings, warrant offerings, and other securities offerings.

```js
const { formS1424B4Api } = require('sec-api');

formS1424B4Api.setApiKey('YOUR_API_KEY');

const data = await formS1424B4Api.getData({
  query: 'ticker:RIVN',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 5, "relation": "eq" },
  "data": [
    {
      "id": "f838c5f9775441d7aa3b04e087e0e469",
      "filedAt": "2021-11-12T17:00:47-05:00",
      "accessionNo": "0001193125-21-328239",
      "formType": "424B4",
      "cik": "1874178",
      "ticker": "RIVN",
      "entityName": "Rivian Automotive, Inc. / DE",
      "filingUrl": "https://www.sec.gov/Archives/edgar/data/1874178/000119312521328239/d157488d424b4.htm",
      "tickers": [
        { "ticker": "RIVN", "type": "Class A Common Stock", "exchange": "Nasdaq" }
      ],
      "securities": [
        { "name": "153,000,000 Shares Class A Common Stock" },
        { "name": "Class B common stock" }
      ],
      "publicOfferingPrice": { "perShare": 78, "perShareText": "$78.0000", "total": 11934000000, "totalText": "$11,934,000,000" },
      "underwritingDiscount": { "perShare": 1.1098, "perShareText": "$1.1098", "total": 169799400, "totalText": "$169,799,400" },
      "proceedsBeforeExpenses": { "perShare": 76.8902, "perShareText": "$76.8902", "total": 11764200600, "totalText": "$11,764,200,600" },
      "underwriters": [
        { "name": "Morgan Stanley & Co. LLC" },
        { "name": "Goldman Sachs & Co. LLC" },
        { "name": "J.P. Morgan Securities LLC" }
        // ... more underwriters
      ],
      "lawFirms": [
        { "name": "Latham & Watkins LLP", "location": "" },
        { "name": "Skadden, Arps, Slate, Meagher & Flom LLP", "location": "" }
      ],
      "auditors": [
        { "name": "KPMG LLP" }
      ],
      "management": [
        { "name": "Robert J. Scaringe", "age": 38, "position": "Founder and Chief Executive Officer, Chairman of the Board of Directors" },
        { "name": "Claire McDonough", "age": 40, "position": "Chief Financial Officer" }
        // ... more items
      ],
      "employees": {
        "total": 9195,
        "asOfDate": "2021-10-31",
        "perDivision": [],
        "perRegion": []
      }
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/form-s1-424b4-data-search-api

## Form C API - Crowdfunding Campaigns

Access Form C filings related to crowdfunding offerings and campaigns under Regulation Crowdfunding.

```js
const { formCApi } = require('sec-api');

formCApi.setApiKey('YOUR_API_KEY');

const data = await formCApi.getData({
  query: 'id:*',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 10000, "relation": "gte" },
  "data": [
    {
      "id": "5ed83df80bfdb0dd611508c07e138867",
      "accessionNo": "0002103209-26-000005",
      "fileNo": "020-36757",
      "formType": "C/A",
      "filedAt": "2026-03-31T18:45:06-04:00",
      "cik": "2103209",
      "ticker": "",
      "companyName": "GigaWatt, Inc",
      "issuerInformation": {
        "isAmendment": false,
        "natureOfAmendment": "Campaign Page Updates",
        "issuerInfo": {
          "nameOfIssuer": "GigaWatt, Inc.",
          "legalStatus": {
            "legalStatusForm": "Corporation",
            "jurisdictionOrganization": "CA",
            "dateIncorporation": "09-17-2025"
          },
          "issuerAddress": {
            "street1": "2386 E Walnut Ave",
            "city": "Fullerton",
            "stateOrCountry": "CA",
            "zipCode": "92831"
          },
          "issuerWebsite": "https://www.gigawattinc.com/"
        },
        "isCoIssuer": false,
        "companyName": "StartEngine Primary, LLC",
        "commissionCik": "0001725012",
        "commissionFileNumber": "008-70060"
      },
      "offeringInformation": {
        "compensationAmount": "7 - 13 percent",
        "financialInterest": "One percent (1%) of securities of the total amount of investments raised in the offering, along the same terms as investors.",
        "securityOfferedType": "Other",
        "securityOfferedOtherDesc": "Class B Common Stock",
        "noOfSecurityOffered": 10000,
        "price": 2,
        "priceDeterminationMethod": "N/A",
        "offeringAmount": 20000,
        "overSubscriptionAccepted": true,
        "overSubscriptionAllocationType": "Other",
        "descOverSubscription": "At issuer's discretion, with priority given to StartEngine Owners",
        "maximumOfferingAmount": 1235000,
        "deadlineDate": "04-23-2026"
      },
      "annualReportDisclosureRequirements": {
        "currentEmployees": 21,
        "totalAssetMostRecentFiscalYear": 2559852,
        "totalAssetPriorFiscalYear": 2169710,
        "cashEquiMostRecentFiscalYear": 521671,
        "cashEquiPriorFiscalYear": 575133,
        "actReceivedMostRecentFiscalYear": 11126,
        "actReceivedPriorFiscalYear": 2779,
        "shortTermDebtMostRecentFiscalYear": 2659535,
        "shortTermDebtPriorFiscalYear": 2311008,
        "longTermDebtMostRecentFiscalYear": 707533,
        "longTermDebtPriorFiscalYear": 748955,
        "revenueMostRecentFiscalYear": 7485272,
        "revenuePriorFiscalYear": 9788210,
        "costGoodsSoldMostRecentFiscalYear": 5091719,
        "costGoodsSoldPriorFiscalYear": 6836396,
        "taxPaidMostRecentFiscalYear": 537,
        "taxPaidPriorFiscalYear": 4631,
        "netIncomeMostRecentFiscalYear": 83037,
        "netIncomePriorFiscalYear": 45926,
        "issueJurisdictionSecuritiesOffering": [
          "AL", "AK", "AZ"
          // ... more items
        ]
      },
      "signatureInfo": {
        "issuerSignature": {
          "issuer": "GigaWatt, Inc.",
          "issuerSignature": "Deep G. Patel",
          "issuerTitle": "Founder, CEO, Board Member, Principal Accounting Officer"
        },
        "signaturePersons": [
          {
            "personSignature": "Deep G. Patel",
            "personTitle": "Founder, CEO, Board Member, Principal Accounting Officer",
            "signatureDate": "03-31-2026"
          }
        ]
      }
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/form-c-crowdfunding-api

## Form D API

Access Form D filings that report private securities offerings exempt from SEC registration, including offerings under Regulation D.

```js
const { formDApi } = require('sec-api');

formDApi.setApiKey('YOUR_API_KEY');

const data = await formDApi.getData({
  query: 'offeringData.offeringSalesAmounts.totalOfferingAmount:[1000000 TO *]',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, offerings }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 10000, "relation": "gte" },
  "offerings": [
    {
      "schemaVersion": "X0708",
      "submissionType": "D/A",
      "testOrLive": "LIVE",
      "primaryIssuer": {
        "cik": "0001925002",
        "entityName": "Fund I, a series of Material Ventures, LP",
        "issuerAddress": {
          "street1": "119 SOUTH MAIN STREET",
          "street2": "SUITE 220",
          "city": "SEATTLE",
          "stateOrCountry": "WA",
          "stateOrCountryDescription": "WASHINGTON",
          "zipCode": "98104"
        },
        "issuerPhoneNumber": "3603409337",
        "jurisdictionOfInc": "DELAWARE",
        "issuerPreviousNameList": [
          { "previousName": ["None"] }
        ],
        "edgarPreviousNameList": [
          { "value": "None" }
        ],
        "entityType": "Limited Partnership",
        "yearOfInc": { "withinFiveYears": true, "value": "2021" }
      },
      "relatedPersonsList": {
        "relatedPersonInfo": [
          {
            "relatedPersonName": { "firstName": "Ltd.", "lastName": "Belltower Fund Group" },
            "relatedPersonAddress": {
              "street1": "119 South Main Street",
              "street2": "Suite 220",
              "city": "Seattle",
              "stateOrCountry": "WA",
              "stateOrCountryDescription": "WASHINGTON",
              "zipCode": "98104"
            },
            "relatedPersonRelationshipList": { "relationship": ["Director"] },
            "relationshipClarification": "Manager of the general partner of the Issuer"
          }
          // ... more items
        ]
      },
      "offeringData": {
        "industryGroup": {
          "industryGroupType": "Pooled Investment Fund",
          "investmentFundInfo": { "investmentFundType": "Venture Capital Fund", "is40Act": false }
        },
        "issuerSize": { "revenueRange": "Decline to Disclose" },
        "federalExemptionsExclusions": { "item": ["06b", "3C", "3C.1"] },
        "typeOfFiling": {
          "newOrAmendment": { "isAmendment": true, "previousAccessionNumber": "0001976600-23-000006" },
          "dateOfFirstSale": { "value": "2022-04-01" }
        },
        "durationOfOffering": { "moreThanOneYear": true },
        "typesOfSecuritiesOffered": { "isPooledInvestmentFundType": true },
        "businessCombinationTransaction": { "isBusinessCombinationTransaction": false },
        "minimumInvestmentAccepted": 25000,
        "salesCompensationList": {},
        "offeringSalesAmounts": {
          "totalOfferingAmount": 10000000,
          "totalAmountSold": 5254355,
          "totalRemaining": 4745645
        },
        "investors": { "hasNonAccreditedInvestors": false, "totalNumberAlreadyInvested": 47 },
        "salesCommissionsFindersFees": {
          "salesCommissions": { "dollarAmount": 0 },
          "findersFees": { "dollarAmount": 0 }
        },
        "useOfProceeds": {
          "grossProceedsUsed": { "dollarAmount": 0, "isEstimate": true },
          "clarificationOfResponse": "The manager of the general partner of the Issuer will receive a portion of a management fee as specified in the Issuer's partnership agreement."
        },
        "signatureBlock": {
          "authorizedRepresentative": false,
          "signature": [
            {
              "issuerName": "Fund I, a series of Material Ventures, LP",
              "signatureName": "/s/ Abraham Wilson",
              "nameOfSigner": "Abraham Wilson",
              "signatureTitle": "Authorized Person of the Agent of Issuer's GP",
              "signatureDate": "2026-03-31"
            }
          ]
        }
      },
      "accessionNo": "0001925002-26-000003",
      "filedAt": "2026-03-31T20:56:04-04:00",
      "id": "eafcfda4b7698259276857a92943d990"
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/form-d-xml-json-api

## Regulation A APIs

Access Regulation A offering statements filed by small companies. Includes a unified search endpoint and dedicated endpoints for Form 1-A (offering statements), Form 1-K (annual reports), and Form 1-Z (exit reports).

### Search All Regulation A Filings

```js
const { regASearchApi } = require('sec-api');

regASearchApi.setApiKey('YOUR_API_KEY');

const results = await regASearchApi.getData({
  query: 'filedAt:[2024-01-01 TO 2024-12-31]',
  from: '0',
  size: '10',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>

```json
{
  "total": { "value": 1419, "relation": "eq" },
  "data": [
    {
      "id": "af09549e0cb0775585c3481d61f8e471",
      "accessionNo": "0001829126-24-008673",
      "fileNo": "24R-00889",
      "formType": "1-Z",
      "filedAt": "2024-12-31T17:27:40-05:00",
      "cik": "1973742",
      "ticker": "",
      "companyName": "Worldwide Stages, Inc.",
      "item1": {
        "issuerName": "Worldwide Stages, Inc.",
        "street1": "5000 Northfield Lane",
        "city": "Spring Hill",
        "stateOrCountry": "TN",
        "zipCode": "37174",
        "phone": "615-341-5900",
        "commissionFileNumber": ["024-12301"]
      },
      "summaryInfoOffering": [
        {
          "offeringQualificationDate": "08-10-2023",
          "offeringCommenceDate": "08-10-2023",
          "offeringSecuritiesQualifiedSold": 7500000,
          "offeringSecuritiesSold": 3870,
          "pricePerSecurity": 10,
          "portionSecuritiesSoldIssuer": 30960,
          "portionSecuritiesSoldSecurityholders": 7740,
          "underwrittenSpName": ["-"],
          "underwriterFees": 0,
          "salesCommissionsSpName": ["Dalmore Group, LLC"],
          "salesCommissionsFee": 387,
          "findersSpName": ["-"],
          "findersFees": 0,
          "auditorSpName": ["Fruci & Associates II, PLLC"],
          "auditorFees": 40000,
          "legalSpName": ["Nelson Mullins Riley & Scarborough"],
          "legalFees": 132500,
          "promoterSpName": ["-"],
          "promotersFees": 0,
          "blueSkySpName": ["Guarrd, Inc."],
          "blueSkyFees": 4750,
          "crdNumberBrokerDealer": "000154559",
          "issuerNetProceeds": 25900.4,
          "clarificationResponses": "Net proceeds represents amount received by issuer ($30,960) after subtracting its share of commissions ($309.60) and blue sky compliance costs ($4,750)."
        }
      ],
      "certificationSuspension": [
        {
          "securitiesClassTitle": "Class B Common Stock",
          "certificationFileNumber": ["024-12301"],
          "approxRecordHolders": 15
        }
      ],
      "signatureTab": [
        {
          "cik": "0001973742",
          "regulationIssuerName1": "Worldwide Stages, Inc.",
          "regulationIssuerName2": "Worldwide Stages, Inc.",
          "signatureBy": "/s/ Kelly Frey, Sr.",
          "date": "12-31-2024",
          "title": "Chief Executive Officer"
        }
      ]
    }
  ]
}
```

</details>

### Form 1-A: Offering Statements

```js
const { form1AApi } = require('sec-api');

form1AApi.setApiKey('YOUR_API_KEY');

const form1A = await form1AApi.getData({
  query: 'summaryInfo.indicateTier1Tier2Offering:Tier1',
  from: '0',
  size: '10',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>

```json
{
  "total": { "value": 1954, "relation": "eq" },
  "data": [
    {
      "id": "3049ff20a7a655422f33f02c192c75bf",
      "accessionNo": "0001493152-26-012984",
      "fileNo": "024-12729",
      "formType": "1-A",
      "filedAt": "2026-03-26T17:11:42-04:00",
      "cik": "1587603",
      "ticker": "",
      "companyName": "WINNERS, INC.",
      "employeesInfo": [
        {
          "issuerName": "Winners, Inc.",
          "jurisdictionOrganization": "NV",
          "yearIncorporation": "2007",
          "cik": "0001587603",
          "sicCode": 7990,
          "irsNum": "26-0764832",
          "fullTimeEmployees": 0,
          "partTimeEmployees": 2
        }
      ],
      "issuerInfo": {
        "street1": "401 RYLAND STREET",
        "street2": "SUITE 200-A",
        "city": "RENO",
        "stateOrCountry": "NV",
        "zipCode": "89502",
        "phoneNumber": "917-767-0075",
        "connectionName": "Jim Byrd",
        "industryGroup": "Other",
        "cashEquivalents": 537,
        "investmentSecurities": 0,
        "accountsReceivable": 200000,
        "propertyPlantEquipment": 0,
        "totalAssets": 475537,
        "accountsPayable": 483052,
        "longTermDebt": 355718,
        "totalLiabilities": 838770,
        "totalStockholderEquity": -363233,
        "totalLiabilitiesAndEquity": 475537,
        "totalRevenues": 495,
        "costAndExpensesApplToRevenues": 0,
        "depreciationAndAmortization": 0,
        "netIncome": -978989,
        "earningsPerShareBasic": 0,
        "earningsPerShareDiluted": 0
      },
      "commonEquity": [
        {
          "commonEquityClassName": "Common",
          "outstandingCommonEquity": 53115625,
          "commonCusipEquity": "97478A304",
          "publiclyTradedCommonEquity": "OTCID"
        }
      ],
      "preferredEquity": [
        {
          "preferredEquityClassName": "Series A Preferred",
          "outstandingPreferredEquity": 0,
          "preferredCusipEquity": "000000000",
          "publiclyTradedPreferredEquity": "NA"
        }
      ],
      "debtSecurities": [
        {
          "debtSecuritiesClassName": "NA",
          "outstandingDebtSecurities": 0,
          "cusipDebtSecurities": "000000000",
          "publiclyTradedDebtSecurities": "NA"
        }
      ],
      "issuerEligibility": {
        "certifyIfTrue": true
      },
      "applicationRule262": {
        "certifyIfNotDisqualified": true
      },
      "summaryInfo": {
        "indicateTier1Tier2Offering": "Tier1",
        "financialStatementAuditStatus": "Unaudited",
        "securitiesOfferedTypes": ["Equity (common or preferred stock)"],
        "offerDelayedContinuousFlag": true,
        "offeringYearFlag": false,
        "offeringAfterQualifFlag": false,
        "offeringBestEffortsFlag": true,
        "solicitationProposedOfferingFlag": false,
        "resaleSecuritiesAffiliatesFlag": false,
        "securitiesOffered": 10000000,
        "outstandingSecurities": 53115625,
        "pricePerSecurity": 0.5,
        "issuerAggregateOffering": 5000000,
        "securityHolderAggegate": 0,
        "qualificationOfferingAggregate": 0,
        "concurrentOfferingAggregate": 0,
        "totalAggregateOffering": 5000000,
        "legalServiceProviderName": "James S. Byrd, P.A.",
        "legalFees": 115000,
        "estimatedNetAmount": 4885000,
        "clarificationResponses": "In payment for legal fees related to this Offering, the Company will issue 200,000 shares of stock to James S. Byrd, P.A., at the price of $.50 per share, under this Regulation A Offering once qualified."
      },
      "juridictionSecuritiesOffered": {
        "jurisdictionsOfSecOfferedNone": true,
        "issueJuridicationSecuritiesOffering": ["FL", "NY"]
      },
      "securitiesIssued": [
        {
          "securitiesIssuerName": "Winners, Inc.",
          "securitiesIssuerTitle": "Series A Convertible Preferred Stock",
          "securitiesIssuedTotalAmount": 149346690,
          "securitiesPrincipalHolderAmount": 0,
          "securitiesIssuedAggregateAmount": "$1,345,935 valued at $0.10 per share for settlement of monies owed..."
        }
      ],
      "unregisteredSecuritiesAct": {
        "securitiesActExcemption": "15 U.S.C. s. 77d(a)(2); Regulation D 506(b)"
      }
    }
  ]
}
```

</details>

### Form 1-K: Annual Reports

```js
const { form1KApi } = require('sec-api');

form1KApi.setApiKey('YOUR_API_KEY');

const form1K = await form1KApi.getData({
  query: 'fileNo:24R-00472',
  from: '0',
  size: '10',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>

```json
{
  "total": { "value": 4, "relation": "eq" },
  "data": [
    {
      "id": "9e7259d5bfcc20d7bdf19c7037ab1186",
      "accessionNo": "0001493152-25-009865",
      "fileNo": "24R-00472",
      "formType": "1-K",
      "filedAt": "2025-03-11T16:38:05-04:00",
      "periodOfReport": "2024-12-31",
      "cik": "1786471",
      "ticker": "",
      "companyName": "Aptera Motors Corp",
      "item1": {
        "formIndication": "Annual Report",
        "fiscalYearEnd": "12-31-2024",
        "street1": "5818 El Camino Real",
        "city": "Carlsbad",
        "stateOrCountry": "CA",
        "zipCode": "92008",
        "phoneNumber": "858-371-3151",
        "issuedSecuritiesTitle": ["Class B Common Stock"]
      },
      "item1Info": [
        {
          "issuerName": "Aptera Motors Corp.",
          "cik": "0001786471",
          "jurisdictionOrganization": "DE",
          "irsNum": "83-4079594"
        }
      ],
      "item2": {
        "regArule257": false
      },
      "summaryInfo": [
        {
          "commissionFileNumber": "024-11479",
          "offeringQualificationDate": "05-19-2021",
          "offeringCommenceDate": "05-19-2021",
          "qualifiedSecuritiesSold": 14000000,
          "offeringSecuritiesSold": 12630689,
          "pricePerSecurity": 8.02,
          "aggregrateOfferingPrice": 101297126,
          "aggregrateOfferingPriceHolders": 0,
          "underwrittenSpName": ["Dalmore Group, LLC / OpenDeal Broker LLC"],
          "underwriterFees": 1012971,
          "auditorSpName": ["dbbMcKennon"],
          "auditorFees": 150000,
          "legalSpName": ["CrowdCheck Law LLP/ Sheppard Mullin"],
          "legalFees": 90000,
          "blueSkySpName": ["Various State Fees"],
          "blueSkyFees": 80000,
          "crdNumberBrokerDealer": "000136352",
          "issuerNetProceeds": 99964154,
          "clarificationResponses": "The offering was open for three years. The amounts in this form reflect all three years. Price per security is the avg price over the period."
        }
      ]
    }
  ]
}
```

</details>

### Form 1-Z: Exit Reports

```js
const { form1ZApi } = require('sec-api');

form1ZApi.setApiKey('YOUR_API_KEY');

const form1Z = await form1ZApi.getData({
  query: 'cik:*',
  from: '0',
  size: '10',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>

```json
{
  "total": { "value": 361, "relation": "eq" },
  "data": [
    {
      "id": "9b9dfa9d1532fbe9150cea549881f0cc",
      "accessionNo": "0001683168-26-002068",
      "fileNo": "024-12157",
      "formType": "1-Z/A",
      "filedAt": "2026-03-23T06:02:42-04:00",
      "cik": "1585380",
      "ticker": "INKW",
      "companyName": "Greene Concepts, Inc",
      "item1": {
        "issuerName": "Greene Concepts, Inc.",
        "street1": "13195 U.S. Highway 221 N",
        "city": "Marion",
        "stateOrCountry": "NC",
        "zipCode": "28752",
        "phone": "844-889-2837",
        "commissionFileNumber": ["024-12157"]
      },
      "summaryInfoOffering": [
        {
          "offeringQualificationDate": "04-03-2023",
          "offeringCommenceDate": "04-03-2023",
          "offeringSecuritiesQualifiedSold": 4500000000,
          "offeringSecuritiesSold": 3047136365,
          "pricePerSecurity": 0.0006,
          "portionSecuritiesSoldIssuer": 1972001,
          "portionSecuritiesSoldSecurityholders": 0,
          "legalSpName": ["Donnell Suares/Newlan Law Firm, PLLC"],
          "legalFees": 37500,
          "blueSkySpName": ["State Regulators"],
          "blueSkyFees": 2500,
          "issuerNetProceeds": 1932001
        }
      ],
      "certificationSuspension": [
        {
          "securitiesClassTitle": "Common Stock",
          "certificationFileNumber": ["024-12157"],
          "approxRecordHolders": 5050
        }
      ],
      "signatureTab": [
        {
          "cik": "0001585380",
          "regulationIssuerName1": "Greene Concepts, Inc.",
          "regulationIssuerName2": "Greene Concepts, Inc.",
          "signatureBy": "/s/ Leonard Greene",
          "date": "03-23-2026",
          "title": "Chief Executive Officer"
        }
      ]
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/reg-a-offering-statements-api

## Auditor and Accountant Changes (Item 4.01)

Access structured data from 8-K filings reporting changes in a registrant's certifying accountant (Item 4.01).

```js
const { form8KApi } = require('sec-api');

form8KApi.setApiKey('YOUR_API_KEY');

const data = await form8KApi.getData({
  query: 'item4_01:* AND filedAt:[2024-01-01 TO 2024-12-31]',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 10000, "relation": "gte" },
  "data": [
    {
      "id": "7ed33db091e32b437ff9c4571531869d",
      "accessionNo": "0001388658-26-000022",
      "formType": "8-K",
      "filedAt": "2026-03-31T19:49:16-04:00",
      "periodOfReport": "2026-03-30",
      "cik": "1388658",
      "ticker": "IRTC",
      "companyName": "iRhythm Holdings, Inc.",
      "items": [
        "Item 4.01: Changes in Registrant's Certifying Accountant",
        "Item 9.01: Financial Statements and Exhibits"
      ],
      "item4_01": {
        "keyComponents": "iRhythm Holdings, Inc. dismissed PricewaterhouseCoopers LLP as its independent auditor on March 30, 2026, and subsequently engaged KPMG LLP as the new auditor for the fiscal year ending December 31, 2026.",
        "newAccountantDate": "2026-03-30",
        "engagedNewAccountant": true,
        "formerAccountantDate": "2026-03-30",
        "engagementEndReason": "dismissal",
        "formerAccountantName": "PricewaterhouseCoopers LLP",
        "newAccountantName": "KPMG LLP",
        "consultedNewAccountant": false,
        "reportedDisagreements": false,
        "reportableEventsExist": false,
        "attachments": ["Exhibit 16.1"],
        "reportedIcfrWeakness": false,
        "opinionType": "unqualified",
        "auditDisclaimer": false,
        "approvedChange": true
      }
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/form-8k-data-item4-1-search-api

## Financial Restatements & Non-Reliance on Prior Financial Results (Item 4.02)

Access structured data from 8-K filings reporting non-reliance on previously issued financial statements (Item 4.02).

```js
const { form8KApi } = require('sec-api');

form8KApi.setApiKey('YOUR_API_KEY');

const data = await form8KApi.getData({
  query: 'item4_02:* AND filedAt:[2024-01-01 TO 2024-12-31]',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>

```json
{
  "total": { "value": 8546, "relation": "eq" },
  "data": [
    {
      "id": "1153464e0d82cd42a5773bede05220a8",
      "accessionNo": "0001765048-26-000002",
      "formType": "8-K",
      "filedAt": "2026-03-26T09:53:26-04:00",
      "periodOfReport": "2026-03-26",
      "cik": "1765048",
      "ticker": "GCGJ",
      "companyName": "GUOCHUN INTERNATIONAL INC.",
      "items": [
        "Item 4.02: Non-Reliance on Previously Issued Financial Statements or a Related Audit Report or Completed Interim Review"
      ],
      "item4_02": {
        "keyComponents": "The Company determined that action should be taken to preclude reliance on previously issued unaudited condensed financial statements for the period ended September 30, 2025, due to an erroneously recorded amount in other general and administrative expenses.",
        "identifiedIssues": [
          "Erroneously recorded amount in other general and administrative expenses"
        ],
        "affectedReportingPeriods": ["Q3 2025"],
        "identifiedBy": ["Company"],
        "restatementIsNecessary": true,
        "reasonsForRestatement": [
          "Erroneous recording of other general and administrative expenses"
        ],
        "impactYetToBeDetermined": true,
        "impactOfError": "Decrease in other general and administrative expenses of $8,250, with a corresponding increase in prepayments of $8,250.",
        "impactIsMaterial": false,
        "materialWeaknessIdentified": false,
        "affectedLineItems": [
          "Other General and Administrative Expenses",
          "Prepayments"
        ],
        "netIncomeDecreased": false,
        "netIncomeIncreased": false,
        "revenueDecreased": false,
        "revenueIncreased": false,
        "eventClassification": "Financial Restatement Due to Erroneous Recording in General and Administrative Expenses"
      }
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/form-8k-data-search-api

## Changes of Directors, Executives, Board Members and Compensation Plans (Item 5.02)

Access structured data from 8-K filings reporting departures or appointments of directors and officers, and changes to compensatory arrangements (Item 5.02).

```js
const { form8KApi } = require('sec-api');

form8KApi.setApiKey('YOUR_API_KEY');

const data = await form8KApi.getData({
  query: 'item5_02:* AND filedAt:[2024-01-01 TO 2024-12-31]',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>

```json
{
  "total": { "value": 10000, "relation": "gte" },
  "data": [
    {
      "id": "9589d3da16d0e3bd48e6ebb799dd9988",
      "accessionNo": "0001193125-26-135660",
      "formType": "8-K",
      "filedAt": "2026-04-01T07:00:10-04:00",
      "periodOfReport": "2026-04-01",
      "cik": "1109354",
      "ticker": "BRKR",
      "companyName": "BRUKER CORP",
      "items": [
        "Item 5.02: Departure of Directors or Certain Officers; Election of Directors; Appointment of Certain Officers: Compensatory Arrangements of Certain Officers",
        "Item 9.01: Financial Statements and Exhibits"
      ],
      "item5_02": {
        "keyComponents": "Thierry L. Bernard was appointed as a new director to the Board of Bruker Corporation, expanding the Board to twelve directors. His appointment is effective April 1, 2026.",
        "personnelChanges": [
          {
            "type": "appointment",
            "effectiveDate": "2026-04-01",
            "positions": ["Director"],
            "person": {
              "name": "Thierry L. Bernard",
              "positionsAtOtherCompanies": [
                "CEO and Managing Director of QIAGEN N.V.",
                "Chair of the AdvaMedDx Board of Directors",
                "Board Member at Neogen Corporation"
              ],
              "academicAffiliations": [
                "Sciences Po",
                "LSE",
                "College of Europe",
                "Harvard Business School"
              ],
              "background": "Joined QIAGEN in February 2015, named CEO in March 2020, previously held roles at bioMérieux SA and other international companies.",
              "previousPositions": [
                "Corporate Vice President, Global Commercial Operations at bioMérieux SA"
              ]
            },
            "compensation": { "noCompensation": false },
            "continuedConsultingRole": false,
            "termExtended": false,
            "termShortened": false,
            "compensationIncreased": false,
            "compensationDecreased": false,
            "disagreements": false,
            "interim": false
          }
        ],
        "organizationChanges": {
          "organ": "Board of Directors",
          "details": "Expansion of the board",
          "sizeIncrease": true,
          "sizeDecrease": false,
          "created": false,
          "abolished": false,
          "affectedPersonnel": ["Thierry L. Bernard"]
        },
        "attachments": ["Form 8-K", "Company Press Release"]
      }
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/form-8k-data-item5-2-search-api

## Directors & Board Members Data API

Access structured data on directors and board members of public companies, including names, roles, tenure, and committee memberships.

```js
const { directorsBoardMembersApi } = require('sec-api');

directorsBoardMembersApi.setApiKey('YOUR_API_KEY');

const data = await directorsBoardMembersApi.getData({
  query: 'ticker:AAPL',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 20, "relation": "eq" },
  "data": [
    {
      "id": "42fe18db08211769589dc61fbd461443",
      "filedAt": "2026-01-08T16:31:36-05:00",
      "accessionNo": "0001308179-26-000008",
      "cik": "320193",
      "ticker": "AAPL",
      "entityName": "Apple Inc.",
      "directors": [
        {
          "name": "Alex Gorsky",
          "position": "Former Chair and CEO, Johnson & Johnson; Director",
          "age": "65",
          "directorClass": "II",
          "dateFirstElected": "2021",
          "isIndependent": false,
          "committeeMemberships": ["Nominating Committee", "People and Compensation Committee"],
          "qualificationsAndExperience": ["executive leadership experience", "brand marketing expertise", "experience in health and technology"]
        },
        {
          "name": "Tim Cook",
          "position": "CEO; Chief Executive Officer",
          "age": "65",
          "directorClass": "",
          "dateFirstElected": "2011",
          "isIndependent": null,
          "committeeMemberships": [],
          "qualificationsAndExperience": ["extensive executive leadership experience in the technology industry", "management of worldwide operations", "sales, service, and support"]
        }
        // ... more directors
      ]
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/directors-and-board-members-data-api

## Executive Compensation Data API

Access structured executive compensation data from proxy statements, including salary, bonus, stock awards, and total compensation. Supports both a simple ticker lookup (GET) and advanced search queries (POST).

```js
const { execCompApi } = require('sec-api');

execCompApi.setApiKey('YOUR_API_KEY');

// Simple lookup by ticker
const compByTicker = await execCompApi.getData('TSLA');
// response: [...] array of compensation records

// Advanced search with query object
const compByQuery = await execCompApi.getData({
  query: 'cik:1318605 AND year:2023',
  from: '0',
  size: '200',
  sort: [{ year: { order: 'desc' } }, { 'name.keyword': { order: 'asc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
[
  {
    "id": "19b4cc24f7170d4f2a69fe20299e8478",
    "cik": "1318605",
    "ticker": "TSLA",
    "name": "Tom Zhu",
    "position": "SVP, APAC and Global Vehicle Manufacturing",
    "year": 2024,
    "salary": 350000,
    "bonus": 0,
    "stockAwards": 0,
    "optionAwards": 0,
    "nonEquityIncentiveCompensation": 0,
    "changeInPensionValueAndDeferredEarnings": 0,
    "otherCompensation": 168250,
    "total": 518250
  },
  {
    "id": "cf7779d6e76ea8fbb5d95a250758dd93",
    "cik": "1318605",
    "ticker": "TSLA",
    "name": "Elon Musk",
    "position": "Technoking of Tesla and Chief Executive Officer",
    "year": 2024,
    "salary": 0,
    "bonus": 0,
    "stockAwards": 0,
    "optionAwards": 0,
    "nonEquityIncentiveCompensation": 0,
    "changeInPensionValueAndDeferredEarnings": 0,
    "otherCompensation": 0,
    "total": 0
  }
  // ... more executives
]
```

</details>

> See the documentation for more details: https://sec-api.io/docs/executive-compensation-api

## Outstanding Shares & Public Float API

Access data on outstanding shares and public float reported in SEC filings. Outstanding shares are reported in both 10-K and 10-Q filings, while public float is only disclosed in annual reports (10-K).

```js
const { floatApi } = require('sec-api');

floatApi.setApiKey('YOUR_API_KEY');

// Lookup by ticker
const floatByTicker = await floatApi.getFloat({ ticker: 'AAPL' });

// Lookup by CIK
const floatByCik = await floatApi.getFloat({ cik: '320193' });
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 59, "relation": "eq" },
  "data": [
    {
      "id": "2ff3110e1d6a331323fc8171584b6802",
      "tickers": ["AAPL"],
      "cik": "320193",
      "float": {
        "outstandingShares": [
          { "period": "2026-01-16", "shareClass": "", "value": 14681140000 }
        ],
        "publicFloat": []
      },
      "reportedAt": "2026-01-30T06:01:32-05:00",
      "periodOfReport": "2025-12-27",
      "sourceFilingAccessionNo": "0000320193-26-000006"
    },
    {
      "id": "736081ee32d8abd105e3d9cf4fadc5fb",
      "tickers": ["AAPL"],
      "cik": "320193",
      "float": {
        "outstandingShares": [
          { "period": "2025-10-17", "shareClass": "", "value": 14776353000 }
        ],
        "publicFloat": [
          { "period": "2025-03-28", "shareClass": "", "value": 3253431000000 }
        ]
      },
      "reportedAt": "2025-10-31T06:01:26-04:00",
      "periodOfReport": "2025-09-27",
      "sourceFilingAccessionNo": "0000320193-25-000079"
    }
    // ... more data
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/outstanding-shares-float-api

## Subsidiary API

Access data on company subsidiaries disclosed in Exhibit 21 of 10-K annual reports.

```js
const { subsidiaryApi } = require('sec-api');

subsidiaryApi.setApiKey('YOUR_API_KEY');

const data = await subsidiaryApi.getData({
  query: 'ticker:AAPL',
  from: '0',
  size: '50',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 26, "relation": "eq" },
  "data": [
    {
      "id": "53b6eca92223fed0008eae2e5e2ec8f1",
      "accessionNo": "0000320193-25-000079",
      "filedAt": "2025-10-31T06:01:26-04:00",
      "cik": "320193",
      "ticker": "AAPL",
      "companyName": "Apple Inc.",
      "subsidiaries": [
        { "name": "Apple Asia Limited", "jurisdiction": "Hong Kong" },
        { "name": "Apple Canada Inc.", "jurisdiction": "Canada" },
        { "name": "Apple Distribution International Limited", "jurisdiction": "Ireland" },
        { "name": "Apple Japan, Inc.", "jurisdiction": "Japan" }
        // ... more subsidiaries
      ]
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/subsidiary-api

## Audit Fees Data API

Access audit fee data disclosed in proxy statements (DEF 14A), including fees paid to auditors for audit services, audit-related services, tax services, and other services.

```js
const { auditFeesApi } = require('sec-api');

auditFeesApi.setApiKey('YOUR_API_KEY');

const data = await auditFeesApi.getData({
  query: 'cik:1318605',
  from: '0',
  size: '10',
  sort: [{ filedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>

```json
{
  "total": { "value": 10000, "relation": "gte" },
  "data": [
    {
      "id": "a522dfd61d00caa01da0b4f4b38607c5",
      "accessionNo": "0001717547-26-000026",
      "formType": "DEF 14A",
      "filedAt": "2026-04-01T08:33:43-04:00",
      "periodOfReport": "2026-05-13",
      "entities": [
        {
          "cik": "1717547",
          "ticker": "BRSP",
          "companyName": "BrightSpire Capital, Inc. (Filer)",
          "irsNo": "384046290",
          "fiscalYearEnd": "1231",
          "stateOfIncorporation": "MD",
          "sic": "6798 Real Estate Investment Trusts",
          "act": "34",
          "fileNo": "001-38377",
          "filmNo": "26824836"
        }
      ],
      "records": [
        {
          "year": 2025,
          "auditFees": 1251363,
          "auditRelatedFees": null,
          "taxFees": null,
          "allOtherFees": null,
          "totalFees": 1251363,
          "auditor": "Deloitte & Touche LLP"
        },
        {
          "year": 2024,
          "auditFees": 1487239,
          "auditRelatedFees": null,
          "taxFees": 714695,
          "allOtherFees": null,
          "totalFees": 2201934,
          "auditor": "Ernst & Young"
        }
      ]
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/audit-fees-api

## SEC Enforcement Actions Database API

Search and access SEC enforcement actions, including civil lawsuits filed in federal court and administrative proceedings.

```js
const { secEnforcementActionsApi } = require('sec-api');

secEnforcementActionsApi.setApiKey('YOUR_API_KEY');

const data = await secEnforcementActionsApi.getData({
  query: 'releasedAt:[2024-01-01 TO 2024-12-31]',
  from: '0',
  size: '50',
  sort: [{ releasedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 137, "relation": "eq" },
  "data": [
    {
      "id": "7efc54567587f7930a3e3c1919b5ed8e",
      "releaseNo": "2024-212",
      "releasedAt": "2024-12-20T17:25:11-05:00",
      "url": "https://www.sec.gov/newsroom/press-releases/2024-212",
      "title": "Tai Mo Shan to Pay $123 Million for Negligently Misleading Investors About Stability of Terra USD",
      "resources": [
        { "label": "SEC Order", "url": "https://www.sec.gov/files/litigation/admin/2024/33-11349.pdf" }
      ],
      "summary": "The SEC charged Tai Mo Shan Limited with misleading investors about the stability of Terra USD and acting as a statutory underwriter for LUNA crypto assets, resulting in a $123 million settlement.",
      "tags": ["disclosure fraud", "crypto", "unregistered securities"],
      "entities": [
        { "name": "Tai Mo Shan Limited", "type": "company", "role": "defendant" },
        { "name": "Terraform Labs PTE Ltd.", "type": "company", "role": "other" },
        { "name": "Do Kwon", "type": "individual", "role": "other" }
      ],
      "complaints": [
        "Tai Mo Shan misled investors about the stability of Terra USD.",
        "Tai Mo Shan acted as a statutory underwriter in distributing LUNA crypto assets."
      ],
      "parallelActionsTakenBy": [],
      "hasAgreedToSettlement": true,
      "hasAgreedToPayPenalty": true,
      "penaltyAmounts": [
        { "penaltyAmount": "73452756", "penaltyAmountText": "$73,452,756", "imposedOn": "Tai Mo Shan Limited" },
        { "penaltyAmount": "12916153", "penaltyAmountText": "$12,916,153", "imposedOn": "Tai Mo Shan Limited" },
        { "penaltyAmount": "36726378", "penaltyAmountText": "$36,726,378", "imposedOn": "Tai Mo Shan Limited" }
      ],
      "requestedRelief": [
        "disgorgement of profits",
        "prejudgment interest",
        "civil penalties",
        "cease and desist from violations"
      ],
      "violatedSections": ["registration and fraud provisions"],
      "investigationConductedBy": ["Liz Canizares", "Derek Kleinmann", "Daniel Sinnreich"],
      "litigationLedBy": [],
      "otherAgenciesInvolved": []
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/sec-enforcement-actions-database-api

## SEC Litigation Releases Database API

Access SEC litigation releases that announce civil lawsuits filed by the SEC in federal courts.

```js
const { secLitigationsApi } = require('sec-api');

secLitigationsApi.setApiKey('YOUR_API_KEY');

const data = await secLitigationsApi.getData({
  query: 'releasedAt:[2024-01-01 TO 2024-12-31]',
  from: '0',
  size: '50',
  sort: [{ releasedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 288, "relation": "eq" },
  "data": [
    {
      "id": "d459bd679554a02194c7c5f272f138fa",
      "releaseNo": "LR-26206",
      "releasedAt": "2024-12-31T01:53:13-05:00",
      "url": "https://www.sec.gov/enforcement-litigation/litigation-releases/lr-26206",
      "title": "Dale B. Chappell, et al.",
      "subTitle": "SEC Charges Humanigen's CEO and Chief Scientific Officer with Insider Trading",
      "caseCitations": [
        "Securities and Exchange Commission v. Dale B. Chappell, et al., No. 23-civ-03769 (D.N.J. second amended complaint filed May 20, 2024)"
      ],
      "resources": [
        { "label": "SEC Complaint", "url": "https://www.sec.gov/files/litigation/complaints/2024/comp26206.pdf" }
      ],
      "summary": "The SEC has charged Humanigen's CEO Cameron Durrant and Chief Scientific Officer Dale B. Chappell with insider trading for selling company stock based on nonpublic information about the FDA's likely rejection of their COVID-19 drug, resulting in significant avoided losses.",
      "tags": ["insider trading", "biopharmaceutical", "antifraud"],
      "entities": [
        { "name": "Cameron Durrant", "type": "individual", "role": "defendant" },
        { "name": "Dale B. Chappell", "type": "individual", "role": "defendant" },
        { "name": "Humanigen, Inc.", "type": "company", "role": "other", "cik": "1293310", "ticker": "HGENQ" }
        // ... more items
      ],
      "complaints": [
        "Chappell and Durrant sold Humanigen stock while in possession of material nonpublic information that the FDA was unlikely to approve Emergency Use Authorization for lenzilumab."
        // ... more items
      ],
      "parallelActionsTakenBy": [
        "Department of Justice's Fraud Section",
        "U.S. Attorney's Office for the District of New Jersey"
      ],
      "hasAgreedToSettlement": false,
      "hasAgreedToPayPenalty": false,
      "penaltyAmounts": [],
      "requestedRelief": [
        "permanent injunctions",
        "disgorgement of ill-gotten gains with prejudgment interest",
        "civil penalties",
        "officer and director bars"
      ],
      "violatedSections": [
        "Section 17(a) of the Securities Act of 1933",
        "Section 10(b) of the Securities Exchange Act of 1934",
        "Rule 10b-5"
      ],
      "investigationConductedBy": ["W. Bradley Ney", "Daniel Ball", "George B. Parizek", "Kevin Wu", "Zachary Scrima", "Melissa Robertson", "Pei Y. Chung"],
      "litigationLedBy": ["Anna Area", "Daniel Lloyd", "Daniel Ball", "David Nasse"],
      "otherAgenciesInvolved": [
        { "name": "Criminal Fraud Section of the U.S. Department of Justice", "country": "United States" }
        // ... more items
      ]
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/sec-litigation-releases-database-api

## SEC Administrative Proceedings Database API

Access SEC administrative proceedings, including orders instituting proceedings, settled cases, and hearing outcomes.

```js
const { secAdminProceedingsApi } = require('sec-api');

secAdminProceedingsApi.setApiKey('YOUR_API_KEY');

const data = await secAdminProceedingsApi.getData({
  query: 'releasedAt:[2024-01-01 TO 2024-12-31]',
  from: '0',
  size: '50',
  sort: [{ releasedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 711, "relation": "eq" },
  "data": [
    {
      "id": "0ab80b58b2fcf40e7497aa0000759a37",
      "releasedAt": "2024-12-31T12:19:45-05:00",
      "releaseNo": ["34-102060", "AAER-4554"],
      "fileNumbers": ["3-22386"],
      "respondents": [
        { "name": "Accell Audit & Compliance, PA", "type": "company", "role": "respondent" }
      ],
      "respondentsText": "Accell Audit & Compliance, PA",
      "resources": [
        { "label": "primary", "url": "https://www.sec.gov/files/litigation/admin/2024/34-102060.pdf" }
      ],
      "title": "ORDER INSTITUTING PUBLIC ADMINISTRATIVE PROCEEDINGS PURSUANT TO RULE 102(e) OF THE COMMISSION'S RULES OF PRACTICE, MAKING FINDINGS, AND IMPOSING REMEDIAL SANCTIONS",
      "summary": "The SEC has instituted public administrative proceedings against Accell Audit & Compliance, PA, resulting in its suspension from appearing or practicing before the Commission due to its involvement in fraudulent financial reporting with Ignite International Brands, Ltd.",
      "tags": ["fraudulent financial reporting", "accounting misconduct"],
      "entities": [
        { "name": "Accell Audit & Compliance, PA", "type": "company", "role": "respondent" },
        { "name": "Ignite International Brands, Ltd.", "type": "company", "role": "related party" }
      ],
      "complaints": [
        "Accell failed to exercise due professional care or skepticism, or to otherwise obtain sufficient appropriate audit evidence..."
        // ... more items
      ],
      "parallelActionsTakenBy": [],
      "hasAgreedToSettlement": true,
      "hasAgreedToPayPenalty": true,
      "penaltyAmounts": [
        { "penaltyAmount": "75000", "penaltyAmountText": "$75,000", "imposedOn": "Accell Audit & Compliance, PA" }
      ],
      "requestedRelief": [],
      "violatedSections": ["Section 10(b) of the Exchange Act", "Rule 10b-5"],
      "orders": ["Accell is suspended from appearing or practicing before the Commission as an accountant."],
      "investigationConductedBy": [],
      "litigationLedBy": [],
      "otherAgenciesInvolved": []
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/sec-administrative-proceedings-database-api

## AAER Database API

Access Accounting and Auditing Enforcement Releases (AAERs) issued by the SEC against companies and individuals for accounting fraud and auditing violations.

```js
const { aaerApi } = require('sec-api');

aaerApi.setApiKey('YOUR_API_KEY');

const data = await aaerApi.getData({
  query: 'dateTime:[2020-01-01 TO 2024-12-31]',
  from: '0',
  size: '50',
  sort: [{ dateTime: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 427, "relation": "eq" },
  "data": [
    {
      "id": "b2dfd65355cdf4c4a629103a211882ce",
      "dateTime": "2024-12-31T12:19:45-05:00",
      "aaerNo": "AAER-4554",
      "releaseNo": ["34-102060"],
      "respondents": [
        { "name": "Accell Audit & Compliance, PA", "type": "company" }
      ],
      "respondentsText": "Accell Audit & Compliance, PA",
      "urls": [
        { "type": "primary", "url": "https://www.sec.gov/files/litigation/admin/2024/34-102060.pdf" }
      ],
      "summary": "The SEC has instituted public administrative proceedings against Accell Audit & Compliance, PA, resulting in a suspension and a $75,000 penalty for failing to exercise due professional care in auditing Ignite International Brands, Ltd.'s financial statements.",
      "tags": ["auditing misconduct", "fraudulent financial reporting"],
      "entities": [
        { "name": "Accell Audit & Compliance, PA", "type": "company", "role": "respondent" },
        { "name": "Ignite International Brands, Ltd.", "type": "company", "role": "entity audited" }
      ],
      "complaints": [
        "Accell failed to exercise due professional care or skepticism, or to obtain sufficient appropriate audit evidence..."
        // ... more items
      ],
      "parallelActionsTakenBy": [],
      "hasAgreedToSettlement": true,
      "hasAgreedToPayPenalty": true,
      "penaltyAmounts": [
        { "penaltyAmount": "75000", "penaltyAmountText": "$75,000", "imposedOn": "Accell Audit & Compliance, PA" }
      ],
      "requestedRelief": ["suspension from appearing or practicing before the Commission"],
      "violatedSections": ["Section 10(b) of the Exchange Act", "Rule 10b-5"],
      "otherAgenciesInvolved": []
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/aaer-database-api

## SRO Filings Database API

Access Self-Regulatory Organization (SRO) filings, including rule proposals and amendments from exchanges like NYSE and NASDAQ.

```js
const { sroFilingsApi } = require('sec-api');

sroFilingsApi.setApiKey('YOUR_API_KEY');

const data = await sroFilingsApi.getData({
  query: 'sro:NYSE',
  from: '0',
  size: '50',
  sort: [{ issueDate: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 7963, "relation": "eq" },
  "data": [
    {
      "id": "dea4e1fa1371b4b91e08c7c3f5f42eae",
      "releaseNumber": "34-105132",
      "issueDate": "2026-03-31",
      "fileNumber": "SR-NYSEAMER-2026-25",
      "sro": "NYSE American LLC (NYSEAMER)",
      "details": "Notice of Filing and Immediate Effectiveness of a Proposed Rule Change to Modify the NYSE American Options Fee Schedule...",
      "commentsDue": "21 days after publication in the Federal Register.",
      "urls": [
        { "type": "34-105132", "url": "https://www.sec.gov/files/rules/sro/nyseamer/2026/34-105132.pdf" },
        { "type": "Exhibit 5", "url": "https://www.sec.gov/files/rules/sro/nyseamer/2026/34-105132-ex5.pdf" },
        { "type": "Submit a Comment on SR-NYSEAMER-2026-25", "url": "https://www.sec.gov/comments/sr-nyseamer-2026-25/notice-filing-immediate-effectiveness-proposed-rule-change-modify-nyse-american-options-fee-schedule" }
      ]
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/sro-filings-database-api

## CUSIP/CIK/Ticker Mapping API

Map between CUSIP numbers, CIK codes, and ticker symbols. Supports lookup by: `cik`, `ticker`, `cusip`, `name`, `exchange`, `sector`, `industry`.

```js
const { mappingApi } = require('sec-api');

mappingApi.setApiKey('YOUR_API_KEY');

// Resolve by ticker
const byTicker = await mappingApi.resolve('ticker', 'TSLA');

// Resolve by CIK
const byCik = await mappingApi.resolve('cik', '1318605');

// Resolve by CUSIP
const byCusip = await mappingApi.resolve('cusip', '88160R101');

// Resolve by company name
const byName = await mappingApi.resolve('name', 'Tesla');

// Resolve by exchange
const byExchange = await mappingApi.resolve('exchange', 'NASDAQ');
// response: [...] array of matching entities
```

<details>
  <summary>Example Response</summary>
  
```json
[
  {
    "name": "TESLA INC",
    "ticker": "TSLA",
    "cik": "1318605",
    "cusip": "88160R101",
    "exchange": "NASDAQ",
    "isDelisted": false,
    "category": "Domestic Common Stock",
    "sector": "Consumer Cyclical",
    "industry": "Auto Manufacturers",
    "sic": "3711",
    "sicSector": "Manufacturing",
    "sicIndustry": "Motor Vehicles & Passenger Car Bodies",
    "famaSector": "",
    "famaIndustry": "Automobiles and Trucks",
    "currency": "USD",
    "location": "California; U.S.A",
    "id": "eaeafc4ffc04a49da153adebf1f6960a"
  }
]
```

</details>

> See the documentation for more details: https://sec-api.io/docs/mapping-api

## EDGAR Entities Database

Search and access the complete EDGAR entity database, including all companies, funds, and individuals registered with the SEC.

```js
const { edgarEntitiesApi } = require('sec-api');

edgarEntitiesApi.setApiKey('YOUR_API_KEY');

const data = await edgarEntitiesApi.getData({
  query: 'name:"Tesla"',
  from: '0',
  size: '50',
  sort: [{ cikUpdatedAt: { order: 'desc' } }],
});
// response: { total, data }
```

<details>
  <summary>Example Response</summary>
  
```json
{
  "total": { "value": 1, "relation": "eq" },
  "data": [
    {
      "id": "1318605",
      "cik": "1318605",
      "cikUpdatedAt": "2026-02-27T19:00:21-05:00",
      "name": "Tesla, Inc.",
      "nameUpdatedAt": "2026-02-27T19:00:21-05:00",
      "businessAddress": {
        "street1": "1 TESLA ROAD",
        "city": "AUSTIN",
        "state": "TX",
        "stateName": "TEXAS",
        "zip": "78725"
      },
      "businessAddressUpdatedAt": "2026-02-27T19:00:21-05:00",
      "mailingAddress": {
        "street1": "1 TESLA ROAD",
        "city": "AUSTIN",
        "state": "TX",
        "stateName": "TEXAS",
        "zip": "78725"
      },
      "mailingAddressUpdatedAt": "2026-02-27T19:00:21-05:00",
      "stateOfIncorporation": "TX",
      "stateOfIncorporationUpdatedAt": "2026-02-27T19:00:21-05:00",
      "phone": "512-516-8177",
      "phoneUpdatedAt": "2026-02-27T19:00:21-05:00",
      "irsNo": "912197729",
      "irsNoUpdatedAt": "2026-02-27T19:00:21-05:00",
      "fiscalYearEnd": "1231",
      "fiscalYearEndUpdatedAt": "2026-02-27T19:00:21-05:00",
      "sic": "3711",
      "sicUpdatedAt": "2026-02-27T19:00:21-05:00",
      "sicLabel": "3711 MOTOR VEHICLES & PASSENGER CAR BODIES",
      "sicLabelUpdatedAt": "2026-02-27T19:00:21-05:00",
      "cfOffice": "04 Manufacturing",
      "cfOfficeUpdatedAt": "2026-02-27T19:00:21-05:00",
      "formTypes": { "4": true, "144": true, "DEFA14A": true, "DEF 14A": true, "ARS": true, "PX14A6G": true, "8-K": true, "10-Q": true, "S-8": true, "SCHEDULE 13G/A": true, "10-K": true },
      "formTypesUpdatedAt": "2026-02-27T19:00:21-05:00",
      "emergingGrowthCompany": false,
      "emergingGrowthCompanyUpdatedAt": "2025-10-02T09:04:54-04:00",
      "currentReportingStatus": true,
      "currentReportingStatusUpdatedAt": "2025-10-22T21:08:43-04:00",
      "interactiveDataCurrent": true,
      "interactiveDataCurrentUpdatedAt": "2025-10-22T21:08:43-04:00",
      "filerCategory": "Large Accelerated Filer",
      "filerCategoryUpdatedAt": "2025-10-22T21:08:43-04:00",
      "smallBusiness": false,
      "smallBusinessUpdatedAt": "2025-10-22T21:08:43-04:00",
      "shellCompany": false,
      "shellCompanyUpdatedAt": "2025-10-22T21:08:43-04:00",
      "auditorLocationUpdatedAt": "2026-01-28T20:55:03-05:00",
      "voluntaryFilerUpdatedAt": "2026-01-28T20:55:03-05:00",
      "auditorNameUpdatedAt": "2026-01-28T20:55:03-05:00",
      "wellKnownSeasonedIssuerUpdatedAt": "2026-01-28T20:55:03-05:00",
      "latestIcfrAuditSource": "0001628280-26-003952",
      "wellKnownSeasonedIssuer": true,
      "voluntaryFiler": false,
      "latestIcfrAuditFiledAt": "2026-01-28T20:55:03-05:00",
      "latestIcfrAuditSourceUpdatedAt": "2026-01-28T20:55:03-05:00",
      "auditorName": "PricewaterhouseCoopers LLP",
      "latestIcfrAuditFiledAtUpdatedAt": "2026-01-28T20:55:03-05:00",
      "auditorFirmId": "238",
      "auditorFirmIdUpdatedAt": "2026-01-28T20:55:03-05:00",
      "auditorLocation": "San Jose, California"
    }
  ]
}
```

</details>

> See the documentation for more details: https://sec-api.io/docs/edgar-entities-database-api
