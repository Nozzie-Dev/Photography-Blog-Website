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
  
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
