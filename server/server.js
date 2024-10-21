const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

// middleware
const app = express();
app.use(cors());
app.use(express.json()); 

// connect to db
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.log('Database connection failed:', err.message);
  } else {
    console.log('Connected to MySQL database');
  }
});

// API routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
