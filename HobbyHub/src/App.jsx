import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');
  const [updatedImageURL, setUpdatedImageURL] = useState('');
  const [comment, setComment] = useState('');
  const [orderBy, setOrderBy] = useState('newest'); // Added state for ordering posts
  const [sortByUpvotes, setSortByUpvotes] = useState(false); // Added state for sorting by upvotes

  const handleCreatePost = (event) => {
    event.preventDefault();
    const newPost = {
      id: posts.length + 1,
      title,
      content,
      imageURL,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      comments: [],
    };
    setPosts([...posts, newPost]);
    setTitle('');
    setContent('');
    setImageURL('');
  };

  const handleUpdatePost = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          title: updatedTitle || post.title,
          content: updatedContent || post.content,
          imageURL: updatedImageURL || post.imageURL,
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    setEditingPostId(null);
  };

  const handleEditPost = (postId) => {
    const postToEdit = posts.find((post) => post.id === postId);
    setUpdatedTitle(postToEdit.title);
    setUpdatedContent(postToEdit.content);
    setUpdatedImageURL(postToEdit.imageURL);
    setEditingPostId(postId);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
  };

  const handleUpvote = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return { ...post, upvotes: post.upvotes + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleCommentSubmit = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const newComment = {
          id: post.comments.length + 1,
          content: comment,
          createdAt: new Date().toISOString(),
        };
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });
    setPosts(updatedPosts);
    setComment('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleOrderByChange = (order) => {
    setOrderBy(order);
  };

  const handleSortByUpvotes = () => {
    setSortByUpvotes(!sortByUpvotes);
  };

  const handleDeletePost = (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortByUpvotes) {
      return b.upvotes - a.upvotes;
    } else {
      if (orderBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    }
  });

  const filteredPosts = sortedPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <div className="title">
        <h2>HobbyHub - Video Game Hub</h2>
      </div>
      <div className="header">
        <button onClick={() => handleTabChange('home')}>Home</button>
        <button onClick={() => handleTabChange('createPost')}>Create Post</button>
      </div>

      <div className="content-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div class="stripe"></div>
        
        {activeTab === 'home' && (
          <div className="post-container">
            <div className="order-by">
              <span>Order By:</span>
              <button onClick={() => handleOrderByChange('newest')}>Newest</button>
              <button onClick={() => handleOrderByChange('oldest')}>Oldest</button>
            </div>
            <div className="sort-by-upvotes">
              <button onClick={handleSortByUpvotes}>Sort By Upvotes</button>
            </div>
            <ul>
              {filteredPosts.map((post) => (
                <li key={post.id}>
                  {editingPostId === post.id ? (
                    <div>
                      <label htmlFor="updateTitle">Title:</label>
                      <input
                        type="text"
                        id="updateTitle"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                      />
                      <label htmlFor="updateContent">Content:</label>
                      <textarea
                        id="updateContent"
                        value={updatedContent}
                        onChange={(e) => setUpdatedContent(e.target.value)}
                      ></textarea>
                      <label htmlFor="updateImageURL">Image URL:</label>
                      <input
                        type="text"
                        id="updateImageURL"
                        value={updatedImageURL}
                        onChange={(e) => setUpdatedImageURL(e.target.value)}
                      />
                      <button onClick={() => handleUpdatePost(post.id)}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <h3>{post.title}</h3>
                      {post.imageURL && <img src={post.imageURL} alt={post.title} />}
                      <p>{post.content}</p>
                      <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
                      <p>Upvotes: {post.upvotes}</p>
                      <button onClick={() => handleUpvote(post.id)}>Upvote</button>
                      <button onClick={() => handleEditPost(post.id)}>Edit</button>
                      <button onClick={() => handleDeletePost(post.id)}>Delete</button> {/* Delete button */}
                      <form onSubmit={(e) => { e.preventDefault(); handleCommentSubmit(post.id); }}>
                        <input
                          type="text"
                          placeholder="Leave a comment..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <button type="submit">Submit</button>
                      </form>
                      <ul>
                        {post.comments.map((comment) => (
                          <li key={comment.id}>
                            <p>{comment.content}</p>
                            <p>Commented At: {new Date(comment.createdAt).toLocaleString()}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'createPost' && (
          <div className="create-post-container">
            <h2>Create a New Post</h2>
            <form onSubmit={handleCreatePost}>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <label htmlFor="content">Content:</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
              <label htmlFor="imageURL">Image URL:</label>
              <input
                type="text"
                id="imageURL"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
