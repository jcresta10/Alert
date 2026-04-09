const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Request logger — see every hit in your terminal
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('  Body:', JSON.stringify(req.body));
  }
  next();
});

// Set up persistent SQLite DB
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    lat REAL,
    lng REAL,
    title TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    note TEXT
  )`);
});

// Set cooldown limit to 1 hour
const ONE_HOUR_MS = 60 * 60 * 1000;

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Inspector Alert Backend is running' });
});

app.get('/reports', (req, res) => {
  const oneHourAgo = new Date(Date.now() - ONE_HOUR_MS).toISOString();
  
  db.all('SELECT * FROM reports WHERE timestamp > ?', [oneHourAgo], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    console.log(`  Returning ${rows.length} active reports`);
    res.json(rows);
  });
  
  // Background cleanup of expired items
  db.run('DELETE FROM reports WHERE timestamp <= ?', [oneHourAgo]);
});

app.post('/reports', (req, res) => {
  const { type, lat, lng, title, note } = req.body;
  
  if (!type || lat === undefined || lng === undefined) {
    console.log('  REJECTED — missing fields:', { type, lat, lng });
    return res.status(400).json({ error: 'Missing required parameters: type, lat, lng' });
  }

  const timestamp = new Date().toISOString();
  
  db.run(
    'INSERT INTO reports (type, lat, lng, title, timestamp, note) VALUES (?, ?, ?, ?, ?, ?)',
    [type, lat, lng, title || type, timestamp, note || ''],
    function (err) {
      if (err) {
        console.log('  DB ERROR:', err.message);
        return res.status(500).json({ error: err.message });
      }
      const saved = { id: this.lastID.toString(), type, lat, lng, title, timestamp, note };
      console.log('  SAVED report #' + this.lastID);
      res.json(saved);
    }
  );
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`  Inspector Alert Backend`);
  console.log(`  Running on port ${PORT}`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://0.0.0.0:${PORT}`);
  console.log(`========================================\n`);
});
