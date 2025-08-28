# RideShare Legal Landing Page

## Overview

This branch contains a professional standalone landing page for RideShare Legal consultation services. The landing page is designed to collect case evaluation information from potential clients and submit it to the existing webhook endpoint.

## Features

### 🎨 Professional Design
- **Modern UI/UX**: Clean, professional design with strong color theory
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Visual Appeal**: Gradient backgrounds, smooth animations, and professional typography
- **Conversion Optimized**: Clear call-to-actions and user-friendly form design

### 📝 Complete Form Integration
- **All Required Fields**: Includes all fields from the original form specification
- **Form Validation**: Client-side validation for required fields
- **Professional Styling**: Beautiful form design with focus states and animations
- **User Experience**: Clear labels, helpful placeholders, and intuitive layout

### 🔧 Technical Features
- **Webhook Integration**: Submits directly to the existing `/webhook` endpoint
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Visual feedback during form submission
- **Success Messages**: Clear confirmation when form is submitted successfully

## Form Fields

The landing page includes all the required form fields:

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `full_name` | Text | Yes | Full name of the client |
| `phone` | Tel | Yes | Phone number |
| `email` | Email | Yes | Email address |
| `gender` | Select | No | Gender selection |
| `date_of_birth` | Date | No | Date of birth |
| `address` | Text | No | Street address |
| `city` | Text | No | City |
| `state` | Text | No | State |
| `postal_code` | Text | No | Postal code |
| `country` | Text | No | Country (defaults to "United States") |
| `diagnosis` | Text | No | Medical diagnosis |
| `date_of_exposure` | Date | No | Date of accident |
| `brief_description_of_your_situation` | Textarea | Yes | Description of the situation |
| `tcpa_consent_given` | Checkbox | Yes | TCPA consent for communications |

## Color Scheme & Design

The landing page uses a sophisticated color palette:

- **Primary Gradient**: Purple to blue gradient (`#667eea` to `#764ba2`)
- **Accent Color**: Orange (`#f59e0b`) for call-to-action buttons
- **Success Color**: Green (`#10b981`) for submit button
- **Text Colors**: Dark gray (`#1f2937`) for readability
- **Background**: Clean white with subtle shadows

## How to Use

### 1. Start the Server
```bash
npm install
node index.js
```

### 2. Access the Landing Page
Open your browser and navigate to:
```
http://localhost:5000
```

### 3. Test Form Submission
- Fill out the form with test data
- Submit the form
- Check the server console for logged form data
- Verify the success message appears

## File Structure

```
ride/
├── public/
│   └── index.html          # Landing page HTML file
├── index.js                # Express server (modified to serve static files)
├── sheets.js               # Google Sheets integration
├── package.json            # Dependencies
└── LANDING_PAGE_README.md  # This documentation
```

## Server Configuration

The Express server has been updated to:

1. **Serve Static Files**: Added `express.static('public')` middleware
2. **Root Route**: Added route to serve the landing page at `/`
3. **Webhook Endpoint**: Maintains the existing `/webhook` endpoint for form submissions

## Testing Mode

For testing purposes, the Google Sheets integration has been temporarily disabled. Form submissions are logged to the console instead of being sent to Google Sheets.

To re-enable Google Sheets integration:

1. Uncomment the Google Sheets import in `index.js`
2. Uncomment the Google Sheets functionality in the webhook endpoint
3. Set up the required environment variables in `.env`

## Environment Variables

To enable full functionality, you'll need these environment variables:

```env
PORT=5000
GOOGLE_SHEETS_ID=your_sheet_id
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
```

## Browser Compatibility

The landing page is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Fast Loading**: Optimized CSS and minimal JavaScript
- **SEO Friendly**: Proper meta tags and semantic HTML
- **Accessible**: ARIA labels and keyboard navigation support
- **Mobile Optimized**: Responsive design for all screen sizes

## Next Steps

1. **Customize Content**: Update the legal firm name, contact information, and messaging
2. **Add Analytics**: Integrate Google Analytics or other tracking tools
3. **Enable Google Sheets**: Set up environment variables and re-enable Google Sheets integration
4. **Add SSL**: Configure HTTPS for production deployment
5. **Domain Setup**: Point your domain to the server

## Support

For questions or issues with the landing page, please refer to the main project documentation or contact the development team.
