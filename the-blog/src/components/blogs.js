import React, { useState } from 'react';
import { FaThumbsUp, FaComment } from 'react-icons/fa';

const BlogView = ({ post }) => {
  // Provide default values if post properties are undefined
  const [likes, setLikes] = useState(post?.likes || 0);
  const [comments, setComments] = useState(post?.comments || []);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  // Handle liking the post
  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:5000/posts/${post.id}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to like post');
      }

      const data = await response.json();
      setLikes(data.likes);
    } catch (error) {
      console.error('Error liking the post:', error);
      alert('Something went wrong while liking the post.');
    }
  };

  // Handle submitting a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/posts/${post.id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author: commentAuthor, content: newComment }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add comment');
      }

      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment('');
      setCommentAuthor('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Something went wrong while adding the comment.');
    }
  };

  // Format the publish date
  const formattedDate = new Date(post.publish_date).toLocaleDateString();

  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg bg-pink-100 rounded-lg overflow-hidden mb-3 grid-cols-3">
      <img src={post.image || 'default-image-url.jpg'} className="w-full h-48 object-cover" alt={post.title || 'Post Image'} />
      <div className="p-6">
        <h5 className="text-2xl font-bold text-purple-600 mb-3">{post.title || 'Untitled Post'}</h5>
        <p className="text-gray-700 mb-2">{post.content || 'No content available.'}</p>
        <p className="text-gray-600"><strong>Author:</strong> {post.author || 'Unknown'}</p>
        <p className="text-gray-600"><strong>Published on:</strong> {formattedDate || 'Date not available'}</p>
        
        <button
          onClick={handleLike}
          className="flex items-center mt-4 text-gray-500 hover:text-purple-500 transition"
        >
          <FaThumbsUp className="mr-2" /> {likes}
        </button>

        <form onSubmit={handleCommentSubmit} className="mt-4">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Your Name"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              placeholder="Your Comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            <FaComment className="inline-block mr-2" /> Comment
          </button>
        </form>

        <h6 className="mt-6 font-bold text-gray-800">Comments:</h6>
        <ul className="list-disc pl-5">
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => (
              <li key={index} className="mt-2 text-gray-700">
                <strong>{comment.comment_author}</strong>: {comment.content}
              </li>
            ))
          ) : (
            <p className="text-gray-600">No comments yet. Be the first to comment!</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BlogView;
