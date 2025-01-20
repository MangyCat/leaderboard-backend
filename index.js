const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Ensure the database directory exists
const dbPath = path.join(__dirname, 'leaderboard.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Middleware
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database.', err);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS players (
    name TEXT,
    score INTEGER
)`, (err) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Table created or already exists.');
    }
});

// Submit score endpoint
app.post('/submit-score', (req, res) => {
    const { name, score } = req.body;
    console.log('Submitting score:', { name, score }); // Log the submitted data
    db.run(`INSERT INTO players (name, score) VALUES (?, ?)`, [name, score], function(err) {
        if (err) {
            console.error('Error submitting score:', err);
            return res.status(500).send('Error submitting score');
        }
        res.send('Score submitted!');
    });
});

// Get leaderboard endpoint
app.get('/leaderboard', (req, res) => {
    console.log('Fetching leaderboard...'); // Log when fetching the leaderboard
    db.all("SELECT * FROM players ORDER BY score DESC", [], (err, rows) => {
        if (err) {
            console.error('Error retrieving leaderboard:', err);
            return res.status(500).send('Error retrieving leaderboard');
        }
        res.json(rows);
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Leaderboard API! Try accessing /submit-score or /leaderboard.');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
