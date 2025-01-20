const express = require('express'); //forgive me, this is my first time using node.js
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to SQLite3 database
const db = new sqlite3.Database('leaderboard.db', (err) => {
    if (err) {
        console.error('database error', err);
    } else {
        console.log('Connected to database. YIPEEE');
    }
});

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS players (
    name TEXT,
    score INTEGER
)`);

// Submit score endpoint
app.post('/submit-score', (req, res) => {
    const { name, score } = req.body;
    db.run(`INSERT INTO players (name, score) VALUES (?, ?)`, [name, score], function(err) {
        if (err) {
            return res.status(500).send('submission error');
        }
        res.send('submitted');
    });
});

// Get leaderboard endpoint
app.get('/leaderboard', (req, res) => {
    db.all("SELECT * FROM players ORDER BY score DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).send('retrieval error');
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(` running at http://localhost:${port}`);
});