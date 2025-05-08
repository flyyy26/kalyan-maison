'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from "next/navigation";

type Gallery = {
  _id: string;
  imageGallery: [];
  videoGallery: [];
};

type GalleryFe = {
  _id: number;
  imageGallery:[];
  videoGallery: [];
};

export const useGallery = () => {
  const { id } = useParams();
  const router = useRouter();

  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [galleriesFe, setGalleriesFe] = useState<GalleryFe[]>([]);
  const [galleriesDetail, setGalleriesDetail] = useState<Gallery>({
    _id: "",
    imageGallery: [],
    videoGallery: [],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch gallery from API
  const fetchGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/gallery');
      setGalleries(response.data.data);
      setGalleriesFe(response.data.data);
    } catch (err) {
      setError('Failed to fetch gallery.');
    } finally {
      setLoading(false);
    }
  };


  const addGallery = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuccess('gallery successfully added!');
          await fetchGallery(); // Refresh gallery list
          return true;
        } else {
          setError(result.msg || 'Failed to add gallery.');
        }
      } else {
        setError('Failed to add gallery.');
      }
    } catch (err) {
      setError('Network error occurred.');
    } finally {
      setLoading(false);
    }
    return false;
  };

  const deleteGallery = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete('/api/gallery', {
        params: { id },
      });

      if (response.status === 200) {
        setSuccess('Gallery successfully deleted!');
        await fetchGallery(); // Refresh gallery list
        return true;
      } else {
        setError('Failed to delete gallery.');
      }
    } catch (err) {
      setError('Network error occurred.');
    } finally {
      setLoading(false);
    }
    return false;
  };

  const updateGallery = async (id: string, formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/gallery/681bcfa40fe6e9b362afd97a`, {
        method: "PUT",
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuccess("Gallery updated successfully!");
  
          updateGalleryDetail(result.updateGallery);
  
          await fetchGallery();
          return true;
        } else {
          setError(result.msg || "Failed to update gallery.");
        }
      } else {
        setError("Failed to update gallery.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
    return false;
  };  

  const updateGalleryDetail = (updatedFields: Partial<Gallery>) => {
    setGalleriesDetail((prev) => ({ ...prev, ...updatedFields }));
  };  

  
  useEffect(() => {
    const fetchGalleryDetail = async () => {
      setLoading(true);
  
      try {
        const res = await fetch(`/api/gallery/681bcfa40fe6e9b362afd97a`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
  
        const responseData: Gallery = await res.json();
        setGalleriesDetail(responseData);
  
      } catch (error) {
        console.error("❌ Fetch error:", error);
        setError("Gagal mengambil data galeri.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchGalleryDetail();
  }, []);

  useEffect(() => {
    fetchGallery();
  }, []);

  return {
    galleries,
    galleriesFe,
    loading,
    error,
    success,
    galleriesDetail,
    setGalleriesFe,
    setError,
    setSuccess,
    updateGalleryDetail,
    setGalleriesDetail,
    setLoading,
    fetchGallery,
    addGallery,
    deleteGallery,
    updateGallery,
    setGalleries,
  };
}

export default useGallery