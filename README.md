# EduChain – Verifiable Digital Certificates

Blockchain-based certificate platform using SHA-256 hashing, IPFS (simulated), Polygon (simulated), MongoDB Atlas, and a MERN stack.

## Project Structure

```
educhain/
├── backend/          ← Node.js + Express + MongoDB
│   ├── config/db.js  ← MongoDB Atlas connection
│   ├── models/       ← User, Certificate, Institution, ActivityLog
│   ├── routes/       ← auth, certificates, institutions, verify
│   ├── middleware/   ← JWT auth
│   ├── uploads/      ← Uploaded certificate files
│   ├── .env          ← Environment variables (MongoDB URI, JWT)
│   └── server.js     ← Entry point
│
└── frontend/         ← React 18 + Vite + Tailwind CSS
    └── src/
        ├── pages/    ← Landing, Login, Register, Dashboard, Issue, Verify
        ├── components/← Layout with sidebar
        ├── context/  ← Auth context
        └── utils/    ← Axios instance
```

## Setup & Run

### Backend
```bash
cd backend
npm install
# .env already configured with your MongoDB Atlas URI
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | JWT | Current user |
| POST | /api/certificates/issue | Institution | Issue certificate |
| GET | /api/certificates | JWT | List certificates |
| GET | /api/certificates/stats/dashboard | JWT | Stats |
| PUT | /api/certificates/:id/revoke | Institution | Revoke |
| GET | /api/verify/:certId | Public | Verify certificate |

## MongoDB Collections

- **users** – login accounts (institution / student / employer)
- **institutions** – institution details & cert count
- **certificates** – all cert records with SHA-256 hash, IPFS CID, blockchain TX
- **activitylogs** – audit trail of issue/verify/revoke events

## How Certificate Verification Works

1. Institution fills form → backend generates `SHA-256(certData)`
2. Hash + metadata stored in MongoDB + simulated blockchain TX
3. QR code generated pointing to `/verify/:certId`
4. Employer scans QR → backend recomputes hash → compares with stored hash
5. If `computedHash === storedHash` → ✅ Verified. Any difference → ❌ Tampered.

## Deployment

- **Backend** → Render.com (set env vars from .env)
- **Frontend** → Vercel (set `VITE_API_URL` to your Render URL)
- **Database** → MongoDB Atlas (already configured)
