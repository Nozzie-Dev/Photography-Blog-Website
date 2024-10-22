
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './components/landing';
import BlogView from './components/blogs';
import NewPost from './components/new-post';
import CRUDAuth from './components/CRUDAuth';
import { FaLock } from 'react-icons/fa'; //

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/posts')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleHeaderClick = () => {
    setModalOpen(true); // Open the login modal
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header bg-gradient-to-r from-purple-500 to-pink-500 p-6">
          <nav>
            <ul className="flex justify-between items-center space-x-6">
              <li>
                <Link to="/" className="text-white hover:text-gray-300">Home</Link>
              </li>
              <li>
                <Link to="/blog" className="text-white hover:text-gray-300">Blog</Link>
              </li>
              <li>
                <Link to="/new-post" className="text-white hover:text-gray-300">Add New Post</Link>
              </li>
            </ul>
          </nav>
          <h1
            onClick={handleHeaderClick}
            className="text-white text-4xl font-bold mt-4 flex items-center cursor-pointer"
          >
            {user ? (
              <>
                <span className="ml-2"><FaLock /></span> Onthatile The Photographer's Blog
              </>
            ) : (
              'Onthatile The Photographer\'s Blog'
            )}
          </h1>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/blog"
              element={
                posts && posts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
                    {posts.map((post, index) => (
                      <BlogView key={index} post={post} />
                    ))}
                  </div>
                ) : (
                  <p>No blog posts available.</p>
                )
              }
            />
            <Route path="/new-post" element={<NewPost />} />
          </Routes>
        </main>

        {/* Login */}
        <CRUDAuth isOpen={modalOpen} onClose={() => setModalOpen(false)} onLogin={handleLogin} />
      </div>
    </Router>
  );
}

export default App;
