'use client';

import Navbar from "@/components/navbar_dashboard/page";
import Footer from "@/components/Footer/page";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function AdminPageLayout({ children }: { children: React.ReactNode }) {
  const [adminData, setAdminData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
    const locale = params?.locale || 'id'; 

  useEffect(() => {
    const adminData = localStorage.getItem('adminAuthenticated');

    if (!adminData) {
      router.push(`/${locale}/login`);
    } else {
      setAdminData(adminData);
    }

    setIsLoading(false);
  }, [router, locale]);

  if (isLoading) {
    return <p>Memuat...</p>;
  }

  if (!adminData) {
    return null; // Untuk memastikan tidak ada render lain saat diarahkan ke login
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
