'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const adminData = localStorage.getItem('adminAuthenticated');
    if (adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData); // Parsing JSON
        setAdmin(parsedAdmin as Admin);
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('adminAuthenticated');
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/login');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!admin) {
    return null; // Render kosong jika admin data tidak ada
  }

  return (
    <div className="dashboard-container">
      <h2>Selamat Datang, {admin.username}</h2>
      <p>Email: {admin.email}</p>
      <p>Role: {admin.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
