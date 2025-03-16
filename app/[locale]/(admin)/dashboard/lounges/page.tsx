'use client';

import Image from 'next/image';
import { useLounge } from '@/hooks/useLounge';
import styles from '@/app/[locale]/style/form.module.css'
import { Link } from '@/i18n/routing';
import { GoTrash } from "react-icons/go";
import { FiEdit2 } from "react-icons/fi";
import { useState } from 'react';

export default function LoungeForm() {
  const {
    lounges,
    deleteLounge,
  } = useLounge();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedLoungeId, setSelectedLoungeId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (loungeId: string) => {
    setSelectedLoungeId(loungeId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedLoungeId) {
      setIsDeleting(true); // ✅ Aktifkan loading di tombol Yes
      const success = await deleteLounge(selectedLoungeId); // Pastikan fungsi ini mengembalikan status berhasil/tidak

      if (success) {
        setShowConfirm(false); // ✅ Tutup popup hanya jika sukses
        setSelectedLoungeId(null);
      }
      setIsDeleting(false); // ✅ Matikan loading setelah selesai
    }
  };

  return (
    <>
   
   <div className={`
      ${styles.blog_form_container} 
      ${styles.blog_form_container_index} 
      ${lounges.length > 2 ? styles.blog_form_container_index_active : ''}
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
              <th>Banner</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {lounges.length > 0 ? (
              lounges.map((lounge, index) => (
                <tr key={lounge._id}>
                  <td style={{textAlign: 'center'}}>{index + 1}</td>
                  <td style={{textAlign: 'center'}}>{lounge.name}</td>
                  <td style={{textAlign: 'center', width:'30%'}}>{lounge.address || "kosong"}</td>
                  <td style={{textAlign: 'center'}}>{lounge.phone || "kosong"}</td>
                  <td style={{textAlign: 'center'}}>
                    <Image
                      width="100"
                      height="100"
                      src={`http://localhost:3000${lounge.banner}`}
                      alt={lounge.name}
                      className="lounge-image"
                    />
                  </td>
                  <td style={{padding: '0'}}>
                    <div className={styles.btn_action}>
                      <Link href={`/dashboard/lounges/edit/${lounge._id}`}>
                        <button className={styles.btn_edit}><FiEdit2/></button>
                      </Link>
                      <button
                        className={styles.btn_delete}
                        onClick={() => handleDeleteClick(lounge._id)}
                      >
                        <GoTrash/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={{textAlign: 'center'}} colSpan={6}>Tidak ada lounge tersedia.</td>
              </tr>
            )}
          </tbody>
        </table>
    </div>

    {showConfirm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <p>Apakah anda yakin untuk menghapus lounge?</p>
            <div className={styles.flex_center}>
              <button className={styles.btn_primary} onClick={confirmDelete} disabled={isDeleting} >
                {isDeleting ? 'Menghapus...' : 'Hapus Lounge'}
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
