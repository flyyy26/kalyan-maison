'use client';

import Image from 'next/image';
import { useBlog } from '@/hooks/useBlog';
import styles from '@/app/[locale]/style/form.module.css'
import { Link } from '@/i18n/routing';
import { GoTrash } from "react-icons/go";
import { FiEdit2 } from "react-icons/fi";
import { useState } from 'react';

export default function LoungeForm() {
  const {
    blogs,
    deleteBlog,
  } = useBlog();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (blogId: string) => {
    setSelectedBlogId(blogId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedBlogId) {
      setIsDeleting(true); // ✅ Aktifkan loading di tombol Yes
      const success = await deleteBlog(selectedBlogId); // Pastikan fungsi ini mengembalikan status berhasil/tidak

      if (success) {
        setShowConfirm(false); // ✅ Tutup popup hanya jika sukses
        setSelectedBlogId(null);
      }
      setIsDeleting(false); // ✅ Matikan loading setelah selesai
    }
  };

  return (
    <>
   
   <div className={`
      ${styles.blog_form_container} 
      ${styles.blog_form_container_index} 
      ${blogs.length > 2 ? styles.blog_form_container_index_active : ''}
    `}>
        <div className={styles.blog_form_heading}>
          <h2>Lounge List</h2>
          <Link href={`/dashboard/lounges/create`}>
            <button
              className={styles.btn_primary}
            >
              Add Lounge
            </button>
          </Link>
        </div>
        <table className={styles.blog_table}>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>City</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <tr key={blog._id}>
                  <td>{index + 1}</td>
                  <td>{blog.title}</td>
                  <td>{blog.titleEn}</td>
                  <td style={{textAlign: 'center'}}>{blog.author}</td>
                  <td style={{textAlign: 'center'}}>
                    <Image
                      width="100"
                      height="100"
                      src={`http://localhost:3000${blog.image}`}
                      alt={blog.title}
                      className="blog-image"
                    />
                  </td>
                  <td style={{padding: '0'}}>
                    <div className={styles.btn_action}>
                      <Link href={`/dashboard/blog/edit/${blog._id}`}>
                        <button className={styles.btn_edit}><FiEdit2/></button>
                      </Link>
                      <button
                        className={styles.btn_delete}
                        onClick={() => handleDeleteClick(blog._id)}
                      >
                        <GoTrash/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={{textAlign: 'center'}} colSpan={6}>Tidak ada blog tersedia.</td>
              </tr>
            )}
          </tbody>
        </table>
    </div>

    {showConfirm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <p>Apakah anda yakin untuk menghapus blog?</p>
            <div className={styles.flex_center}>
              <button className={styles.btn_primary} onClick={confirmDelete} disabled={isDeleting} >
                {isDeleting ? 'Menghapus...' : 'Hapus Blog'}
              </button>
              <button className={styles.btn_primary} onClick={() => setShowConfirm(false)}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
  </>
  );
}
