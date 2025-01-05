import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from './EditPostForm.module.css';

function EditPostForm() {
  const nevigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();
    if (error) {
      console.error('Error fetching post:', error.message);
    } else {
      setPost(post);
      setTitle(post.title);
      setContent(post.content);
      setImageUrl(post.image_url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmation = window.confirm('Are you sure you want to update this post?');
    if (confirmation) {
      const { data, error } = await supabase
        .from('posts')
        .update({ title, content, image_url: imageUrl })
        .eq('id', postId);
      if (error) {
        console.error('Error updating post:', error.message);
      } else {
        nevigate(`/post/${postId}`);
      }
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        className={styles.input}
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className={styles.textarea}
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        className={styles.input}
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button className={styles.button} type="submit">Update Post</button>
    </form>
  );
}

export default EditPostForm;
