const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const cors = require('cors');

const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


app.use(express.json());


app.use(express.urlencoded({ extended: true }));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',      
    database: 'tour' 
});

db.connect(err => {
    if (err) {
        console.error('DB connection failed:', err);
        return;
    }
    console.log('Connected to database');
});


app.post('/api/submit', (req, res) => {
    console.log('API hit!', req.body);
    const { name, email, phonenumber, address, remarks } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const query = 'INSERT INTO users (name, number,address,email,remarks) VALUES (?, ?,?,?,?)';
    db.query(query, [name, phonenumber, address, email,remarks], (err, result) => {
        if (err) {
            console.error('DB insert error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Form data saved successfully!', id: result.insertId });
    });
});

app.get('/api', (req, res) => {
    res.json("api run successfully");
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


