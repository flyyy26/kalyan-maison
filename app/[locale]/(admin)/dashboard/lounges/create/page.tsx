'use client'
import { useState, useRef, useEffect  } from 'react';
import { useBlog } from '@/hooks/useBlog';
import styles from '@/app/[locale]/style/form.module.css'
import { PiImageThin } from "react-icons/pi";
import { AiOutlineRollback } from "react-icons/ai";
import { Link } from '@/i18n/routing';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useMedia } from '@/hooks/useMedia';
import { HiChevronDown } from "react-icons/hi2";

export default function CreateLounge(){
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale || 'id'; 
    const {
        loading,
        error,
        success,
        setError,
        setSuccess,
        setLoading,
        addBlog,
      } = useBlog();

    const {
      media,
    //   addMedia,
      deleteMedia
    } = useMedia();

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionEn, setDescriptionEn] = useState('');
    const [author, setAuthor] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
    const [uploading] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
    const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const buttonRef = useRef<HTMLButtonElement | null>(null); // Ref untuk tombol

    const createSlug = (text: string) => {
        return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter khusus
        .trim() // Hapus spasi di awal/akhir
        .replace(/\s+/g, '-'); // Ganti spasi dengan tanda hubung
    };
    
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setSlug(createSlug(newTitle)); // Buat slug otomatis dari judul
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
        setImage(selectedFile);
        setPreview(URL.createObjectURL(selectedFile)); // Buat preview gambar
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setDragActive(false);

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
        setImage(droppedFile);
        setPreview(URL.createObjectURL(droppedFile)); // Buat preview gambar
        }
    };

    // const openMediaLibrary = () => setIsMediaLibraryOpen(true);
    const closeMediaLibrary = () => setIsMediaLibraryOpen(false);

    const insertImageToEditor = (imagePath: string) => {
      console.log("Image Path:", imagePath); // Cek di Console apakah path sudah benar
      const editor = typeof window !== "undefined" ? window.tinymce?.EditorManager.get("description") : null;
      if (editor) {
        editor.insertContent(`<Image width={800} height={800} priority src="${imagePath}" alt="Selected Image" />`);
      }
    
      closeMediaLibrary();
    };    
    
    const deleteImage = async (imageId: string) => {
      setDeletingImageId(imageId);
      try {
        await deleteMedia(imageId);
      } catch (error) {
        console.error("Failed to delete image:", error);
      } finally {
        setDeletingImageId(null);
      }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
    
      setSelectedFile(file);
    };    
    

    // const handleUpload = async () => {
    
    //   if (!selectedFile) {
    //     alert("Pilih gambar terlebih dahulu!");
    //     return;
    //   }
    
    //   setUploading(true);
    
    //   const formData = new FormData();
    //   formData.append("image", selectedFile);
    //   formData.append("link", `http://localhost:3000`);
    
    //   try {
    //     const success = await addMedia(formData);
    
    //     if (success) {
          
    //       setSelectedFile(null);
    //     } else {
    //       console.error("Error: Upload gagal");
    //     }
    //   } catch (error) {
    //     console.error("Gagal mengupload gambar:", error);
    //   } finally {
    //     setUploading(false);
    //   }
    // };    

    const handleSubmitMedia = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault(); // Mencegah reload halaman
    
      if (!selectedFile) {
        console.error("Tidak ada file yang dipilih.");
        return;
      }
    };
    

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      
      setError(null);
      setSuccess(null);
  
      // 🔍 **Validasi Form**
      if (!title || !slug || !description || !descriptionEn || !author || !image) {
          setError('⚠️ Semua kolom harus diisi!');
          return;
      }
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('description', description);
      formData.append('descriptionEn', descriptionEn);
      formData.append('image', image);
      formData.append('author', author);
      formData.append('tags', JSON.stringify(tags));
  
      setLoading(true);
  
      try {
          const success = await addBlog(formData);
          if (success) {
              setSuccess('✅ Blog berhasil ditambahkan!');
              setTitle('');
              setSlug('');
              setDescription('');
              setDescriptionEn('');
              setAuthor('');
              setImage(null);
              setTags([]);
  
              router.push(`/${locale}/dashboard/blog`);
          } else {
              setError('⚠️ Gagal menambahkan blog.');
          }
      } catch {
          setError('⚠️ Terjadi kesalahan jaringan.');
      } finally {
          setLoading(false);
      }
  };

    const toggleDropdown = (id: string) => {
        setOpenDropdowns((prev) => ({
        ...prev,
        [id]: !prev[id], // Toggle visibility for the specific dropdown
        }));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          // Gunakan setTimeout untuk menunggu onClick selesai dulu
          setTimeout(() => {
            if (
              buttonRef.current && buttonRef.current.contains(event.target as Node) // Cegah tombol menutup dirinya sendiri
            ) {
              return;
            }
    
            let clickedInside = false;
            Object.values(dropdownRefs.current).forEach((dropdown) => {
              if (dropdown && dropdown.contains(event.target as Node)) {
                clickedInside = true;
              }
            });
    
            if (!clickedInside) {
              setOpenDropdowns({});
            }
          }, 10);
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);
  

    return(
        <div className={`${styles.blog_form_container}`}>
        <Link href={`/dashboard/blog`}>
            <button className={styles.back_button}>
                <AiOutlineRollback/>
            </button>
        </Link>
        <h2>Add Lounge</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.form_single}>
            <label
              htmlFor="image"
              className={`${styles.dropzone} ${dragActive ? styles.active : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {image ? (
                <Image width={800} height={800} src={preview || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
              ) : (
                <>
                  <p>Lounge Banner</p>
                  <PiImageThin />
                  <p>Drag & Drop file here or click to upload</p>
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
          <div className={styles.form_double}>
            <div className={styles.form_single}>
              <label htmlFor="name">Lounge Name</label>
              <input
                type="text"
                id="name"
                // value={name}
                onChange={handleTitleChange}
                required
                placeholder="Enter lounge name"
              />
            </div>
            <div className={styles.form_single}>
                <label htmlFor="city">Lounge City</label>
                <div className={`${styles.dropdown} ${openDropdowns["menu1"] ? styles.dropdown_active : ""}`}>
                    <button ref={buttonRef} type="button" onClick={() => toggleDropdown("menu1")}>
                        Enter Lounge City <HiChevronDown />
                    </button>
                    {openDropdowns["menu1"] && (
                    <div
                        ref={(el) => {
                            dropdownRefs.current["menu1"] = el;
                        }}
                        className={`${styles.dropdown_menu} ${styles.dropdown_menu_bottom} ${openDropdowns["menu1"] ? styles.dropdown_menu_show : ""}`}
                    >
                        <button type="button">Gunawarman</button>
                        <button type="button">Kemang</button>
                        <button type="button">Sudirman</button>
                        <button type="button">+Add More City</button>
                    </div>
                    )}
                </div>
            </div>
          </div>
          <div className={styles.form_double}>
            <div className={styles.form_single}>
              <label htmlFor="phone">Lounge Phone</label>
              <input
                type="text"
                id="phone"
                // value={phone}
                onChange={handleTitleChange}
                required
                placeholder="Enter lounge phone"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="address">Lounge Address</label>
              <input
                type="text"
                id="address"
                // value={address}
                onChange={handleTitleChange}
                required
                placeholder="Enter lounge address"
              />
            </div>
          </div>
          <div className={styles.form_double}>
            <div className={styles.form_single}>
              <label htmlFor="taglineId">Tagline ID</label>
              <input
                type="text"
                id="taglineId"
                // value={phone}
                onChange={handleTitleChange}
                required
                placeholder="Enter tagline id"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="taglineEn">Tagline EN</label>
              <input
                type="text"
                id="taglineEn"
                // value={address}
                onChange={handleTitleChange}
                required
                placeholder="Enter tagline en"
              />
            </div>
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
                <Image width={800} height={800} src={preview || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
              ) : (
                <>
                  <p>Tagline Banner</p>
                  <PiImageThin />
                  <p>Drag & Drop file here or click to upload</p>
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
            <label htmlFor="menu">Lounge Image Slide</label>
            <div className={styles.form_double}>
                <div className={styles.form_single}>
                    <label
                        htmlFor="image"
                        className={`${styles.dropzone_small} ${dragActive ? styles.active : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        >
                        {image ? (
                            <Image width={800} height={800} src={preview || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
                        ) : (
                            <>
                            <p>Upload Image</p>
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
                    <input
                        type="text"
                        id="taglineEn"
                        // value={address}
                        onChange={handleTitleChange}
                        required
                        placeholder="Enter image slide title"
                    />
                </div>
            </div>
            <button type='button' className={`${styles.btn_primary} ${styles.btn_primary_full}`}>Add More Menu</button>
          </div>
          <div className={styles.form_single}>
            <label htmlFor="menu">Lounge Menu</label>
            <div className={styles.form_third}>
                <div className={styles.form_single}>
                    <label
                        htmlFor="image"
                        className={`${styles.dropzone_small} ${dragActive ? styles.active : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        >
                        {image ? (
                            <Image width={800} height={800} src={preview || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
                        ) : (
                            <>
                            <p>Upload Image</p>
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
                    <input
                        type="text"
                        id="taglineEn"
                        // value={address}
                        onChange={handleTitleChange}
                        required
                        placeholder="Enter menu name"
                    />
                </div>
                <div className={styles.form_single}>
                    <input
                        type="text"
                        id="taglineEn"
                        // value={address}
                        onChange={handleTitleChange}
                        required
                        placeholder="Enter menu description"
                    />
                </div>
            </div>
            <button type='button' className={`${styles.btn_primary} ${styles.btn_primary_full}`}>Add More Menu</button>
          </div>
          <div className={styles.form_single}>
            <label htmlFor="menu">Lounge Spaces</label>
            <div className={styles.form_double}>
                <div className={styles.form_single}>
                    <label
                        htmlFor="image"
                        className={`${styles.dropzone_small} ${dragActive ? styles.active : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        >
                        {image ? (
                            <Image width={800} height={800} src={preview || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
                        ) : (
                            <>
                            <p>Upload Image</p>
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
                    <input
                        type="text"
                        id="taglineEn"
                        // value={address}
                        onChange={handleTitleChange}
                        required
                        placeholder="Enter lounge spaces name"
                    />
                </div>
            </div>
            <button type='button' className={`${styles.btn_primary} ${styles.btn_primary_full}`}>Add More Spaces</button>
          </div>
          <button type="submit" disabled={loading} className={styles.btn_primary}>
            {loading ? 'Saving...' : 'Save Lounge'}
          </button>
          <input
            type="text"
            id="slug"
            value={slug}
            style={{display: 'none'}}
            readOnly // Slug hanya dibaca, dibuat otomatis
          />
        </form>
        <div className={styles.notif_form}>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: '#FF4646' }}>{error}</p>}
          {success && <p style={{ color: '#26FF00' }}>{success}</p>}
        </div>

        {isMediaLibraryOpen && (
        <div className={styles.mediaLibraryPopup}>
          <form onSubmit={handleSubmitMedia}>
            <div className={styles.mediaLibraryContent}>
              <button className={styles.closeButton} onClick={closeMediaLibrary}>
                ✖
              </button>
              <h3>Pilih Gambar</h3>

              {/* Tombol Upload */}
              <div className={styles.uploadContainer}>
                <label className={styles.uploadButton}>
                  📤 {uploading ? "⏳ Mengupload..." : "Upload Gambar"}
                  <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                </label>
                {selectedFile && <p>📁 {selectedFile.name}</p>}
              </div>


              {/* Daftar gambar yang tersedia */}
              <div className={styles.imageGrid}>
                {media.length > 0 ? (
                  media.map((img) => (
                    <div key={img._id} className={styles.imageItem}>
                        <Image priority width={800} height={800} src={img.image || "/fallback.jpg"} alt={`Image ${img._id}`} style={{objectFit: 'cover'}} />
                        <div className={styles.imageActions}>
                          <button onClick={() => insertImageToEditor(img.image)}>✔ Pilih</button>
                          <button onClick={() => deleteImage(img._id)} disabled={deletingImageId === img._id}>
                            {deletingImageId === img._id ? "⏳ Menghapus..." : "🗑 Hapus"}
                          </button>
                        </div>
                    </div>
                  ))
                ) : (
                  <p>Tidak ada gambar tersedia.</p>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
      </div>
    );
}