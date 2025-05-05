'use client'
import { useState } from 'react';
import { useContact } from '@/hooks/useContact';
import styles from '@/app/[locale]/style/form.module.css';

export default function EditContact() {

  const {
    ContactDetail,
    updateContact,
    setContactsDetail
  } = useContact();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ContactDetail) return;

    setContactsDetail({
      ...ContactDetail,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const contactId = ContactDetail?._id;

    setLoading(true);
    setError(null);
    setSuccess(null);

    // 🔍 **Validasi Form**
    if (!ContactDetail.facebook || !ContactDetail.instagram || !ContactDetail.tiktok || !ContactDetail.whatsapp) {
      setError("Harap isi semua bidang yang diperlukan.");
      setLoading(false);
      return; // Hentikan proses jika ada input kosong
    }

    try {
      const formData = new FormData();
      formData.append('_id', contactId);
      formData.append('facebook', ContactDetail.facebook);
      formData.append('instagram', ContactDetail.instagram);
      formData.append('tiktok', ContactDetail.tiktok);
      formData.append('whatsapp', ContactDetail.whatsapp);
      formData.append('youtube', ContactDetail.youtube);
      formData.append('email', ContactDetail.email);

      const success = await updateContact(contactId, formData);

      if (success) {
        setSuccess("Contact Succesfully Updated!");
      } else {
        setError("Gagal memperbarui kontak.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.blog_form_container}`}>
      <h2>Contact</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.form_double}>
          <div className={styles.form_single}>
            <label htmlFor="facebook">Facebook</label>
            <input
              type="text"
              id="facebook"
              name="facebook"
              value={ContactDetail.facebook || ""}
              onChange={handleChange}
              
              placeholder="Enter facebook link"
            />
          </div>
          <div className={styles.form_single}>
            <label htmlFor="instagram">Instagram</label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              value={ContactDetail.instagram || ""}
              onChange={handleChange}
              
              placeholder="Enter instagram link"
            />
          </div>
        </div>
        <div className={styles.form_double}>
          <div className={styles.form_single}>
            <label htmlFor="tiktok">Tiktok</label>
            <input
              type="text"
              id="tiktok"
              name="tiktok"
              value={ContactDetail.tiktok || ""}
              onChange={handleChange}
              
              placeholder="Enter tiktok link"
            />
          </div>
          <div className={styles.form_single}>
            <label htmlFor="whatsapp">Whatsapp</label>
            <input
              type="text"
              id="whatsapp"
              name="whatsapp"
              value={ContactDetail.whatsapp || ""}
              onChange={handleChange}
              
              placeholder="Ex : 628xxxxxxxx"
            />
          </div>
        </div>
        <div className={styles.form_double}>
          <div className={styles.form_single}>
            <label htmlFor="youtube">Youtube</label>
            <input
              type="text"
              id="youtube"
              name="youtube"
              value={ContactDetail.youtube || ""}
              onChange={handleChange}
              
              placeholder="Enter youtube link"
            />
          </div>
          <div className={styles.form_single}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={ContactDetail.email || ""}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className={styles.btn_primary}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
      <div className={styles.notif_form}>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: '#FF4646' }}>{error}</p>}
        {success && <p style={{ color: '#26FF00' }}>{success}</p>}
      </div>
    </div>
  );
}
