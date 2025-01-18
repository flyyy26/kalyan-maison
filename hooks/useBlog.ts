'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

type Blog = {
  _id: string;
  title: string;
  slug:string;
  titleEn: string;
  slugEn:string;
  description: string;
  author: string;
  image: string;
  video?: string;
  tags: string[];
  date: string;
};

export const useBlog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/blog');
      setBlogs(response.data.blogs);
    } catch (err) {
      setError('Failed to fetch blogs.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new blog
  const addBlog = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuccess('Blog successfully added!');
          await fetchBlogs(); // Refresh blogs list
          return true;
        } else {
          setError(result.msg || 'Failed to add blog.');
        }
      } else {
        setError('Failed to add blog.');
      }
    } catch (err) {
      setError('Network error occurred.');
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Delete a blog
  const deleteBlog = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete('/api/blog', {
        params: { id },
      });

      if (response.status === 200) {
        setSuccess('Blog successfully deleted!');
        await fetchBlogs(); // Refresh blogs list
        return true;
      } else {
        setError('Failed to delete blog.');
      }
    } catch (err) {
      setError('Network error occurred.');
    } finally {
      setLoading(false);
    }
    return false;
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    blogs,
    loading,
    error,
    success,
    fetchBlogs,
    addBlog,
    deleteBlog,
  };
};
