const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

// Middleware
const app = express();
app.use(cors());
app.use(express.json()); 

// Connect to DB
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

// API Routes

// GET: Read all posts
app.get('/posts', (req, res) => {
  const query = `
    SELECT p.id, p.title, p.author_id, p.image, p.content, p.publish_date, p.likes, a.fullname AS author
    FROM Posts p
    LEFT JOIN Authors a ON p.author_id = a.author_id`;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET: Read a single post by ID
app.get('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);

  const query = `
    SELECT p.id, p.title, p.author_id, p.image, p.content, p.publish_date, p.likes, a.fullname AS author
    FROM Posts p
    LEFT JOIN Authors a ON p.author_id = a.author_id
    WHERE p.id = ?`;

  db.query(query, [postId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Fetch comments for this post
    const commentsQuery = 'SELECT * FROM Comments WHERE post_id = ?';
    db.query(commentsQuery, [postId], (err, comments) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      results[0].comments = comments;
      res.json(results[0]);
    });
  });
});

// POST: Add a new post
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
      comments: [],
    };
    res.status(201).json(newPost);
  });
});

// POST: Like a post
app.post('/posts/:id/like', (req, res) => {
  const postId = parseInt(req.params.id);

  const findQuery = 'SELECT * FROM Posts WHERE id = ?';
  db.query(findQuery, [postId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const updateQuery = 'UPDATE Posts SET likes = likes + 1 WHERE id = ?';
    db.query(updateQuery, [postId], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ likes: results[0].likes + 1 });
    });
  });
});

// POST: Add a comment
app.post('/posts/:id/comment', (req, res) => {
  const postId = parseInt(req.params.id);
  const { author, content } = req.body;

  if (!author || !content) {
    return res.status(400).json({ error: 'Author and content are required' });
  }

  const findPostQuery = 'SELECT * FROM Posts WHERE id = ?';
  db.query(findPostQuery, [postId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const addCommentQuery = 'INSERT INTO Comments (post_id, comment_author, content) VALUES (?, ?, ?)';
    db.query(addCommentQuery, [postId, author, content], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const newComment = {
        id: result.insertId,
        post_id: postId,
        comment_author: author,
        content,
      };
      res.status(201).json(newComment);
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
