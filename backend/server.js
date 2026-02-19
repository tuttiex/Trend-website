const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize DB Schema
async function initDB() {
    try {
        const client = await pool.connect();
        await client.query(`
      CREATE TABLE IF NOT EXISTS tokens (
        token_address TEXT PRIMARY KEY,
        symbol TEXT NOT NULL,
        topic TEXT NOT NULL,
        image_cid TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        client.release();
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

initDB();

// --- ROUTES ---

// 1. Webhook Listener (Received from Agent)
app.post('/api/deployments', async (req, res) => {
    try {
        const source = req.header('X-Source');
        if (source !== process.env.WEBHOOK_SECRET) { // Simple secret check
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { tokenAddress, symbol, topic, imageCid } = req.body.data || req.body;

        if (!tokenAddress || !symbol || !topic || !imageCid) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const query = `
      INSERT INTO tokens (token_address, symbol, topic, image_cid)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (token_address) DO UPDATE SET
        symbol = EXCLUDED.symbol,
        topic = EXCLUDED.topic,
        image_cid = EXCLUDED.image_cid
    `;
        const values = [tokenAddress, symbol, topic, imageCid];
        await pool.query(query, values);

        console.log(`Saved token: ${symbol} (${tokenAddress})`);
        res.json({ success: true, message: 'Token saved' });
    } catch (err) {
        console.error('Webhook Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// 2. Public API (Served to Frontend)
app.get('/api/public/tokens', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tokens ORDER BY timestamp DESC');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});
