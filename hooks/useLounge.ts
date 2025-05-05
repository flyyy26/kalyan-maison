'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from "next/navigation";

type Lounge = {
  _id: string;
  name: string;
  instagram: string;
  facebook: string;
  youtube: string;
  email: string;
  whatsapp: string;
  slug:string;
  address:string;
  banner: string | File;
  logo: string | File;
  phone:string;
  day:string;
  time:string;
  city: string;
  date: string;
  menuImages: [];
  otherImages: [];
};

type LoungeFe = {
  _id: number;
  name: string;
  instagram: string;
  facebook: string;
  youtube: string;
  email: string;
  whatsapp: string;
  slug:string;
  address:string;
  banner: string | File;
  logo: string | File;
  phone:string;
  city: string;
  day:string;
  time:string;
  menuImages:[];
  otherImages: [];
  date: string;
  className: 'btn_tab_left' | 'btn_tab_right' | 'btn_tab_bottom'; 
};



type City = {
  _id: string;
  name: string;
};

export const useLounge = () => {
  const { id } = useParams();
  const router = useRouter();

  const [lounges, setLounges] = useState<Lounge[]>([]);
  const [citiesLounge, setCitiesLounge] = useState<City[]>([]);
  const [loungesFe, setLoungesFe] = useState<LoungeFe[]>([]);
  const [loungesDetail, setLoungesDetail] = useState<Lounge>({
    _id: "",
    name: "",
    instagram: "",
    facebook: "",
    youtube: "",
    email: "",
    whatsapp: "",
    slug:"",
    address:"",
    banner: "" ,
    logo: "",
    phone:"",
    city: "",
    menuImages: [],
    otherImages: [],
    date: "",
    day: "",
    time: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  // Fetch lounges from API
  const fetchLounges = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/lounge');
      setLounges(response.data.data);
      setLoungesFe(response.data.data);
    } catch (err) {
      setError('Failed to fetch lounges.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoungesCity = async (cityName: string) => {
    if (!cityName) {
        setError("City name is required.");
        return;
    }

    setLoading(true);
    setError(null);

    try {
        const response = await axios.get(`/api/lounge?city=${encodeURIComponent(cityName)}`);
        
        if (response.data.success) {
            setCitiesLounge(response.data.data);
        } else {
            setError("No lounges found.");
            setCitiesLounge([]);
        }
    } catch (err) {
        console.error("Error fetching lounges:", err);
        setError("Failed to fetch lounges.");
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

  
  useEffect(() => {
      if (!id) return;
    
      const fetchLoungeDetail = async () => {
        try {
          const res = await fetch(`/api/lounge/${id}`, {
            method: "GET",
          });
    
          const responseData: Lounge = await res.json();
          setLoungesDetail(responseData);
          if (responseData.banner instanceof File) {
            setPreviewBanner(URL.createObjectURL(responseData.banner)); // Jika File, buat URL sementara
          } else {
            setPreviewBanner(responseData.banner || ""); // Jika string (URL gambar), langsung gunakan
          }

          if (responseData.logo instanceof File) {
            setPreviewLogo(URL.createObjectURL(responseData.logo)); // Jika File, buat URL sementara
          } else {
            setPreviewLogo(responseData.logo || ""); // Jika string (URL gambar), langsung gunakan
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
    loungesFe,
    loading,
    error,
    success,
    loungesDetail,
    previewBanner,
    previewLogo,
    citiesLounge,
    setCitiesLounge,
    setLoungesFe,
    setError,
    setSuccess,
    updateLoungeDetail,
    setLoungesDetail,
    setLoading,
    fetchLounges,
    addLounge,
    deleteLounge,
    updateLounge,
    setLounges,
  };
}

export default useLounge