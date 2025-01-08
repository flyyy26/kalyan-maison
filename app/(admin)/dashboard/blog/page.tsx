'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';

interface Blog {
  _id: string;
  title: string;
  description: string;
  image: string;
}

export default function BlogForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    const response = await axios.get('/api/blog')
    setBlogs(response.data.blogs)
  }

  useEffect(()=>{
    fetchBlogs();
  }, [])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImage(file || null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!title || !description || !image) {
      setErrorMessage('Semua field harus diisi!');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuccessMessage(result.msg);
          setTitle('');
          setDescription('');
          setImage(null);
          
        } else {
          setErrorMessage(result.msg || 'Gagal menambahkan blog.');
        }
      } else {
        setErrorMessage('Terjadi kesalahan saat mengirim data.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
      window.location.reload()
    }
  };

  return (
    <>
    <div className="blog-form-container">
      <h2>Tambah Blog</h2>
      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">Judul</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Masukkan judul blog"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Deskripsi</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Masukkan deskripsi blog"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="image">Unggah Gambar</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Mengirim...' : 'Tambahkan Blog'}
        </button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
    <div className="blog-table-container">
      <h2>Daftar Blog</h2>
        <table className="blog-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Judul</th>
              <th>Deskripsi</th>
              <th>Gambar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <tr key={blog._id}>
                  <td>{index + 1}</td>
                  <td>{blog.title}</td>
                  <td>{blog.description}</td>
                  <td>
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="blog-image"
                      style={{ maxWidth: '100px', height: 'auto' }}
                    />
                  </td>
                  {/* <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(blog._id)}
                    >
                      Hapus
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>Tidak ada blog tersedia.</td>
              </tr>
            )}
          </tbody>
        </table>
    </div>
  </>
  );
}
