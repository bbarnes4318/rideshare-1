## Rideshare Webhook → Google Sheets

This app exposes a JSON webhook that appends incoming data into the `rideshare` sheet of your Google Spreadsheet.

### Environment

1) Duplicate `.env.example` to `.env` and fill in values:

- `GOOGLE_SHEETS_ID`: Spreadsheet ID (from the spreadsheet URL)
- `GOOGLE_PROJECT_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`: Service account credentials

Grant your service account email Editor access on the Spreadsheet.

### Run (PowerShell)

```powershell
Set-Location C:\Users\Jimbo\Desktop\ride
node index.js
```

Server listens on port 5000 by default.

### Health Check

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:5000/health
```

### Test Webhook

```powershell
$body = @{
  full_name = 'Jane Doe'
  phone = '+15551234567'
  email = 'jane@example.com'
  gender = 'female'
  date_of_birth = '1990-01-01'
  address = '123 Main St'
  city = 'Austin'
  state = 'TX'
  postal_code = '73301'
  country = 'USA'
  diagnosis = 'N/A'
  date_of_exposure = '2025-01-01'
  brief_description_of_your_situation = 'Short description'
  tcpa_consent_given = $true
  xxTrustedFormCertUrl = 'https://cert.example/abc'
  current_date = (Get-Date).ToString('yyyy-MM-dd')
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri http://localhost:5000/webhook -ContentType 'application/json' -Body $body
```

The service will ensure the `rideshare` sheet exists and the header row matches the required fields.


