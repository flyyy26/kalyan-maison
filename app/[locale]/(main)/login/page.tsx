'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import style from '@/app/[locale]/style/reservation.module.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Simpan data autentikasi di localStorage
        localStorage.setItem('adminAuthenticated', JSON.stringify(data));

        // Redirect ke dashboard
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login gagal. Periksa kredensial Anda.');
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${style.reservation_layout} ${style.login_layout}`}
      style={{ backgroundSize: 'cover' }}
    >
      <div className={style.reservation_content}>
        <h1>Admin Login</h1>
      </div>
      <div className={style.reservation_form}>
        <form onSubmit={handleSubmit}>
          <div className={style.form_double}>
            <div className={style.form_single}>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
            <div className={style.form_single}>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
          </div>
          <button
            className={style.btn_primary}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
          {error && (
            <p className={style.error} aria-live="polite">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
