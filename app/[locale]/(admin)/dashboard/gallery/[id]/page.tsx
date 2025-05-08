'use client'
import { useState, useEffect  } from 'react';
import styles from '@/app/[locale]/style/form.module.css'
import { AiOutlineRollback } from "react-icons/ai";
import { Link } from '@/i18n/routing';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import useGallery from '@/hooks/useGallery';

export default function EditGallery(){
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale || 'id'; 
    const {
        loading,
        error,
        success,
        galleriesDetail,
        setError,
        setSuccess,
        setLoading,
        updateGallery,
      } = useGallery();

    const [imageGallery, setImageGallery] = useState<(string | File)[]>([]);
    const [videoGallery, setVideoGallery] = useState<(string | File)[]>([]);
    
    useEffect(() => {
      if (galleriesDetail?.imageGallery?.length) {
        setImageGallery(galleriesDetail.imageGallery); // langsung array of string
      }
    }, [galleriesDetail.imageGallery]);
    
    const handleImageGallery = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = event.target.files?.[0];
      if (!file) return;
    
      setImageGallery(prevMenu => {
        const updated = [...prevMenu];
        updated[index] = file; // simpan File bukan URL
        return updated;
      });
    };    
    
    const addMoreImageGallery = () => {
      setImageGallery(prevMenu => [...prevMenu, ""]);
    };
    
    const removeImageGallery = (index: number) => {
      setImageGallery(prevMenu => prevMenu.filter((_, i) => i !== index));
    };

    useEffect(() => {
      if (galleriesDetail?.videoGallery?.length) {
        setVideoGallery(galleriesDetail.videoGallery);
      }
    }, [galleriesDetail.videoGallery]);
    
    const handleVideoGallery = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = event.target.files?.[0];
      if (!file) return;
    
      setVideoGallery(prevMenu => {
        const updated = [...prevMenu];
        updated[index] = file;
        return updated;
      });
    };
    
    const addMoreVideoGallery = () => {
      setVideoGallery(prevMenu => [...prevMenu, ""]); // Tambah slot kosong (string kosong)
    };
    
    const removeVideoGalery = (index: number) => {
      setVideoGallery(prevMenu => prevMenu.filter((_, i) => i !== index));
    };


    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
    
      const galleryId = galleriesDetail?._id;
    
      setError(null);
      setSuccess(null);
      setLoading(true);
    
      try {
        const formData = new FormData();
        formData.append("_id", galleryId);
    
        // menuImages
        const finalImageGallery = imageGallery.map((item, i) =>
          item instanceof File ? `__file__${i}` : item
        );
        formData.append("imageGallery", JSON.stringify(finalImageGallery));

        imageGallery.forEach((item) => {
          if (item instanceof File) {
            formData.append("imageGalleries", item);
          }
        });

        // videoGallery
        const finalVideoGallery = videoGallery.map((item, i) =>
          item instanceof File ? `__file__${i}` : item
        );
        formData.append("videoGallery", JSON.stringify(finalVideoGallery));

        videoGallery.forEach((item) => {
          if (item instanceof File) {
            formData.append("videoGalleries", item);
          }
        });
      
    
        // Kirim ke endpoint PUT
        const success = await updateGallery(galleryId, formData);
    
        if (success) {
          router.push(`/${locale}/dashboard/`);
        } else {
          setError("⚠️ Gagal memperbarui lounge.");
        }
      } catch (err) {
        console.error(err);
        setError("⚠️ Terjadi kesalahan jaringan.");
      } finally {
        setLoading(false);
      }
    };
  

    return(
        <div className={`${styles.blog_form_container}`}>
        <Link href={`/dashboard/lounges`}>
            <button className={styles.back_button}>
                <AiOutlineRollback/>
            </button>
        </Link>
        <h2>Edit Gallery</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.form_single}>
            <label htmlFor="menu">Image</label>
            {imageGallery.map((menu, index) => (
              <div key={index} className={`${styles.form_single}`}>
                {/* Input Gambar */}
                <div className={styles.form_single}>
                  <label
                    htmlFor={`imageGallery-${index}`}
                    className={`${styles.dropzone_small} ${menu ? styles.active : ""}`}

                  >
                    {menu ? (
                      <Image
                        width={800}
                        height={800}
                        src={
                          typeof menu === "string"
                            ? menu // URL dari server
                            : URL.createObjectURL(menu) // File baru
                        }
                        alt="Preview"
                        className={styles.previewImage}
                      />
                    ) : (
                      <p>Upload Image</p>
                    )}
                    <input
                      type="file"
                      id={`imageGallery-${index}`}
                      accept="image/*"
                      onChange={(e) => handleImageGallery(e, index)}
                      className={styles.file_input}
                    />
                  </label>
                </div>
                {/* Tombol Hapus */}
                <button onClick={() => removeImageGallery(index)} className={styles.delete_button}>
                        ❌
                </button>
                
              </div>
            ))}
            <button
              type="button"
              className={`${styles.btn_primary} ${styles.btn_primary_full}`}
              onClick={addMoreImageGallery}
            >
              + Add More Image
            </button>
          </div>

          <div className={styles.form_single}>
            <label htmlFor="videoGallery">Video</label>
            {videoGallery.map((menu, index) => (
                <div key={index} className={styles.form_single}>
                    <div className={styles.form_single}>
                    <label
                        htmlFor={`videoGallery-${index}`}
                        className={`${styles.dropzone_small} ${menu ? styles.active : ''}`}
                    >
                        {menu ? (
                        <video
                            controls
                            className={styles.previewImage}
                        >
                            <source
                            src={
                                typeof menu === 'string'
                                ? menu // existing video URL
                                : URL.createObjectURL(menu) // new uploaded file
                            }
                            />
                            Your browser does not support the video tag.
                        </video>
                        ) : (
                        <p>Upload Video</p>
                        )}
                        <input
                        type="file"
                        id={`videoGallery-${index}`}
                        accept="video/*"
                        onChange={(e) => handleVideoGallery(e, index)}
                        className={styles.file_input}
                        />
                    </label>
                    </div>
                    <button
                    type="button"
                    onClick={() => removeVideoGalery(index)}
                    className={styles.delete_button}
                    >
                    ❌
                    </button>
                </div>
            ))}
            <button
              type="button"
              className={`${styles.btn_primary} ${styles.btn_primary_full}`}
              onClick={addMoreVideoGallery}
            >
              + Add More Video
            </button>
          </div>

          <button type="submit" onClick={handleSubmit} disabled={loading} className={styles.btn_primary}>
            {loading ? 'Saving...' : 'Save Lounge'}
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