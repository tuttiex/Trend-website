const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database 1: Agent's SQLite (read-only for tokens)
const AGENT_DB_PATH = process.env.DATABASE_PATH || '/home/ubuntu/trends-agent/database.sqlite';
const agentDb = new sqlite3.Database(AGENT_DB_PATH, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error('Error connecting to agent database:', err.message);
    } else {
        console.log('Connected to agent database:', AGENT_DB_PATH);
    }
});

// Database 2: Website's own SQLite (read-write for users, cache, history)
const WEBSITE_DB_PATH = process.env.WEBSITE_DATABASE_PATH || './website.db';
const websiteDb = new sqlite3.Database(WEBSITE_DB_PATH, (err) => {
    if (err) {
        console.error('Error connecting to website database:', err.message);
    } else {
        console.log('Connected to website database:', WEBSITE_DB_PATH);
        initWebsiteDatabase();
    }
});

// Initialize website database tables
function initWebsiteDatabase() {
    websiteDb.serialize(() => {
        // Token cache table (populated via webhook from agent)
        websiteDb.run(`CREATE TABLE IF NOT EXISTS cached_tokens (
            token_address TEXT PRIMARY KEY,
            token_symbol TEXT,
            token_name TEXT,
            topic TEXT,
            region TEXT,
            metadata_cid TEXT,
            logo_uri TEXT,
            pool_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Users table
        websiteDb.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            wallet_address TEXT UNIQUE,
            email TEXT,
            username TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME
        )`);

        // User favorites/watched tokens
        websiteDb.run(`CREATE TABLE IF NOT EXISTS user_favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            token_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE(user_id, token_address)
        )`);

        // User trade history (if you add trading)
        websiteDb.run(`CREATE TABLE IF NOT EXISTS user_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            action TEXT,
            token_address TEXT,
            details TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // Webhook log (for debugging)
        websiteDb.run(`CREATE TABLE IF NOT EXISTS webhook_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT,
            payload TEXT,
            received_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    });
    console.log('Website database tables initialized');
}

// Helper functions for agent DB (read-only)
function agentDbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        agentDb.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function agentDbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        agentDb.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// Helper functions for website DB (read-write)
function websiteDbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        websiteDb.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

function websiteDbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        websiteDb.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function websiteDbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        websiteDb.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// --- ROUTES ---

// 1. Public API - Get all tokens (Served to Frontend)
// Returns merged data: cached tokens + agent tokens (fallback)
app.get('/api/public/tokens', async (req, res) => {
    try {
        // Try cached tokens first
        const cachedRows = await websiteDbAll(`
            SELECT 
                token_address,
                token_symbol as symbol,
                topic,
                region,
                metadata_cid,
                logo_uri as image_cid,
                pool_address,
                created_at as timestamp
            FROM cached_tokens 
            ORDER BY created_at DESC
        `);
        
        if (cachedRows.length > 0) {
            return res.json({ success: true, data: cachedRows, source: 'cache' });
        }
        
        // Fallback to agent database
        const rows = await agentDbAll(`
            SELECT 
                token_address,
                token_symbol as symbol,
                trend_topic as topic,
                region,
                metadata_cid,
                logo_uri as image_cid,
                pool_address,
                timestamp
            FROM deployments 
            WHERE token_address IS NOT NULL 
            ORDER BY timestamp DESC
        `);
        res.json({ success: true, data: rows, source: 'agent' });
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// 2. Get single token details
app.get('/api/public/tokens/:address', async (req, res) => {
    try {
        const { address } = req.params;
        
        // Try cache first
        const cachedRow = await websiteDbGet(`
            SELECT 
                token_address,
                token_symbol as symbol,
                topic,
                region,
                metadata_cid,
                logo_uri as image_cid,
                pool_address,
                created_at as timestamp
            FROM cached_tokens 
            WHERE token_address = ?
        `, [address]);
        
        if (cachedRow) {
            return res.json({ success: true, data: cachedRow, source: 'cache' });
        }
        
        // Fallback to agent database
        const row = await agentDbGet(`
            SELECT 
                token_address,
                token_symbol as symbol,
                trend_topic as topic,
                region,
                metadata_cid,
                logo_uri as image_cid,
                pool_address,
                timestamp
            FROM deployments 
            WHERE token_address = ?
        `, [address]);
        
        if (!row) {
            return res.status(404).json({ error: 'Token not found' });
        }
        
        res.json({ success: true, data: row, source: 'agent' });
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// 3. Webhook - Receive token deployments from Agent
app.post('/api/deployments', async (req, res) => {
    try {
        const source = req.header('X-Source');
        const webhookSecret = process.env.WEBHOOK_SECRET;
        
        // Validate secret if configured
        if (webhookSecret && source !== webhookSecret) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { tokenAddress, symbol, topic, region, metadataCid, imageCid, poolAddress } = req.body.data || req.body;

        if (!tokenAddress || !symbol || !topic) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Log webhook
        await websiteDbRun(
            'INSERT INTO webhook_logs (event_type, payload) VALUES (?, ?)',
            ['TOKEN_DEPLOYED', JSON.stringify(req.body)]
        );

        // Insert or update cached token
        await websiteDbRun(`
            INSERT INTO cached_tokens 
            (token_address, token_symbol, topic, region, metadata_cid, logo_uri, pool_address, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
            ON CONFLICT(token_address) DO UPDATE SET
                token_symbol = excluded.token_symbol,
                topic = excluded.topic,
                region = excluded.region,
                metadata_cid = excluded.metadata_cid,
                logo_uri = excluded.logo_uri,
                pool_address = excluded.pool_address,
                updated_at = datetime('now')
        `, [tokenAddress, symbol, topic, region || null, metadataCid || null, imageCid || null, poolAddress || null]);

        console.log(`Cached token: ${symbol} (${tokenAddress})`);
        res.json({ success: true, message: 'Token cached' });
    } catch (err) {
        console.error('Webhook Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// 4. Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        agentDatabase: AGENT_DB_PATH,
        websiteDatabase: WEBSITE_DB_PATH 
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Website API running on port ${PORT}`);
    console.log(`Agent DB: ${AGENT_DB_PATH}`);
    console.log(`Website DB: ${WEBSITE_DB_PATH}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    agentDb.close((err) => {
        if (err) console.error('Agent DB close error:', err.message);
        websiteDb.close((err) => {
            if (err) console.error('Website DB close error:', err.message);
            console.log('Database connections closed');
            process.exit(0);
        });
    });
});
