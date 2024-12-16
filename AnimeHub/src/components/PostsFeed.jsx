import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import styles from './PostsFeed.module.css';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Loader from './Loader'; 

function PostsFeed({ searchTerm }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchPosts();
  }, [sortField, sortOrder]);

  const fetchPosts = async () => {
    setLoading(true);
    let { data: fetchedPosts, error } = await supabase
      .from('posts')
      .select('*')
      .order(sortField, { ascending: sortOrder === 'asc' });
    if (error) {
      console.error('error', error);
    } else {
      // Fetch comments for each post
      const postsWithComments = await Promise.all(
        fetchedPosts.map(async (post) => {
          const { data: comments, error: commentError } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', post.id);
          if (commentError) {
            console.error('error fetching comments', commentError);
            return post;
          } else {
            return { ...post, comments };
          }
        }),
      );
      setPosts(postsWithComments);
    }
    setLoading(false); //
  };

  const handleDelete = async (postId, event) => {
    event.preventDefault(); // Prevent default behavior of Link
    setLoading(true);
    const { error } = await supabase
      .from('posts')
      .delete()
      .match({ id: postId });
    if (error) {
      console.error('error', error);
    } else {
      fetchPosts(); // Refresh posts after deletion
    }
    setLoading(false); 
  };

  const filteredPosts = searchTerm
    ? posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : posts;

    if (loading) {
      return <Loader />;
    }

  return (
    <div>
      {/* Sort controls */}
      <div className={styles.sortControls}>
        <label>Sort by:</label>
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="created_at">Date</option>
          <option value="upvotes">Upvotes</option>
        </select>
        <button
          onClick={() => setSortOrder('asc')}
          className={styles.sortButton}
        >
          Asc
        </button>
        <button
          onClick={() => setSortOrder('desc')}
          className={styles.sortButton}
        >
          Desc
        </button>
      </div>
      {/* Posts list */}
      {filteredPosts.map((post) => (
        <div key={post.id} className={styles.PostContainer}>
          <Link to={`/post/${post.id}`} className={styles.postLink}>
            <div className={styles.postItem}>
              <h3 className={styles.postTitle}>{post.title}</h3>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className={styles.postImage}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div className={styles.edButtonsUpvote}>
                <p>{post.upvotes} upvotes</p>
                <div className={styles.buttonsContainer}>
                  <button onClick={(event) => handleDelete(post.id, event)}>
                    <FaTrash />
                  </button>
                  <Link to={`/edit-post/${post.id}`}>
                    <button className={styles.editButton}>
                      <FaEdit />
                    </button>
                  </Link>
                </div>
              </div>
              {post.comments && post.comments.length > 0 && (
                <div className={styles.commentsContainer}>
                  {post.comments.slice(0, 2).map((comment) => (
                    <div key={comment.id} className={styles.comment}>
                      {comment.text}
                    </div>
                  ))}
                  {post.comments.length > 2 && (
                    <Link to={`/post/${post.id}`}>
                      View all comments
                    </Link>
                  )}
                </div>
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default PostsFeed;
