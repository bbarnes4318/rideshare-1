require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
// Comment out Google Sheets for testing
// const { getSheetsClient, ensureSheetAndHeaders, appendRowToSheet } = require('./sheets');

const app = express();

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

// Serve static files from public directory
app.use(express.static('public'));

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const SHEET_TITLE = 'rideshare';

// Headers in the exact order requested
const HEADERS = [
  'full_name',
  'phone',
  'email',
  'gender',
  'date_of_birth',
  'address',
  'city',
  'state',
  'postal_code',
  'country',
  'diagnosis',
  'date_of_exposure',
  'brief_description_of_your_situation',
  'tcpa_consent_given',
  'xxTrustedFormCertUrl',
  'current_date'
];

let sheetReady = false;

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/debug/env', (_req, res) => {
  const required = ['GOOGLE_SHEETS_ID','GOOGLE_PROJECT_ID','GOOGLE_CLIENT_EMAIL','GOOGLE_PRIVATE_KEY'];
  const status = {};
  for (const k of required) {
    const present = !!(process.env[k] && String(process.env[k]).trim() !== '');
    status[k] = present ? 'OK' : 'MISSING';
  }
  res.json(status);
});

app.post('/webhook', async (req, res) => {
  try {
    const payload = req.body || {};

    // Build the row in the exact headers order; default to empty string if missing
    const row = HEADERS.map((key) => {
      let value = payload[key];
      if (typeof value === 'boolean') return value ? 'true' : 'false';
      if (value === null || value === undefined) return '';
      return String(value);
    });

    // For testing purposes, just log the data instead of sending to Google Sheets
    console.log('Form submission received:', JSON.stringify(payload, null, 2));
    console.log('Formatted row:', row);

    // Comment out Google Sheets functionality for testing
    // const sheets = await getSheetsClient();
    // if (!sheetReady) {
    //   await ensureSheetAndHeaders(sheets, SHEET_TITLE, HEADERS);
    //   sheetReady = true;
    // }
    // await appendRowToSheet(sheets, SHEET_TITLE, row);

    res.json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    const message = (err && err.message) ? err.message : 'Internal Server Error';
    res.status(500).json({ success: false, error: message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


