'use client';

// import axios from 'axios';
import { useState } from 'react';
import Image from 'next/image';
import { Editor } from '@tinymce/tinymce-react';
import { useBlog } from '@/hooks/useBlog';

// interface Blog {
//   _id: string;
//   title: string;
//   description: string;
//   image: string;
//   video:string;
//   author:string;
// }

export default function BlogForm() {
  // const [title, setTitle] = useState('');
  // const [description, setDescription] = useState('');
  // const [author, setAuthor] = useState('');
  // const [image, setImage] = useState<File | null>(null);
  // const [video, setVideo] = useState<File | null>(null);
  // const [tags, setTags] = useState<string[]>([]);
  // const [successMessage, setSuccessMessage] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');
  // const [loading, setLoading] = useState(false);

  // const [blogs, setBlogs] = useState<Blog[]>([]);

  // const fetchBlogs = async () => {
  //   const response = await axios.get('/api/blog')
  //   setBlogs(response.data.blogs)
  // }

  // useEffect(()=>{
  //   fetchBlogs();
  // }, [])

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   setImage(file || null);
  // };

  // const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const fileVideo = event.target.files?.[0];
  //   setVideo(fileVideo || null);
  // };

  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   setLoading(true);
  //   setSuccessMessage('');
  //   setErrorMessage('');

  //   if (!title) {
  //     setErrorMessage('Judul harus diisi!');
  //     setLoading(false);
  //     return;
  //   }
  
  //   if (!description) {
  //     setErrorMessage('Deskripsi harus diisi!');
  //     setLoading(false);
  //     return;
  //   }
  
  //   if (!image) {
  //     setErrorMessage('Gambar harus diunggah!');
  //     setLoading(false);
  //     return;
  //   }
  
  //   if (!author) {
  //     setErrorMessage('Author harus diisi!');
  //     setLoading(false);
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('title', title);
  //   formData.append('description', description);
  //   formData.append('image', image); 
  //   if (video) {
  //     formData.append('video', video); // Tambahkan video hanya jika ada
  //   }
  //   formData.append('author', author); 
  //   if (tags) {
  //     formData.append('tags', JSON.stringify(tags)); 
  //   }
    

  //   try {
  //     const response = await fetch('/api/blog', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       if (result.success) {
  //         setSuccessMessage(result.msg);
  //         setTitle('');
  //         setDescription('');
  //         setAuthor('');
  //         setImage(null);
  //         setVideo(null);
  //         setTags([]);
  //       } else {
  //         setErrorMessage(result.msg || 'Gagal menambahkan blog.');
  //       }
  //     } else {
  //       setErrorMessage('Terjadi kesalahan saat mengirim data.');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     setErrorMessage('Terjadi kesalahan jaringan.');
  //   } finally {
  //     setLoading(false);
  //     window.location.reload()
  //   }
  // };

  // const deleteBlog = async (mongoId: string) => {
  //   try {
  //     const response = await axios.delete(`/api/blog`,{
  //       params: {
  //         id: mongoId
  //       }
  //     }); // Kirim ID langsung di URL
  //     if (response.status === 200) {
  //       alert('Berhasil dihapus');
  //       fetchBlogs(); // Panggil ulang untuk memperbarui data
  //     } else {
  //       alert('Gagal menghapus blog');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting blog:', error);
  //     alert('Terjadi kesalahan saat menghapus blog.');
  //   }
  // };
  
  const {
    blogs,
    loading,
    error,
    success,
    addBlog,
    deleteBlog,
  } = useBlog();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImage(file || null);
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setVideo(file || null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title || !description || !author || !image) {
      alert('All fields are required!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);
    if (video) formData.append('video', video);
    formData.append('author', author);
    formData.append('tags', JSON.stringify(tags));

    const success = await addBlog(formData);
    if (success) {
      setTitle('');
      setDescription('');
      setAuthor('');
      setImage(null);
      setVideo(null);
      setTags([]);
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
          <Editor
            id="description"
            value={description}
            apiKey='f0qff2j87jgv24lrb8m0hd4yuglweewk56pa79tykafgtc6g'
            init={{
              plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
              toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            }}
            onChange={(e) => setDescription(e.target.getContent())}
          />

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
        <div className="form-group">
          <label htmlFor="video">Unggah Video</label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleVideoChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            placeholder="Masukkan Author"
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            placeholder="Masukkan tags, pisahkan dengan koma"
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Mengirim...' : 'Tambahkan Blog'}
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {/* {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>} */}
    </div>
    <div className="blog-table-container">
      <h2>Daftar Blog</h2>
        <table className="blog-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Judul</th>
              <th>Deskripsi</th>
              <th>Author</th>
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
                  <td dangerouslySetInnerHTML={{ __html: blog.description }} />
                  <td>{blog.author}</td>
                  <td>
                    <Image
                      width="100"
                      height="100"
                      src={blog.image}
                      alt={blog.title}
                      className="blog-image"
                    />
                  </td>
                  <td>
                    <video src={blog.video} controls
            width="300"></video>
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => deleteBlog(blog._id)}
                    >
                      Hapus
                    </button>
                  </td>
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
