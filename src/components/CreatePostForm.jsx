// src/components/CreatePostForm.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import styles from './CreatePostForm.module.css';

function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, content, image_url: imageUrl, created_at: new Date() }]);
    if (error) {
      alert(error.message);
    } else {
      alert('Post created!');
      setTitle('');
      setContent('');
      setImageUrl('');
    }
  };

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
      <button className={styles.button} type="submit">Create Post</button>
    </form>
  );
}

export default CreatePostForm;
