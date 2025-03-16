'use client'
import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useBlog } from '@/hooks/useBlog';
import styles from '@/app/[locale]/style/form.module.css'
import { AiOutlineRollback } from "react-icons/ai";
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { useMedia } from '@/hooks/useMedia';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PiImageThin } from "react-icons/pi";
import { FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { GoTrash } from "react-icons/go";


export default function EditBlogForm(){
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale || 'id'; 
    const {
        loading,
        error,
        success,
        blogDetail,
        previewImage,
        setError,
        setSuccess,
        setLoading,
        updateBlog,
        setBlogDetail,
        updateBlogDetail,
      } = useBlog();

    const {
      media,
      addMedia,
      deleteMedia
    } = useMedia();

    const [image, setImage] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
      if (!blogDetail) return;
      if (blogDetail.image instanceof File) {
        setPreview(URL.createObjectURL(blogDetail.image)); // Jika File, buat URL sementara
      } else {
        setPreview(blogDetail.image || ""); // Jika string (URL gambar), langsung gunakan
      }
    }, [blogDetail]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!blogDetail) return;
    
      setBlogDetail({
        ...blogDetail,
        [e.target.name]: e.target.value, // Update field yang diubah
      });
    };

    useEffect(() => {
        if (blogDetail?.title) {
            setBlogDetail((prevState) => ({
                ...prevState!,
                slug: blogDetail.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
            }));
        }
    }, [blogDetail?.title, setBlogDetail]);
    
    useEffect(() => {
        if (blogDetail?.titleEn) {
            setBlogDetail((prevState) => ({
                ...prevState!,
                slugEn: blogDetail.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
            }));
        }
    }, [blogDetail?.titleEn, setBlogDetail]);

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

    const openMediaLibrary = () => setIsMediaLibraryOpen(true);
    const closeMediaLibrary = () => setIsMediaLibraryOpen(false);

    const insertImageToEditor = (imagePath: string, editorId: "description" | "descriptionEn") => {
      console.log("📷 Image Path:", imagePath, "➡️ Editor:", editorId);
    
      if (typeof window !== "undefined") {
        const editor = window.tinymce?.EditorManager.get(editorId);
        if (editor) {
          editor.insertContent(`<img src="${imagePath}" width="800" height="800" alt="Selected Image"/>`);
        }
      }
    
      closeMediaLibrary(); // Tutup popup setelah memilih
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    
        setBlogDetail((prev) => ({
          ...prev,
          image: file, // ✅ Sekarang bisa menyimpan File
        }));
      }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      
      if (!selectedFile) {
        console.error("⚠️ Tidak ada selectedFile yang dipilih.");
        return;
      }
    
      console.log("✅ selectedFile dipilih:", selectedFile.name);
    
      setSelectedFile(selectedFile);
      handleUpload(selectedFile); // Langsung upload saat memilih file
    };
    
    const handleSubmitMedia = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault(); // Mencegah reload halaman
    
      if (!selectedFile) {
        console.error("Tidak ada file yang dipilih.");
        return;
      }
    
      await handleUpload(selectedFile);
    };
    
    const handleUpload = async (selectedFile: File) => {
      if (!selectedFile) {
        console.error("⚠️ Tidak ada selectedFile untuk diupload.");
        return;
      }
    
      console.log("📤 Mulai upload:", selectedFile.name);
      setUploading(true);
    
      const formData = new FormData();
      formData.append("image", selectedFile);
    
      try {
        const success = await addMedia(formData);
        
        if (success) {
          console.log("✅ Upload berhasil!");
          setSelectedFile(null);
        } else {
          console.error("❌ Upload gagal.");
        }
      } catch (error) {
        console.error("❌ Gagal mengupload gambar:", error);
      } finally {
        setUploading(false);
      }
    };
    

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
    
      // Ambil blogId dari blogDetail
      const blogId = blogDetail?._id;
    
      setLoading(true);
      setError(null);
      setSuccess(null);
    
      // 🔍 **Validasi Form**
      if (!blogId || !blogDetail.title || !blogDetail.slug || !blogDetail.description || 
          !blogDetail.titleEn || !blogDetail.slugEn || !blogDetail.descriptionEn || 
          !blogDetail.author || !blogDetail.tags || blogDetail.tags.length === 0) {
            
        setError("Harap isi semua bidang yang diperlukan.");
        setLoading(false);
        return; // Hentikan proses jika ada input kosong
      }
    
      try {
        const formData = new FormData();
        formData.append('_id', blogId);
        formData.append('title', blogDetail.title);
        formData.append('slug', blogDetail.slug);
        formData.append('titleEn', blogDetail.titleEn);
        formData.append('slugEn', blogDetail.slugEn);
        formData.append('description', blogDetail.description);
        formData.append('descriptionEn', blogDetail.descriptionEn);
        formData.append('author', blogDetail.author);
        formData.append('tags', JSON.stringify(blogDetail.tags));
    
        if (blogDetail.image instanceof File) {
          formData.append("image", blogDetail.image);
        } else if (blogDetail.image) {
          formData.append("image", blogDetail.image); // Kirim URL jika tidak diubah
        }
    
        console.log("FormData before submission:", Object.fromEntries(formData.entries()));
    
        const success = await updateBlog(blogId, formData);
    
        if (success) {
          setSuccess("Blog berhasil diperbarui!");
          router.push(`/${locale}/dashboard/blog`);
        } else {
          setError("Gagal memperbarui blog.");
        }
      } catch {
        setError("Terjadi kesalahan jaringan.");
      } finally {
        setLoading(false);
      }
    };
    
  

    return(
        <div className={`${styles.blog_form_container}`}>
        <Link href={`/dashboard/blog`}>
            <button className={styles.back_button}>
                <AiOutlineRollback/>
            </button>
        </Link>
        <h2>Edit Blog</h2>
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
                <Image width={800} height={800} src={previewImage || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
              )}
              <input type="file" id="image" accept="image/*" onChange={handleFileChange} className={styles.file_input} required />
            </label>
          </div>
          <div className={styles.form_double}>
            <div className={styles.form_single}>
              <label htmlFor="title">Blog Heading Id</label>
              <input
                type="text"
                id="title"
                name="title"
                value={blogDetail.title || ""}
                onChange={handleChange}
                required
                placeholder="Enter blog title"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="titleEn">Blog Heading En</label>
              <input
                type="text"
                id="titleEn"
                name="titleEn"
                value={blogDetail.titleEn || ""}
                onChange={handleChange}
                required
                placeholder="Enter blog title english"
              />
            </div>
          </div>
          <div className={styles.form_single}>
            <div className={styles.blog_form_heading}>
              <label htmlFor="description">Description Id</label>
              <button 
                type="button" 
                className={styles.mediaLibraryButton} 
                onClick={openMediaLibrary}
              >
                <PiImageThin />
                Insert Image
              </button>
            </div>
            <Editor
              id="description"
              apiKey='f0qff2j87jgv24lrb8m0hd4yuglweewk56pa79tykafgtc6g'
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
              }}
              value={blogDetail.description || ""}
              onEditorChange={(content) => updateBlogDetail({ description: content })}
            />
          </div>
          <div className={styles.form_single}>
            <div className={styles.blog_form_heading}>
              <label htmlFor="description">Description En</label>
            </div>
            <Editor
              id="descriptionEn"
              apiKey='f0qff2j87jgv24lrb8m0hd4yuglweewk56pa79tykafgtc6g'
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
              }}
              value={blogDetail.descriptionEn || ""}
              onEditorChange={(content) => updateBlogDetail({ descriptionEn: content })}
            />
          </div>
          <div className={styles.form_double}>
            <div className={styles.form_single}>
              <label htmlFor="author">Author</label>
              <input
                type="text"
                id="author"
                name="author"
                value={blogDetail.author || ""}
                onChange={handleChange}
                required
                placeholder="Enter blog author"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                placeholder="Enter tags (separate with commas)"
                value={blogDetail.tags ? blogDetail.tags.join(', ') : ''} 
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" onClick={handleSubmit} disabled={loading} className={styles.btn_primary}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <input
            type="text"
            id="slug"
            name="slug"
            value={blogDetail.slug || ""} // ✅ Ambil dari state
            style={{ display: "none" }}
            readOnly
          />
          <input
            type="text"
            id="slugEn"
            name="slugEn"
            value={blogDetail.slugEn || ""} // ✅ Ambil dari state
            style={{ display: "none" }}
            readOnly
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
                  <IoClose/> 
                </button>

                {/* Daftar gambar yang tersedia */}
                <div className={styles.imageGrid}>
                  {media.length > 0 ? (
                    media.map((img) => (
                      <div key={img._id} className={styles.imageItem}>
                        <Image width={800} height={800} priority src={img.image || "/fallback.jpg"} alt={`Image ${img._id}`} />
                        <div className={styles.imageActions}>
                          <button onClick={() => insertImageToEditor(img.image, "description")}>For ID</button>
                          <button onClick={() => insertImageToEditor(img.image, "descriptionEn")}>For EN</button>
                          
                        </div>
                        <button className={styles.btnDeleteItem} onClick={() => deleteImage(img._id)} disabled={deletingImageId === img._id}>
                            <GoTrash/>
                          </button>
                      </div>
                    ))
                  ) : (
                    <p>No images available.</p>
                  )}

                  <div className={styles.uploadContainer}>
                    <label className={styles.uploadButton}>
                      <FiPlus/>
                      <p>{uploading ? "⏳ Uploading..." : "Upload Image"}</p>
                      <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    );
}