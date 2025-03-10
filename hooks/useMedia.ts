'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

type Media = {
  _id: string;
  image:string;
  link:string;
};

export const useMedia = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch media from API
  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/media');
      setMedia(response.data.media);
    } catch (err) {
      setError('Failed to fetch media.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new media
  const addMedia = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log("📤 Mengirim FormData ke API...");
      
      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json().catch(() => null); // Antisipasi jika response bukan JSON
      console.log("📥 Response API:", response.status, data);
  
      if (response.ok && data?.success) {
        setSuccess("✅ Media successfully added!");
        await fetchMedia(); // Refresh media list
        return true;
      } else {
        setError(data?.msg || `❌ Failed to add media (Status: ${response.status})`);
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      setError("⚠️ Network error occurred.");
    } finally {
      setLoading(false);
    }
  
    return false;
  };
  

  // Delete a media
  const deleteMedia = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete('/api/media', {
        params: { id },
      });

      if (response.status === 200) {
        setSuccess('Media successfully deleted!');
        await fetchMedia(); // Refresh media list
        return true;
      } else {
        setError('Failed to delete media.');
      }
    } catch (err) {
      setError('Network error occurred.');
    } finally {
      setLoading(false);
    }
    return false;
  };

  useEffect(() => {
    fetchMedia();
  }, []);
  

  return {
    media,
    loading,
    error,
    success,
    fetchMedia,
    addMedia,
    deleteMedia,
  };
};
