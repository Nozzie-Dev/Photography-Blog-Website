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

app.get('/posts', async (req, res) => {
  const query = `
    SELECT 
      p.id AS post_id, p.title, p.author_id, p.image, p.content, p.publish_date, p.likes, 
      a.fullname AS author, 
      c.comment_author, c.content AS comment_content
    FROM Posts p
    LEFT JOIN Authors a ON p.author_id = a.author_id
    LEFT JOIN Comments c ON p.id = c.post_id
    ORDER BY p.id, c.id`;  

  try {
    const [results] = await db.promise().query(query);

    // Reformat results to group comments under each post
    const postsMap = {};

    results.forEach(row => {
      const postId = row.post_id;

      if (!postsMap[postId]) {
        // Initialize the post in the map
        postsMap[postId] = {
          id: postId,
          title: row.title,
          author_id: row.author_id,
          image: row.image,
          content: row.content,
          publish_date: row.publish_date,
          likes: row.likes,
          author: row.author,
          comments: []
        };
      }

      // If there is a comment, add it to the post's comments array
      if (row.comment_author && row.comment_content) {
        postsMap[postId].comments.push({
          comment_author: row.comment_author,
          content: row.comment_content
        });
      }
    });

    // Convert posts map back to an array
    const posts = Object.values(postsMap);

    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts and comments:', err);
    res.status(500).json({ error: 'Failed to fetch posts and comments' });
  }
});

// POST: Add new post
app.post('/posts', (req, res) => {
  const { title, author, image, content } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (!author) {
    return res.status(400).json({ error: 'Author is required' });
  }
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  // Check if the author exists, if not, add them to the table
  const authorQuery = 'SELECT author_id FROM Authors WHERE fullname = ?';
  db.query(authorQuery, [author], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    let authorId;
    if (results.length > 0) {
      // Author exists
      authorId = results[0].author_id;
    } else {
      // Insert new author
      const insertAuthorQuery = 'INSERT INTO Authors (fullname) VALUES (?)';
      db.query(insertAuthorQuery, [author], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        // Get the new author's ID
        authorId = result.insertId; 
        createPost(); 
      });
      // Pause to add author
      return; 
    }

    
    // Create the post after confirming author IDcreatePost(); 

    function createPost() {
      const query = `INSERT INTO Posts (title, author_id, image, content, publish_date, likes) 
                     VALUES (?, ?, ?, ?, NOW(), 0)`;

      db.query(query, [title, authorId, image || 'https://via.placeholder.com/150', content], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        const newPost = {
          id: result.insertId,
          title,
          author_id: authorId,
          image: image || 'https://via.placeholder.com/150',
          content,
          publish_date: new Date().toLocaleDateString(),
          likes: 0,
          comments: [],
        };
        res.status(201).json(newPost);
      });
    }
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
