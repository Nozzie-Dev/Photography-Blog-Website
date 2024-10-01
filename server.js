const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;
const postsFilePath = path.join(__dirname, 'posts.json');

// Middleware
app.use(cors());
app.use(express.json());

// Read posts from the JSON file
function getPosts() {
    try {
      if (fs.existsSync(postsFilePath)) {
        const data = fs.readFileSync(postsFilePath, 'utf8');
        return JSON.parse(data);
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error reading posts file:', error);
      return [];
    }
  }
  
  //Write posts to the JSON file
  function savePosts(posts) {
    try {
      fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf8');
      console.log('Posts saved successfully.'); // Log when posts are saved
    } catch (error) {
      console.error('Error writing to posts file:', error);
    }
  }
  
  // Routes
  app.get('/posts', (req, res) => {
    const posts = getPosts();
    res.json(posts);
  });
  
  app.post('/posts', (req, res) => {
    const { title, author, image, content } = req.body;
    if (!title || !author || !content) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    const posts = getPosts();
  
    const newPost = {
      id: posts.length + 1,
      title,
      author,
      image: image || 'https://via.placeholder.com/150',
      content,
      publishDate: new Date().toLocaleDateString(),
      likes: 0,
      comments: []
    };
  
    posts.push(newPost);
    savePosts(posts);
  
    res.status(201).json(newPost);
  });
  
  // Route to handle post likes
  app.post('/posts/:id/like', (req, res) => {
    const postId = parseInt(req.params.id);
    const posts = getPosts();
  
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      savePosts(posts);
      res.status(200).json({ likes: post.likes });
    } else {
      console.error(`Post not found for ID: ${postId}`); 
      res.status(404).json({ error: 'Post not found' });
    }
  });
   
  // Route to add a comment to a post
  app.post('/posts/:id/comment', (req, res) => {
    const postId = parseInt(req.params.id);
    const { author, content } = req.body;
  
    if (!author || !content) {
      return res.status(400).json({ error: 'Author and content are required' });
    }
  
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
  
    if (post) {
      const newComment = { author, content };
      post.comments.push(newComment);
      savePosts(posts);
      res.status(201).json(newComment);
    } else {
      console.error(`Post not found for ID: ${postId}`); 
      res.status(404).json({ error: 'Post not found' });
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
