"use client"; // Pastikan ini ada di baris pertama!

import { useState, useEffect } from "react";
import { useBlog } from "@/hooks/useBlog";
import { useAnalytics } from "@/hooks/useAnalytics";
import styles from "@/app/[locale]/style/form.module.css";
import { useRouter, useParams } from "next/navigation";

interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const params = useParams();
  const locale = params?.locale || "id";
  const { setLoading, blogs } = useBlog();
  const { analytics } = useAnalytics();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const router = useRouter();

  useEffect(() => {
    const adminData = localStorage.getItem("adminAuthenticated");
    if (adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        setAdmin(parsedAdmin as Admin);
      } catch (error) {
        console.error("Error parsing admin data:", error);
        localStorage.removeItem("adminAuthenticated");
        router.push(`/${locale}/login`);
      }
    } else {
      router.push(`/${locale}/login`);
    }
    setLoading(false);
  }, [router, locale, setLoading]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    router.push(`/${locale}/login`);
  };

  if (analytics.length === 0) return <p>Loading...</p>;

  if (!admin) {
    return null;
  }

  // Hitung total kunjungan
  const totalVisits = analytics.reduce((acc, item) => acc + item.count, 0);

  const totalBlogVisitors = blogs.reduce((acc, blog) => acc + blog.visitCount, 0);

  const uniqueUserAgents = new Set(analytics.map(item => item.userAgent));
  const totalUniqueVisitors = uniqueUserAgents.size;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Urutkan analytics berdasarkan timestamp dalam urutan menurun
  const sortedAnalytics = [...analytics].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className={`${styles.dashboard_container}`}>
      <h2 style={{ marginBottom: "1vw" }}>Welcome, {admin.username}</h2>
      <div className={styles.btn_center}>
        <button className={styles.btn_primary} onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className={styles.card_container}>
        <div className={styles.card_layout}>
          <div className={styles.card}>
            <h3>Total Visits Page</h3>
            <p>{totalVisits}</p>
          </div>
          <div className={styles.card}>
            <h3>Total User Visits</h3>
            <p>{totalUniqueVisitors}</p>
          </div>
          <div className={styles.card}>
            <h3>Total Blog Visits</h3>
            <p>{totalBlogVisitors}</p>
          </div>
        </div>
        <div className={styles.card_browser_container}>
          {sortedAnalytics.map((item) => (
            <div key={item._id} className={styles.card_browser}>
              <div className={styles.browser_page}>
                <div className={styles.browser_page_box}>
                  <h3>Page Access</h3>
                  <h1>{baseUrl}{item.page} at {formatDate(item.timestamp)}</h1>
                </div>
                <div className={styles.browser_page_box}>
                  <h3>User Agent</h3>
                  <h1>{item.userAgent}</h1>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}