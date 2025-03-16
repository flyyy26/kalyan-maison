'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "next/navigation";

type Reservation = {
    _id: string;
    name: string;
    phoneNumber: string;
    lounge: string;
    space: string;
    date: string;
    time: string;
    duration: string;
    person: string;
};

export const useReservation = () => {
  const { id } = useParams();

  const [reservations, setReservations] = useState<Reservation[]>([]);
const [reservationDetail, setReservationDetail] = useState<Reservation>({
    _id: "",
    name: "",
    phoneNumber: "",
    lounge: "",
    space: "",
    date: "",
    time: "",
    duration: "",
    person: "",
});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch reservations from API
  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/reservation');
      setReservations(response.data.reserves);
    } catch (err) {
      setError('Failed to fetch reservations.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new reservation
  const addReservation = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuccess('Reservation successfully added!');
          await fetchReservations(); // Refresh reservations list
          return true;
        } else {
          setError(result.msg || 'Failed to add reservation.');
        }
      } else {
        setError('Failed to add reservation.');
      }
    } catch (err) {
      setError('Network error occurred.');
    } finally {
      setLoading(false);
    }
    return false;
  };

    useEffect(() => {
        if (!id) return;
    
        const fetchReservationDetail = async () => {
        try {
            const res = await fetch(`/api/reservation/${id}`, {
            method: "GET",
            });
            if (!res.ok) throw new Error("Gagal mengambil data blog");
    
            const responseData: Reservation = await res.json();
            setReservationDetail(responseData);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
        };
    
        fetchReservationDetail();
    }, [id]);

  useEffect(() => {
    fetchReservations();
  }, []);

   const deleteReservation = async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.delete('/api/reservation', {
          params: { id },
        });
  
        if (response.status === 200) {
          setSuccess('Reservation successfully deleted!');
          await fetchReservations(); // Refresh blogs list
          return true;
        } else {
          setError('Failed to delete Reservation.');
        }
      } catch (err) {
        setError('Network error occurred.');
      } finally {
        setLoading(false);
      }
      return false;
    };

  return {
    reservations,
    loading,
    error,
    success,
    reservationDetail,
    setError,
    setSuccess,
    fetchReservations,
    addReservation,
    deleteReservation
  };
};
