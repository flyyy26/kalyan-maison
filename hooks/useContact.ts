'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from "next/navigation";

type Contact = {
  _id: string;
  instagram: string;
  facebook:string;
  tiktok:string;
  whatsapp:string;
};

export const useContact = () => {
  const { id } = useParams();
  const router = useRouter();

  const [contacts, setContacts] = useState<Contact>({
    _id: "",
    instagram: "",
    facebook:"",
    tiktok:"",
    whatsapp:"",
  });
  const [ContactDetail, setContactsDetail] = useState<Contact>({
    _id: "",
    instagram: "",
    facebook:"",
    tiktok:"",
    whatsapp:"",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch lounges from API
  const fetchContact = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/contact');
      setContacts(response.data.data);
    } catch (err) {
      setError('Failed to fetch contacts.');
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (id: string, formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/contact/67d680385affe265e192668d`, {
        method: "PUT",
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSuccess("Contact updated successfully!");
  
          // Perbarui state loungeDetail setelah berhasil update
          updateContactDetail(result.updateContact);
  
          await fetchContact(); // Jika perlu memperbarui daftar lounge
          return true;
        } else {
          setError(result.msg || "Failed to update contact.");
        }
      } else {
        setError("Failed to update contact.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
    return false;
  };  

  const updateContactDetail = (updatedFields: Partial<Contact>) => {
    setContactsDetail((prev) => ({ ...prev, ...updatedFields }));
  };  

useEffect(() => {
    const fetchContactDetail = async () => {
      try {
        const res = await fetch(`/api/contact/67d680385affe265e192668d`, {
          method: "GET",
        });
        if (!res.ok) throw new Error("Gagal mengambil data blog");
  
        const responseData: Contact = await res.json();
        setContactsDetail(responseData);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchContactDetail();
  }, []);

  useEffect(() => {
    fetchContact();
  }, []);

  return {
    contacts,
    loading,
    error,
    success,
    ContactDetail,
    setError,
    setSuccess,
    updateContactDetail,
    setContactsDetail,
    setLoading,
    fetchContact,
    updateContact,
    setContacts,
  };
}

export default useContact