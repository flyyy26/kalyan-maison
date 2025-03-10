'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from "next/navigation";

type Lounge = {
  _id: string;
  name: string;
  slug:string;
  banner: string | File;
  phone:string;
  city: string;
  taglineId: string;
  taglineEn: string;
  taglineBanner: string | File;
  imageSlide: string[];
  menu: string[];
  spaces: string[];
  date: string;
};

export const useLounge = () => {
  const { id } = useParams();
  const router = useRouter();

  const [lounges, setLounges] = useState<Lounge[]>([]);
  const [loungesDetail, setLoungesDetail] = useState<Lounge>({
    _id: "",
    name: "",
    slug:"",
    banner: "" ,
    phone:"",
    city: "",
    taglineId: "",
    taglineEn: "",
    taglineBanner: "",
    imageSlide: [],
    menu: [],
    spaces: [],
    date: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch lounges from API
  const fetchLounges = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/lounge');
      setLounges(response.data.lounges);
    } catch (err) {
      setError('Failed to fetch lounges.');
    } finally {
      setLoading(false);
    }
  };

  const addLounge = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/lounge', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuccess('Lounge successfully added!');
          await fetchLounges(); // Refresh lounges list
          return true;
        } else {
          setError(result.msg || 'Failed to add lounge.');
        }
      } else {
        setError('Failed to add lounge.');
      }
    } catch (err) {
      setError('Network error occurred.');
    } finally {
      setLoading(false);
    }
    return false;
  };

  const deleteLounge = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete('/api/lounge', {
        params: { id },
      });

      if (response.status === 200) {
        setSuccess('Lounge successfully deleted!');
        await fetchLounges(); // Refresh lounges list
        return true;
      } else {
        setError('Failed to delete lounge.');
      }
    } catch (err) {
      setError('Network error occurred.');
    } finally {
      setLoading(false);
    }
    return false;
  };

  const updateLounge = async (id: string, formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/lounge/${id}`, {
        method: "PUT",
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuccess("Lounge updated successfully!");
  
          // Perbarui state loungeDetail setelah berhasil update
          updateLoungeDetail(result.updateLounge);
  
          await fetchLounges(); // Jika perlu memperbarui daftar lounge
          return true;
        } else {
          setError(result.msg || "Failed to update lounge.");
        }
      } else {
        setError("Failed to update lounge.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
    return false;
  };  

  const updateLoungeDetail = (updatedFields: Partial<Lounge>) => {
    setLoungesDetail((prev) => ({ ...prev, ...updatedFields }));
  };  

  const fetchLoungeDetail = async (id: string) => {
    if (!id) return;
    
    try {
        const res = await fetch(`/api/lounge/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data lounge");

        const responseData: Lounge = await res.json();

        setLoungesDetail(responseData);
        if (responseData.banner instanceof File) {
          setPreviewImage(URL.createObjectURL(responseData.banner)); // Jika File, buat URL sementara
        } else {
          setPreviewImage(responseData.banner || ""); // Jika string (URL gambar), langsung gunakan
        } // Pastikan tidak `undefined`
    } catch (error) {
        console.error("Fetch error:");
    } finally {
        setLoading(false);
    }
  };
  
  useEffect(() => {
      if (!id) return;
    
      const fetchLoungeDetail = async () => {
        try {
          const res = await fetch(`/api/lounge/${id}`, {
            method: "GET",
          });
          if (!res.ok) throw new Error("Gagal mengambil data lounge");
    
          const responseData: Lounge = await res.json();
          setLoungesDetail(responseData);
          if (responseData.banner instanceof File) {
            setPreviewImage(URL.createObjectURL(responseData.banner)); // Jika File, buat URL sementara
          } else {
            setPreviewImage(responseData.banner || ""); // Jika string (URL gambar), langsung gunakan
          }
        } catch (error) {
          console.error("Fetch error:", error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchLoungeDetail();
  }, [id]);

  useEffect(() => {
    fetchLounges();
  }, []);

  return {
    lounges,
    loading,
    error,
    success,
    loungesDetail,
    previewImage,
    setError,
    setSuccess,
    updateLoungeDetail,
    setLoungesDetail,
    setLoading,
    fetchLounges,
    fetchLoungeDetail,
    addLounge,
    deleteLounge,
    updateLounge,
  };
}

export default useLounge