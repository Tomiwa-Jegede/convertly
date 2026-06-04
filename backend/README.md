# Convertly Backend

Production-ready Node.js + Express backend for the Convertly digital agency platform.

Handles Flutterwave payments, webhook verification, Google Sheets logging, secure onboarding tokens, and transactional email.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [API Endpoints](#api-endpoints)
3. [Setup: Flutterwave](#1-flutterwave-setup)
4. [Setup: Google Sheets API](#2-google-sheets-api-setup)
5. [Setup: Gmail App Password](#3-gmail-app-password-setup)
6. [Local Development](#local-development)
7. [Railway Deployment](#4-railway-deployment)
8. [Webhook Configuration](#5-webhook-configuration)
9. [Environment Variables](#6-environment-variables-reference)
10. [Google Sheet Structure](#google-sheet-structure)

---

## Project Structure

```
server/
├── server.js                   # Express app entry point
├── routes/
│   ├── payment.js              # POST /api/create-payment-link, POST /api/flutterwave/webhook
│   └── onboarding.js           # GET /api/onboarding/verify, POST /api/onboarding/submit
├── controllers/
│   ├── paymentController.js    # Payment link creation + webhook handler
│   └── onboardingController.js # Token verification + form submission
├── services/
│   ├── flutterwaveService.js   # Flutterwave API calls
│   ├── emailService.js         # Nodemailer (Gmail) transactional email
│   └── sheetsService.js        # Google Sheets append functions
├── middleware/
│   └── verifyToken.js          # Reusable token validation middleware
├── utils/
│   ├── generateToken.js        # crypto.randomBytes onboarding token generator
│   └── jsonStore.js            # Atomic JSON file read/write utility
├── data/
│   ├── customers.json          # Local customer + onboarding records
│   └── processedEvents.json    # Processed Flutterwave transaction IDs (dedup)
├── .env.example
├── package.json
└── README.md
```

---

## API Endpoints

### `POST /api/create-payment-link`

Creates a Flutterwave Checkout payment link.

**Request body:**
```json
{
  "productName": "Conversion Websites for Listings",
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com"
}
```

**Response:**
```json
{
  "paymentLink": "https://checkout.flutterwave.com/v3/hosted/pay/..."
}
```

---

### `POST /api/flutterwave/webhook`

Receives Flutterwave `charge.completed` webhook events.

- Verifies the `verif-hash` header against `FLW_WEBHOOK_HASH`
- Prevents duplicate processing
- Verifies the transaction directly with Flutterwave
- Saves customer record to `data/customers.json`
- Appends purchase row to Google Sheets (Purchases tab)
- Sends onboarding email with a secure token link

---

### `GET /api/onboarding/verify?token=<token>`

Checks whether an onboarding token is valid and belongs to a paying customer.

**Response:**
```json
{ "valid": true }
```
or
```json
{ "valid": false }
```

---

### `POST /api/onboarding/submit`

Submits the onboarding form. Token must be valid, belong to a paying customer, and not have been submitted before.

**Request body:**
```json
{
  "token": "abc123...",
  "fullName": "Jane Smith",
  "businessName": "Smith Realty",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "goals": "Generate more leads online",
  "currentProblems": "Low website conversion",
  "additionalNotes": "We focus on luxury listings"
}
```

**Response:**
```json
{ "success": true }
```

---

## 1. Flutterwave Setup

1. Sign up at [https://dashboard.flutterwave.com](https://dashboard.flutterwave.com)
2. Go to **Settings → API Keys**
3. Copy your **Public Key**, **Secret Key**, and **Encryption Key**
4. Paste them into your `.env` file:

```
FLW_PUBLIC_KEY=FLWPUBK-...
FLW_SECRET_KEY=FLWSECK-...
FLW_ENCRYPTION_KEY=...
```

5. Choose a strong, random string for `FLW_WEBHOOK_HASH` — you'll paste the same value in the Flutterwave webhook settings (see [Webhook Configuration](#5-webhook-configuration)).

> **Testing vs Live:** Use Test keys during development. Switch to Live keys before going to production.

---

## 2. Google Sheets API Setup

### Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet named **Convertly CRM** (or any name).
2. Create two tabs named exactly:
   - `Purchases`
   - `Onboarding`
3. Add headers to each tab:

**Purchases (Row 1):**
```
Timestamp | Payment Status | Transaction ID | Transaction Reference | Customer Name | Customer Email | Product Purchased | Amount
```

**Onboarding (Row 1):**
```
Timestamp | Customer Name | Customer Email | Phone | Business Name | Goals | Current Problems | Additional Notes
```

4. Copy the **Sheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit`

### Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Enable **Google Sheets API**: APIs & Services → Enable APIs → search "Google Sheets API" → Enable
4. Go to **APIs & Services → Credentials → Create Credentials → Service Account**
5. Give it any name, click **Create and Continue**, skip roles, click **Done**
6. Click the new service account → **Keys** tab → **Add Key → Create New Key → JSON** → Download
7. Open the downloaded JSON file. Copy:
   - `client_email` → `GOOGLE_CLIENT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY` (paste the entire key including `-----BEGIN...-----END-----`)
8. **Share your Google Sheet** with the `client_email` address (give it Editor access)

---

## 3. Gmail App Password Setup

> Regular Gmail passwords won't work. You need an **App Password**.

1. Go to your Google Account → **Security**
2. Enable **2-Step Verification** (required for App Passwords)
3. Go to **Security → App Passwords**
4. Select App: **Mail**, Device: **Other** → type "Convertly"
5. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
6. Set in `.env`:
```
GMAIL_USER=your@gmail.com
GMAIL_PASS=xxxx xxxx xxxx xxxx
```

---

## Local Development

```bash
# 1. Install dependencies
cd server
npm install

# 2. Copy .env.example and fill in your values
cp .env.example .env

# 3. Start in dev mode (with auto-restart)
npm run dev

# 4. Test the health endpoint
curl http://localhost:5000/health
```

To test webhooks locally, use [ngrok](https://ngrok.com):
```bash
ngrok http 5000
# Use the generated HTTPS URL as your Flutterwave webhook URL
```

---

## 4. Railway Deployment

Railway is a modern hosting platform ideal for Node.js APIs.

### Steps

1. Push your `server/` folder to a GitHub repository.

2. Go to [https://railway.app](https://railway.app) → **New Project → Deploy from GitHub repo**

3. Select your repository.

4. Railway auto-detects Node.js. No special config needed.

5. Set all environment variables in **Railway → Your Service → Variables**:

   Copy every key from `.env.example` and fill in your production values.

6. Railway will give you a public domain like:
   `https://convertly-backend-production.up.railway.app`

7. Set this as your `BACKEND_URL` in your Netlify frontend environment variables.

> **Persistent Storage Note:** `data/customers.json` and `data/processedEvents.json` are stored on the Railway container filesystem. These persist between deploys unless you delete the service. For a more robust setup, consider migrating to PostgreSQL (Railway offers a free Postgres add-on).

---

## 5. Webhook Configuration

1. Log in to Flutterwave Dashboard → **Settings → Webhooks**
2. Set **Webhook URL** to:
   ```
   https://your-railway-domain.up.railway.app/api/flutterwave/webhook
   ```
3. Set **Secret Hash** to the same value as your `FLW_WEBHOOK_HASH` in `.env`
4. Enable the `charge.completed` event
5. Save and use the **Test Webhook** button to verify the connection

---

## 6. Environment Variables Reference

| Variable | Description |
|---|---|
| `PORT` | Server port (Railway sets this automatically) |
| `FRONTEND_URL` | Your Netlify frontend URL (no trailing slash) |
| `FLW_PUBLIC_KEY` | Flutterwave Public Key |
| `FLW_SECRET_KEY` | Flutterwave Secret Key |
| `FLW_ENCRYPTION_KEY` | Flutterwave Encryption Key |
| `FLW_WEBHOOK_HASH` | Custom secret hash for webhook verification |
| `GMAIL_USER` | Gmail address for sending emails |
| `GMAIL_PASS` | Gmail App Password (16-char) |
| `GOOGLE_SHEET_ID` | Google Sheet ID from the URL |
| `GOOGLE_CLIENT_EMAIL` | Service account email from JSON key file |
| `GOOGLE_PRIVATE_KEY` | Service account private key (full PEM string) |

---

## Google Sheet Structure

### Purchases Tab

| Column | Description |
|---|---|
| Timestamp | ISO 8601 datetime of webhook processing |
| Payment Status | `successful` |
| Transaction ID | Flutterwave transaction ID |
| Transaction Reference | Your `tx_ref` (format: `CONV-<product-slug>-<uuid>`) |
| Customer Name | Customer's full name |
| Customer Email | Customer's email |
| Product Purchased | Product name |
| Amount | Payment amount (USD) |

### Onboarding Tab

| Column | Description |
|---|---|
| Timestamp | ISO 8601 datetime of form submission |
| Customer Name | Full name from onboarding form |
| Customer Email | Email from onboarding form |
| Phone | Phone number |
| Business Name | Business name |
| Goals | Customer's stated goals |
| Current Problems | Pain points |
| Additional Notes | Any other notes |

---

## Security Notes

- Webhook signature is verified on every request via `verif-hash` header
- All transactions are re-verified directly against the Flutterwave API before fulfillment
- Duplicate webhook events are ignored using a persistent processed-IDs list
- Onboarding tokens are 96-character hex strings generated via `crypto.randomBytes`
- Duplicate onboarding submissions are rejected with HTTP 409
- All user input is sanitised (HTML special characters stripped)
- Rate limiting: 100 req/15min globally, 20 req/15min on payment routes
- `helmet` sets secure HTTP response headers
- JSON body size is capped at 10kb

---

## Products & Pricing

| Product | Price (USD) |
|---|---|
| Conversion Websites for Listings | $399.99 |
| AI Customer Response Bots | $399.99 |
| Booking System Integration | $199.99 |
| Lead Tracking Dashboards | $299.99 |
| Social Media Lead Automation | $299.99 |
| Data & Inquiry Management | $199.99 |
| Full Bundle Package | $1,499.99 |