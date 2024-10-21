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

// GET: Read posts
app.get('/posts', (req, res) => {
  const query = 'SELECT * FROM Posts';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// POST: Add new post
app.post('/posts', (req, res) => {
  const { title, author_id, image, content } = req.body;

  if (!title || !author_id || !content) {
    return res.status(400).json({ error: 'Title, author, and content are required' });
  }

  const query = `INSERT INTO Posts (title, author_id, image, content, publish_date, likes) 
                 VALUES (?, ?, ?, ?, NOW(), 0)`;

  db.query(query, [title, author_id, image || 'https://via.placeholder.com/150', content], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const newPost = {
      id: result.insertId,
      title,
      author_id,
      image: image || 'https://via.placeholder.com/150',
      content,
      publish_date: new Date().toLocaleDateString(),
      likes: 0,
      comments: []
    };
    res.status(201).json(newPost);
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
