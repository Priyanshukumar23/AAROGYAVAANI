require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const api = require('./src/routes/api');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medikiosk';
mongoose.connect(MONGO).then(
  () => console.log('[MediKiosk] MongoDB connected'),
  (e) => console.log('[MediKiosk] MongoDB unavailable, using in-memory store:', e.message)
);

app.get('/api/health', (req, res) => res.json({
  ok: true, service: 'MediKiosk API', time: new Date().toISOString(),
  mongo: mongoose.connection.readyState === 1 ? 'connected' : 'memory-fallback'
}));
app.use('/api', api);

app.get('/', (req, res) => res.send('MediKiosk Backend API — see /api/health'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[MediKiosk] API listening on http://localhost:${PORT}`));
