const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Add CORS headers to all responses
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Connect to SQLite database
const db = new sqlite3.Database('leaderboard.db', (err) => {
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
)`);

// Submit score endpoint
app.post('/submit-score', (req, res) => {
    const { name, score } = req.body;
    db.run(`INSERT INTO players (name, score) VALUES (?, ?)`, [name, score], function(err) {
        if (err) {
            return res.status(500).send('Error submitting score');
        }
        res.send('Score submitted!');
    });
});

// Get leaderboard endpoint
app.get('/leaderboard', (req, res) => {
    db.all("SELECT * FROM players ORDER BY score DESC", [], (err, rows) => {
        if (err) {
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
