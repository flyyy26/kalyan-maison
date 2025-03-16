// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// interface Admin {
//   id: number;
//   username: string;
//   email: string;
//   role: string;
// }

// export default function DashboardPage() {
//   const [admin, setAdmin] = useState<Admin | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const adminData = localStorage.getItem('adminAuthenticated');
//     if (adminData) {
//       try {
//         const parsedAdmin = JSON.parse(adminData); // Parsing JSON
//         setAdmin(parsedAdmin as Admin);
//       } catch (error) {
//         console.error('Error parsing admin data:', error);
//         localStorage.removeItem('adminAuthenticated');
//         router.push('/login');
//       }
//     } else {
//       router.push('/login');
//     }
//     setLoading(false);
//   }, [router]);

//   const handleLogout = () => {
//     localStorage.removeItem('adminAuthenticated');
//     router.push('/login');
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (!admin) {
//     return null; // Render kosong jika admin data tidak ada
//   }

//   return (
//     <div className="dashboard-container">
//       <h2>Selamat Datang, {admin.username}</h2>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// } 

'use client'

import { useState, useEffect } from 'react';
import { useBlog } from '@/hooks/useBlog';
import styles from '@/app/[locale]/style/form.module.css'
import { useRouter, useParams } from 'next/navigation';

interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function DashboardPage(){
  const params = useParams();
  const locale = params?.locale || 'id'; 
    const {
        setLoading,
      } = useBlog();
    const [admin, setAdmin] = useState<Admin | null>(null);
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
            router.push(`/${locale}/login`);
          }
        } else {
          router.push(`/${locale}/login`);
        }
        setLoading(false);
      }, [router, locale, setLoading]);

      const handleLogout = () => {
        localStorage.removeItem('adminAuthenticated');
        router.push(`/${locale}/login`);
      };

    if (!admin) {
      return null; // Render kosong jika admin data tidak ada
    }
  

    return(
        <div className={`${styles.blog_form_container}`} style={{height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <h2 style={{marginBottom: '1vw'}}>Selamat Datang, {admin.username}</h2>
          <div className={styles.btn_center}>
            <button className={styles.btn_primary} onClick={handleLogout}>Logout</button>
          </div>
          {/* <div className={styles.form_container}>
            <h3>Background Image Webpage :</h3>
            <form onSubmit={handleSubmit} style={{marginTop: '2vw'}}>
              <div className={`${styles.form_double} ${styles.form_third}`}>
                <div className={styles.form_single}>
                  <label
                    htmlFor="image"
                    className={`${styles.dropzone} ${dragActive ? styles.active : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {image ? ( 
                        <>
                          <Image width={800} height={800} src={preview || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
                        </>
                    ) : (
                      <>
                        <p>Home Page Main Banner</p>
                        <PiImageThin />
                        <p style={{fontSize: '.8vw'}}>Drag & Drop file here or click to upload</p>
                      </>
                    )}
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={styles.file_input}
                      required
                    />
                  </label>
                </div>
                <div className={styles.form_single}>
                  <label
                    htmlFor="image"
                    className={`${styles.dropzone} ${dragActive ? styles.active : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {image ? (
                        <>
                          <Image width={800} height={800} src={preview || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
                        </>
                    ) : (
                      <>
                        <p>Section 2 Homepage Background</p>
                        <PiImageThin />
                        <p style={{fontSize: '.8vw'}}>Drag & Drop file here or click to upload</p>
                      </>
                    )}
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={styles.file_input}
                      required
                    />
                  </label>
                </div>
                <div className={styles.form_single}>
                  <label
                    htmlFor="image"
                    className={`${styles.dropzone} ${dragActive ? styles.active : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {image ? (
                        <>
                          <Image width={800} height={800} src={preview || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
                        </>
                    ) : (
                      <>
                        <p>All Lounge Page Main Banner</p>
                        <PiImageThin />
                        <p style={{fontSize: '.8vw'}}>Drag & Drop file here or click to upload</p>
                      </>
                    )}
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={styles.file_input}
                      required
                    />
                  </label>
                </div>
              </div>
            </form>
          </div> */}
      </div>
    );
}