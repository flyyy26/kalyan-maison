"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import axios from 'axios';

// Definisi tipe data Analytics
interface AnalyticsData {
  _id: string;
  count: number;
  page: string;
  timestamp: number;
  userAgent: string;
}

export function useAnalytics() {
  const pathname = usePathname();
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const hasTracked = useRef(false); // Gunakan useRef untuk melacak apakah kunjungan sudah dicatat

  // Fungsi untuk mencatat kunjungan
  const trackVisit = async () => {
    try {
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pathname }),
        cache: 'no-store'
      });
    } catch (error) {
      console.error("Error tracking visit", error);
    }
  };

  useEffect(() => {
    if (!hasTracked.current) {
      trackVisit();
      hasTracked.current = true; // Tandai bahwa kunjungan sudah dicatat
    }
  }, [pathname]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/analytics');
      setAnalytics(response.data.analytics);
    } catch (err) {
      setError('Failed to fetch analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    analytics,
    setAnalytics,
    loading,
    error,
    success,
  };
}