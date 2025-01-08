'use client';

import { useState, useEffect } from 'react';

export default function InputBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, image, date }),
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        setImage('');
        setDate('');
        setSuccess(true);
      } else {
        console.error('Failed to create blog');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  type Blog = {
    id: number;
    title: string;
    content: string;
    image: string;
    date: string;
    createdAt: string;
    };

    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        // Fetch admin users from the API
        async function fetchBlog() {
        const response = await fetch("/api/blog");
        const data = await response.json();
        setBlogs(data);
        }
        fetchBlog();
    }, []);

  return (
    <>
    <div className="input-blog-container">
      <h1>Input Blog</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="date">Date:</label>
          <input
            type='date'
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="image">Image URL:</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {success && <p>Blog submitted successfully!</p>}
      </form>
    </div>
    <div className="blog-list">
        <h2>All Blogs</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Content</th>
              <th>Image</th>
              <th>Date</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>{blog.id}</td>
                <td>{blog.title}</td>
                <td>{blog.content}</td>
                <td>{blog.image}</td>
                <td>{blog.date}</td>
                <td>{new Date(blog.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
</>
  );
}
