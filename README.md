# EduChain – Blockchain-Based Digital Certificate Verification System

## Overview

EduChain is a blockchain-inspired digital certificate management and verification platform that enables educational institutions to issue tamper-proof digital certificates. The system uses SHA-256 hashing, simulated IPFS storage, simulated Polygon blockchain transactions, MongoDB Atlas, and the MERN stack to ensure certificate authenticity and prevent fraud.

Traditional paper certificates can be forged, altered, or lost. EduChain solves this problem by creating a unique cryptographic fingerprint (hash) for every certificate and providing instant verification through QR codes.

---

## Problem Statement

Educational institutions issue thousands of certificates every year. Employers often struggle to verify whether a certificate is genuine.

### Common Issues

- Fake certificates
- Modified certificates
- Time-consuming manual verification
- Lack of centralized verification systems
- No audit trail for certificate activities

EduChain provides a secure and transparent solution.

---

## Key Features

### Institution Features

- Register and login securely
- Issue digital certificates
- Generate certificate hashes
- Generate QR codes
- Revoke certificates
- View issued certificates
- Dashboard analytics

### Student Features

- Access issued certificates
- Share certificates with employers
- Verify certificate authenticity

### Employer Features

- Verify certificates instantly
- Scan QR codes
- View certificate status
- Detect tampered certificates

### Security Features

- SHA-256 cryptographic hashing
- JWT Authentication
- Role-based authorization
- Audit logging
- Tamper detection
- Blockchain transaction simulation

---

## Technology Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Context API

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt.js

### Blockchain & Security

- SHA-256 Hashing
- Simulated IPFS Storage
- Simulated Polygon Blockchain
- QR Code Verification

---

## System Architecture

```text
Institution
     │
     ▼
Issue Certificate
     │
     ▼
Generate SHA-256 Hash
     │
     ▼
Store Certificate Metadata
     │
     ▼
Generate IPFS CID (Simulated)
     │
     ▼
Generate Blockchain TX Hash (Simulated)
     │
     ▼
Save to MongoDB Atlas
     │
     ▼
Generate QR Code
     │
     ▼
Certificate Issued
```

### Verification Flow

```text
Employer Scans QR
        │
        ▼
Retrieve Certificate
        │
        ▼
Recompute SHA-256 Hash
        │
        ▼
Compare With Stored Hash
        │
        ├── Match
        │      ▼
        │   VERIFIED
        │
        └── Mismatch
               ▼
           TAMPERED
```

---

## Project Structure

```text
educhain/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Institution.js
│   │   ├── Certificate.js
│   │   └── ActivityLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── certificates.js
│   │   ├── institutions.js
│   │   └── verify.js
│   ├── uploads/
│   ├── .env
│   └── server.js
│
└── frontend/
    └── src/
        ├── pages/
        ├── components/
        ├── context/
        └── utils/
```

---

## Database Design

### Users Collection

```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "role": "institution"
}
```

### Institutions Collection

```json
{
  "_id": "...",
  "institutionName": "PVPSIT",
  "certificatesIssued": 120
}
```

### Certificates Collection

```json
{
  "_id": "...",
  "studentName": "Anosh",
  "course": "AI & ML",
  "certificateHash": "SHA256_HASH",
  "ipfsCid": "CID12345",
  "blockchainTx": "TX12345",
  "status": "active"
}
```

### Activity Logs Collection

```json
{
  "_id": "...",
  "action": "CERTIFICATE_ISSUED",
  "timestamp": "2026-06-24"
}
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|----------|----------|----------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |
| GET | /api/auth/me | Current User |

### Certificate Management

| Method | Endpoint | Description |
|----------|----------|----------|
| POST | /api/certificates/issue | Issue Certificate |
| GET | /api/certificates | Get Certificates |
| PUT | /api/certificates/:id/revoke | Revoke Certificate |
| GET | /api/certificates/stats/dashboard | Dashboard Stats |

### Verification

| Method | Endpoint | Description |
|----------|----------|----------|
| GET | /api/verify/:certId | Verify Certificate |

---

## Certificate Generation Process

When a certificate is issued:

1. Institution enters certificate details.
2. Backend creates a SHA-256 hash from certificate data.
3. Simulated IPFS CID is generated.
4. Simulated Polygon transaction hash is generated.
5. Certificate data is stored in MongoDB Atlas.
6. QR code is generated.
7. Certificate becomes publicly verifiable.

### Example

```javascript
certificateHash =
SHA256(studentName + course + issueDate)
```

---

## Security Implementation

### Password Security

```text
bcrypt password hashing
```

### Authentication

```text
JWT Tokens
```

### Authorization

```text
Role Based Access Control
```

Roles:

- Institution
- Student
- Employer

### Tamper Detection

```text
Stored Hash
      ==
Recomputed Hash
```

If hashes match:

```text
Certificate Verified
```

Otherwise:

```text
Certificate Tampered
```

---

## Setup & Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/educhain.git
cd educhain
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Runs on:

```text
http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```text
http://localhost:3000
```

---

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

---

## Deployment

### Backend

- Render

### Frontend

- Vercel

### Database

- MongoDB Atlas

### Production Environment Variable

```env
VITE_API_URL=https://your-render-app.onrender.com
```

---

## Future Enhancements

- Real Polygon Blockchain Integration
- Real IPFS Storage
- Smart Contracts
- Multi-University Support
- Email Certificate Delivery
- Certificate PDF Generation
- AI-Based Fraud Detection
- Mobile Application
- NFT-Based Certificates
- Decentralized Identity (DID)

---

## Team

**EduChain Development Team**

Built using the MERN Stack, Blockchain Concepts, MongoDB Atlas, SHA-256 Cryptography, and QR-Based Verification to create a secure and transparent digital certificate ecosystem.

---

## License

This project is developed for educational, academic, and hackathon purposes. Feel free to use and modify it for learning and research.
