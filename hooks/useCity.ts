'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from "next/navigation";

type City = {
  _id: string;
  name: string;
};

export const useCity = () => {
  const { id } = useParams();
  const router = useRouter();

  const [cities, setCities] = useState<City[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch lounges from API
  const fetchCities = async (): Promise<City[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/city');
      const cities = response.data.cities; // Ambil data dari respons API
      setCities(cities); // Update state dengan daftar kota
      return cities; // ✅ Pastikan fungsi mengembalikan `City[]`
    } catch (err) {
      setError('Failed to fetch lounges.');
      return []; // ✅ Kembalikan array kosong jika terjadi error
    } finally {
      setLoading(false);
    }
  };  
  

  const addCity = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/city', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuccess('Lounge successfully added!');
          await fetchCities(); // Refresh lounges list
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

  const deleteCity = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete('/api/lounge', {
        params: { id },
      });

      if (response.status === 200) {
        setSuccess('Lounge successfully deleted!');
        await fetchCities(); // Refresh lounges list
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

  useEffect(() => {
    fetchCities();
  }, []);

  return {
    cities,
    loading,
    error,
    success,
    setError,
    setSuccess,
    setLoading,
    fetchCities,
    addCity,
    deleteCity,
    setCities
  };
}

export default useCity