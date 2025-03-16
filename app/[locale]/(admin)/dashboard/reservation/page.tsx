'use client';

import styles from '@/app/[locale]/style/form.module.css'
import { GoTrash } from "react-icons/go";
import { useState } from 'react';
import { useReservation } from '@/hooks/useReservation';

export default function ReservationForm() {
  const {
    reservations,
    deleteReservation,
  } = useReservation();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedReserveId, setSelectedReserveId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (blogId: string) => {
    setSelectedReserveId(blogId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedReserveId) {
      setIsDeleting(true); // ✅ Aktifkan loading di tombol Yes
      const success = await deleteReservation(selectedReserveId); // Pastikan fungsi ini mengembalikan status berhasil/tidak

      if (success) {
        setShowConfirm(false); // ✅ Tutup popup hanya jika sukses
        setSelectedReserveId(null);
      }
      setIsDeleting(false); // ✅ Matikan loading setelah selesai
    }
  };

  return (
    <>
   
   <div className={`
      ${styles.blog_form_container} 
      ${styles.blog_form_container_index} 
      ${reservations.length > 6 ? styles.blog_form_container_index_active : ''}
    `}>
        <div className={styles.blog_form_heading}>
          <h2>Reservation List</h2>
        </div>
        <table className={styles.blog_table}>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Lounge</th>
              <th>Duration</th>
              <th>Date</th>
              <th>Person</th>
              <th>Space</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations && reservations.length > 0 ? (
              reservations.map((reservation, index) => (
                <tr key={reservation._id}>
                  <td style={{textAlign: 'center'}}>{index + 1}</td>
                  <td>{reservation.name}</td>
                  <td style={{textAlign: 'center'}}>{reservation.phoneNumber}</td>
                  <td>{reservation.lounge}</td>
                  <td>{reservation.duration}</td>
                  <td>{reservation.date}</td>
                  <td>{reservation.person}</td>
                  <td>{reservation.space}</td>
                  <td>{reservation.time}</td>
                  <td style={{padding: '0'}}>
                    <div className={styles.btn_action}>
                      <button
                        className={styles.btn_delete}
                        onClick={() => handleDeleteClick(reservation._id)}
                      >
                        <GoTrash/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={{textAlign: 'center'}} colSpan={10}>No reservation available.</td>
              </tr>
            )}
          </tbody>
        </table>
    </div>

    {showConfirm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <p>Are you sure you want to delete your reservation?</p>
            <div className={styles.flex_center}>
              <button className={styles.btn_primary} onClick={confirmDelete} disabled={isDeleting} >
                {isDeleting ? 'Deleting...' : 'Delete Reservation'}
              </button>
              <button className={styles.btn_primary} onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
  </>
  );
}
