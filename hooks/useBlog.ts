'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from "next/navigation";

type Blog = {
  _id: string;
  titleEn: string;
  source: string;
  slugEn:string;
  descriptionEn: string;
  titleCn: string;
  slugCn:string;
  descriptionCn: string;
  titleRs: string;
  slugRs:string;
  descriptionRs: string;
  visitCount: number;
  author: string;
  image: string | File;
  tags: string[];
  date: string;
};

export const useBlog = () => {
  const { id } = useParams();
  const router = useRouter();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogDetail, setBlogDetail] = useState<Blog>({
    _id: "",
    titleEn: "",
    source: "",
    slugEn: "",
    descriptionEn: "",
    titleCn: "",
    slugCn: "",
    descriptionCn: "",
    titleRs: "",
    slugRs: "",
    descriptionRs: "",
    author: "",
    visitCount: 0,
    image: "",
    tags: [],
    date: "",
  });
  
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
        cache: 'no-store'
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

  const updateBlog = async (id: string, formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        body: formData,
        cache: 'no-store'
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuccess("Blog updated successfully!");
  
          // Perbarui state blogDetail setelah berhasil update
          updateBlogDetail(result.updatedBlog);
  
          await fetchBlogs(); // Jika perlu memperbarui daftar blog
          return true;
        } else {
          setError(result.msg || "Failed to update blog.");
        }
      } else {
        setError("Failed to update blog.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
    return false;
  };  

  const updateBlogDetail = (updatedFields: Partial<Blog>) => {
    setBlogDetail((prev) => ({ ...prev, ...updatedFields }));
  };  

  const fetchBlogDetail = async (id: string) => {
      if (!id) return;
      
      try {
          const res = await fetch(`/api/blog/${id}`, {
            cache: 'no-store'
          });
          if (!res.ok) throw new Error("Gagal mengambil data blog");

          const responseData: Blog = await res.json();
 
          setBlogDetail(responseData);
          if (responseData.image instanceof File) {
            setPreviewImage(URL.createObjectURL(responseData.image)); // Jika File, buat URL sementara
          } else {
            setPreviewImage(responseData.image || ""); // Jika string (URL gambar), langsung gunakan
          } // Pastikan tidak `undefined`
      } catch (error) {
          console.error("Fetch error:");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    if (!id) return;
  
    const fetchBlogDetail = async () => {
      try {
        const res = await fetch(`/api/blog/${id}`, {
          method: "GET",
          cache: 'no-store'
        });
        if (!res.ok) throw new Error("Gagal mengambil data blog");
  
        const responseData: Blog = await res.json();
        setBlogDetail(responseData);
        if (responseData.image instanceof File) {
          setPreviewImage(URL.createObjectURL(responseData.image)); // Jika File, buat URL sementara
        } else {
          setPreviewImage(responseData.image || ""); // Jika string (URL gambar), langsung gunakan
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBlogDetail();
  }, [id]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    blogs,
    loading,
    error,
    success,
    blogDetail,
    previewImage,
    setError,
    setSuccess,
    updateBlogDetail,
    setBlogDetail,
    setLoading,
    fetchBlogs,
    fetchBlogDetail,
    addBlog,
    deleteBlog,
    updateBlog,
  };
};