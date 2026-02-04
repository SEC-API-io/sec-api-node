# SEC-API.io JavaScript API Library

`sec-api` is a JavaScript library for accessing the complete EDGAR database, including over **20 million SEC filings** from 1993/94 to the present and more than **100 million exhibits and attachments**.

Download filings and related documents, such as complete submission files, index pages, SGML headers, XML and XBRL files, PDFs, and more, at up to **20 requests per second**, with **no API key required**.

The full API documentation is available at [sec-api.io/docs](https://sec-api.io/docs).

## Quick Start

```bash
npm install sec-api
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

**Converter & Extractor APIs**

- [XBRL-to-JSON Converter API + Financial Statements](#xbrl-to-json-converter-api)
- [10-K/10-Q/8-K Section Extraction API](#10-k10-q8-k-section-extractor-api)

**Investment Advisers**

- [Form ADV API - Investment Advisors (Firm & Indvl. Advisors, Brochures, Schedules)](#form-adv-api)

**Ownership Data APIs**

- [Form 3/4/5 API - Insider Trading Disclosures](#insider-trading-data-api)
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
  query: 'formType:"10-Q"', // get most recent 10-Q filings
  from: '0', // used for pagination. set to 50 to retrieve the next 50 metadata objects.
  size: '50', // number of results per response
  sort: [{ filedAt: { order: 'desc' } }], // sort result by filedAt
};

const filings = await queryApi.getFilings(rawQuery);
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
```

> See the documentation for more details: https://sec-api.io/docs/full-text-search-api

## Filings Real-Time Stream API

The Stream API provides a real-time feed of the latest filings submitted to the SEC EDGAR database via a WebSocket connection. This push-based technology ensures immediate delivery of metadata for each new filing as it becomes publicly available.

```js
const { streamApi } = require('sec-api');

streamApi.connect('YOUR_API_KEY');

streamApi.on('filing', (filing) => console.log(filing));
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
```

### Example Response

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

console.log(sectionText);
console.log(sectionHtml);
```

> See the documentation for more details: https://sec-api.io/docs/sec-filings-item-extraction-api
