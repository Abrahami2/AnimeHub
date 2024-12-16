import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from './postPage.module.css';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { PiPaperPlaneRightFill, PiThumbsUpFill } from "react-icons/pi";

function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [animate, setAnimate] = useState(false); // Add animate state
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();
    if (error) {
      console.error('Error fetching post:', error);
    } else {
      setPost(data);
    }
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId);
    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data);
    }
  };

  const handleUpvote = async () => {
    if (!post) return; // Check if the post data is available

    setAnimate(true); // Trigger the animation
    setTimeout(() => setAnimate(false), 1000); // Reset animation state after 1 second
  
    // Optimistically update the UI before the database operation
    const newUpvotes = post.upvotes + 1; // Increment the current upvote count
    setPost(prevPost => ({ ...prevPost, upvotes: newUpvotes })); // Update the post state
  
    const { error } = await supabase
      .from('posts') // Access the 'posts' table
      .update({ upvotes: newUpvotes }) // Set the new upvotes count
      .match({ id: postId }); // Specify the post to update using the postId
  
    if (error) {
      console.error('Error updating upvotes:', error); // Log any errors
      // Rollback the upvote count if there's an error
      setPost(prevPost => ({ ...prevPost, upvotes: prevPost.upvotes - 1 }));
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('comments')
      .insert([
        { post_id: postId, text: newComment, created_at: new Date() }
      ]);
    if (error) {
      console.error('Error submitting comment:', error);
    } else {
      setNewComment('');
      fetchComments(); // Refresh comments after adding
    }
  };

  const handleEditComment = (commentId) => {
    setEditingCommentId(commentId);
    const commentToEdit = comments.find(comment => comment.id === commentId);
    setEditedCommentText(commentToEdit.text);
  };

  const handleSaveEditedComment = async () => {
    const { error } = await supabase
      .from('comments')
      .update({ text: editedCommentText })
      .eq('id', editingCommentId);
    if (error) {
      console.error('Error saving edited comment:', error);
    } else {
      setEditingCommentId(null);
      fetchComments(); // Refresh comments after editing
    }
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      if (error) {
        console.error('Error deleting post:', error);
      } else {
        navigate('/');
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm('Did chat cook you? ok=Yes');
    if (confirmDelete) {
      const { error } = await supabase
        .from('comments')
        .delete()
        .match({ id: commentId });
      if (error) {
        console.error('Error deleting comment:', error);
      } else {
        setComments(comments.filter(comment => comment.id !== commentId)); // Remove comment from state
      }
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className={styles.postContainer}>
      <h1 className={styles.postTitle}>{post.title}</h1>
      <p className={styles.postContent}>{post.content}</p>
      {post.image_url && <img src={post.image_url} alt={post.title} style={{width: '100%', height: 'auto'}} />}
      <br/>
      <div className={styles.edButtonsUpvote}>
        
        <button className={`${styles.upvoteButton} ${animate ? styles.rubberBand : ''}`} onClick={handleUpvote}>
          <PiThumbsUpFill style={{ fontSize: '20px' }}/> {post.upvotes} upvotes
        </button>
        <div className={styles.buttonsContainer}>
          <button onClick={handleDeletePost} className={styles.deleteButton}>
            <FaTrash />
          </button>
          <Link to={`/edit-post/${post.id}`} className={styles.editButton}>
            <FaEdit />
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmitComment} className={styles.commentForm}>
        <input
          className={styles.commentInput}
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <button type="submit" className={styles.submitButton}><PiPaperPlaneRightFill/></button>
      </form>

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            {editingCommentId === comment.id ? (
              <input
                type="text"
                value={editedCommentText}
                onChange={(e) => setEditedCommentText(e.target.value)}
                onBlur={handleSaveEditedComment}
                autoFocus
              />
            ) : (
              <div className={styles.commentContainer}>
                <span>{comment.text}</span>
                <div className={styles.commentActions}>
                  <button onClick={() => handleEditComment(comment.id)} className={styles.editButton}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteComment(comment.id)} className={styles.deleteButton}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostPage;
