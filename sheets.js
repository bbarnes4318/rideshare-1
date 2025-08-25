const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');

const REQUIRED_ENVS = ['GOOGLE_SHEETS_ID', 'GOOGLE_PROJECT_ID', 'GOOGLE_CLIENT_EMAIL'];

function assertEnv() {
  const missing = REQUIRED_ENVS.filter((k) => !process.env[k] || String(process.env[k]).trim() === '');
  const hasKey = (process.env.GOOGLE_PRIVATE_KEY && String(process.env.GOOGLE_PRIVATE_KEY).trim() !== '') ||
                 (process.env.GOOGLE_PRIVATE_KEY_BASE64 && String(process.env.GOOGLE_PRIVATE_KEY_BASE64).trim() !== '');
  if (missing.length || !hasKey) {
    const allMissing = [...missing];
    if (!hasKey) allMissing.push('GOOGLE_PRIVATE_KEY or GOOGLE_PRIVATE_KEY_BASE64');
    throw new Error(`Missing required environment variables: ${allMissing.join(', ')}`);
  }
}

function resolvePrivateKeyFromEnv() {
  let raw = process.env.GOOGLE_PRIVATE_KEY || '';
  const b64 = process.env.GOOGLE_PRIVATE_KEY_BASE64 || '';

  // If base64 provided, prefer it
  if (b64 && b64.trim() !== '') {
    try {
      const decoded = Buffer.from(b64, 'base64').toString('utf8');
      if (decoded.includes('BEGIN') && decoded.includes('PRIVATE KEY')) return decoded;
    } catch (_) {}
  }

  if (!raw || raw.trim() === '') return raw;

  // Strip surrounding quotes if present
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    raw = raw.slice(1, -1);
  }

  // If it contains literal \n sequences, convert them to newlines
  if (raw.includes('\\n')) {
    return raw.replace(/\\n/g, '\n');
  }

  // If it already looks like a PEM with real newlines or BEGIN header, return as-is
  if (raw.includes('BEGIN') || raw.includes('\n')) {
    return raw;
  }

  // Fallback: return raw
  return raw;
}

async function getSheetsClient() {
  assertEnv();

  const privateKey = resolvePrivateKeyFromEnv();

  const auth = new GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  return sheets;
}

async function getSpreadsheet(sheets) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const { data } = await sheets.spreadsheets.get({ spreadsheetId });
  return data;
}

async function findSheetByTitle(sheets, title) {
  const spreadsheet = await getSpreadsheet(sheets);
  const sheet = (spreadsheet.sheets || []).find((s) => s.properties && s.properties.title === title);
  return sheet ? sheet.properties : null;
}

async function createSheetIfMissing(sheets, title) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const existing = await findSheetByTitle(sheets, title);
  if (existing) return existing;

  const { data } = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title,
              gridProperties: { rowCount: 1000, columnCount: 26 },
            },
          },
        },
      ],
    },
  });
  const replies = data.replies || [];
  const added = replies[0]?.addSheet?.properties || null;
  return added;
}

async function ensureHeaderRow(sheets, title, headers) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const range = `${title}!1:1`;
  const { data } = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const existing = data.values && data.values[0];
  if (!existing || existing.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers],
      },
    });
    return;
  }
  // If headers exist but differ, replace to enforce exact order
  const serializedExisting = JSON.stringify(existing);
  const serializedExpected = JSON.stringify(headers);
  if (serializedExisting !== serializedExpected) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers],
      },
    });
  }
}

async function ensureSheetAndHeaders(sheets, title, headers) {
  await createSheetIfMissing(sheets, title);
  await ensureHeaderRow(sheets, title, headers);
}

async function appendRowToSheet(sheets, title, row) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const range = `${title}!A:A`;
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });
}

module.exports = {
  getSheetsClient,
  ensureSheetAndHeaders,
  appendRowToSheet,
};


