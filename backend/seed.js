const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite');

const mockPins = [
  { type: 'delay', lat: -33.8688, lng: 151.2093, title: 'Train Delay', note: 'Multiple trains delayed on T1 line' },
  { type: 'crowding', lat: -33.8700, lng: 151.2100, title: 'Busy Platform', note: 'Very crowded at platforms 16 & 17' },
  { type: 'disruption', lat: -33.8750, lng: 151.2050, title: 'Trackwork', note: 'Buses replacing trains' },
  { type: 'inspection', lat: -33.8650, lng: 151.2050, title: 'Inspection Activity', note: 'Ticket inspectors seen near gates' },
];

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
  
  // Clean slate
  db.run(`DELETE FROM reports`);

  const stmt = db.prepare('INSERT INTO reports (type, lat, lng, title, timestamp, note) VALUES (?, ?, ?, ?, ?, ?)');
  
  // Use a timestamp 5 minutes ago so they are valid within the 1-hour expiration limit
  const baseTime = Date.now() - (5 * 60 * 1000); 

  for (let i = 0; i < mockPins.length; i++) {
    const pin = mockPins[i];
    // Stagger the times slightly
    const timestamp = new Date(baseTime + (i * 60000)).toISOString(); 
    stmt.run([pin.type, pin.lat, pin.lng, pin.title, timestamp, pin.note]);
  }

  stmt.finalize(() => {
    console.log('✅ Database successfully seeded with dummy reports!');
    db.close();
  });
});
