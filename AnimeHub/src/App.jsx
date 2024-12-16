// src/App.jsx
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import CreatePostForm from './components/CreatePostForm';
import PostsFeed from './components/PostsFeed';
import PostPage from './components/PostPage';
import './global.css'; // Importing the global styles
import Navbar from './components/Navbar';
import EditPost from './components/EditPost';

function App() {
  const [userstate, setUserState] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>
    <Router>
    <Navbar userstate={userstate} setSearchTerm={setSearchTerm} searchTerm={searchTerm}/>
      <div className="container">
        <Routes>
          <Route path="/" element={<PostsFeed searchTerm={searchTerm} />} />
          <Route path="/create-post" element={<CreatePostForm />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/edit-post/:postId" element={<EditPost />} />
          {/* Add additional routes as needed */}
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
