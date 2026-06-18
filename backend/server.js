const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { initBlockchain } = require('./blockchain/polygon');

dotenv.config();

const app = express();
connectDB();
initBlockchain();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/institutions', require('./routes/institutions'));
app.use('/api/verify',       require('./routes/verify'));

app.get('/', (req, res) => res.json({ status: 'EduChain API v3.0', blockchain: 'Polygon Amoy' }));
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: err.message }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 EduChain Server on port ${PORT}`));
