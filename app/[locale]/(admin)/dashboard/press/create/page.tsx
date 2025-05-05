'use client'
import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useBlog } from '@/hooks/useBlog';
import styles from '@/app/[locale]/style/form.module.css'
import { PiImageThin } from "react-icons/pi";
import { AiOutlineRollback } from "react-icons/ai";
import { Link } from '@/i18n/routing';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useMedia } from '@/hooks/useMedia';
import { FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { GoTrash } from "react-icons/go";

export default function CreateBlog(){
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
      addMedia,
      deleteMedia
    } = useMedia();

    const [titleEn, setTitleEn] = useState('');
    const [source, setSource] = useState('');
    const [slugEn, setSlugEn] = useState('');
    const [descriptionEn, setDescriptionEn] = useState('');
    const [titleCn, setTitleCn] = useState('');
    const [slugCn, setSlugCn] = useState('');
    const [descriptionCn, setDescriptionCn] = useState('');
    const [titleRs, setTitleRs] = useState('');
    const [slugRs, setSlugRs] = useState('');
    const [descriptionRs, setDescriptionRs] = useState('');
    const [author, setAuthor] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const createSlugEn = (text: string) => {
        return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter khusus
        .trim() // Hapus spasi di awal/akhir
        .replace(/\s+/g, '-'); // Ganti spasi dengan tanda hubung
    };
    
    const handleTitleChangeEn = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitleEn = e.target.value;
        setTitleEn(newTitleEn);
        setSlugEn(createSlugEn(newTitleEn)); // Buat slug otomatis dari judul
    };

    const createSlugCn = (text: string) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\p{Script=Han}\p{L}\p{N}-]+/gu, ''); // Pertahankan karakter Han (Mandarin), huruf Latin, angka, dan tanda hubung
    };
    
    const handleTitleChangeCn = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitleCn = e.target.value;
        setTitleCn(newTitleCn);
        setSlugCn(createSlugCn(newTitleCn)); // Buat slug otomatis dari judul
    };

    const createSlugRs = (text: string) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\p{Script=Cyrillic}\p{L}\p{N}-]+/gu, ''); // Pertahankan karakter Cyrillic (Rusia), huruf Latin, angka, dan tanda hubung
    };
    
    const handleTitleChangeRs = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitleRs = e.target.value;
        setTitleRs(newTitleRs);
        setSlugRs(createSlugRs(newTitleRs)); // Buat slug otomatis dari judul
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

    const closeMediaLibrary = () => setIsMediaLibraryOpen(false);

    const insertImageToEditor = (imagePath: string, editorId: "descriptionEn" | "descriptionCn" | "descriptionRs") => {
    
      if (typeof window !== "undefined") {
        const editor = window.tinymce?.EditorManager.get(editorId);
        if (editor) {
          editor.insertContent(`<img src="${imagePath}" width="800" height="800" alt="Selected Image"/>`);
        }
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
      const selectedFile = event.target.files?.[0];
      
      if (!selectedFile) {
        console.error("⚠️ Tidak ada selectedFile yang dipilih.");
        return;
      }
    
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

      setUploading(true);
    
      const formData = new FormData();
      formData.append("image", selectedFile);
    
      try {
        const success = await addMedia(formData);
        
        if (success) {
          setSelectedFile(null);
        } else {
          console.error("Upload gagal.");
        }
      } catch (error) {
        console.error("Gagal mengupload gambar:", error);
      } finally {
        setUploading(false);
      }
    }; 
    

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      
      setError(null);
      setSuccess(null);
  
      // 🔍 **Validasi Form**
      if (!titleEn || !descriptionEn || !titleCn || !descriptionCn || !titleRs ||  !descriptionRs || !author || !image) {
          setError('⚠️ Semua kolom harus diisi!');
          return;
      }

      if (!slugEn || !slugCn || !slugRs) {
        console.error('Slug belum dibuat!');
        return;
      }
  
      const formData = new FormData();
      formData.append('titleEn', titleEn);
      formData.append('source', source);
      formData.append('slugEn', slugEn);
      formData.append('descriptionEn', descriptionEn);
      formData.append('titleCn', titleCn);
      formData.append('slugCn', slugCn);
      formData.append('descriptionCn', descriptionCn);
      formData.append('titleRs', titleRs);
      formData.append('slugRs', slugRs);
      formData.append('descriptionRs', descriptionRs);
      formData.append('image', image);
      formData.append('author', author);
      formData.append('tags', JSON.stringify(tags));
  
      setLoading(true);
  
      try {
          const success = await addBlog(formData);
          if (success) {
              setTitleEn('');
              setSource('');
              setSlugEn('');
              setDescriptionEn('');
              setTitleCn('');
              setSlugCn('');
              setDescriptionCn('');
              setTitleRs('');
              setSlugRs('');
              setDescriptionRs('');
              setAuthor('');
              setImage(null);
              setTags([]);
  
              router.push(`/${locale}/dashboard/press`);
          } else {
              setError('⚠️ Gagal menambahkan press.');
          }
      } catch {
          setError('⚠️ Terjadi kesalahan jaringan.');
      } finally {
          setLoading(false);
      }
  };
  

    return(
        <div className={`${styles.blog_form_container}`}>
        <Link href={`/dashboard/press`}>
            <button className={styles.back_button}>
                <AiOutlineRollback/>
            </button>
        </Link>
        <h2>Add Press</h2>
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
          <div className={styles.form_third}>
            <div className={styles.form_single}>
              <label htmlFor="titleEn">Press Heading En</label>
              <input
                type="text"
                id="titleEn"
                value={titleEn}
                onChange={handleTitleChangeEn}
                required
                placeholder="Enter Press heading English"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="titleCn">Press Heading Cn</label>
              <input
                type="text"
                id="titleCn"
                value={titleCn}
                onChange={handleTitleChangeCn}
                required
                placeholder="Enter Press heading Chinese"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="titleRs">Press Heading Rs</label>
              <input
                type="text"
                id="titleRs"
                value={titleRs}
                onChange={handleTitleChangeRs}
                required
                placeholder="Enter Press heading Russian"
              />
            </div>
          </div>
          <div className={styles.form_single}>
            <label htmlFor="descriptionEn">Description En</label>
            <Editor
              id="descriptionEn"
              value={descriptionEn}
              apiKey='f0qff2j87jgv24lrb8m0hd4yuglweewk56pa79tykafgtc6g'
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontsize | bold italic underline strikethrough | link table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                relative_urls: false, // Pastikan URL tetap absolut
                remove_script_host: false, // Jangan hapus bagian host (http://localhost:3000)
                convert_urls: true, // Pastikan URL dikonversi dengan benar
                document_base_url: "http://localhost:3000/",
              }}
              onEditorChange={(content) => setDescriptionEn(content)}
            />
          </div>
          <div className={styles.form_single}>
            <label htmlFor="descriptionCn">Description Cn</label>
            <Editor
              id="descriptionCn"
              value={descriptionCn}
              apiKey='f0qff2j87jgv24lrb8m0hd4yuglweewk56pa79tykafgtc6g'
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontsize | bold italic underline strikethrough | link table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                relative_urls: false, // Pastikan URL tetap absolut
                remove_script_host: false, // Jangan hapus bagian host (http://localhost:3000)
                convert_urls: true, // Pastikan URL dikonversi dengan benar
                document_base_url: "http://localhost:3000/",
              }}
              onEditorChange={(content) => setDescriptionCn(content)}
            />
          </div>
          <div className={styles.form_single}>
            <label htmlFor="descriptionRs">Description Rs</label>
            <Editor
              id="descriptionRs"
              value={descriptionRs}
              apiKey='f0qff2j87jgv24lrb8m0hd4yuglweewk56pa79tykafgtc6g'
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontsize | bold italic underline strikethrough | link table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                relative_urls: false, // Pastikan URL tetap absolut
                remove_script_host: false, // Jangan hapus bagian host (http://localhost:3000)
                convert_urls: true, // Pastikan URL dikonversi dengan benar
                document_base_url: "http://localhost:3000/",
              }}
              onEditorChange={(content) => setDescriptionRs(content)}
            />
          </div>
          <div className={styles.form_double}>
            <div className={styles.form_single}>
              <label htmlFor="author">Author</label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                placeholder="Enter Author"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="source">Source</label>
              <input
                type="text"
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
                placeholder="Enter Source"
              />
            </div>
          </div>
          <div className={styles.form_single}>
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                placeholder="Enter tags (separate with commas)"
                onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
              />
            </div>
          <button type="submit" disabled={loading} className={styles.btn_primary}>
            {loading ? 'Adding...' : 'Add Press'}
          </button>
          <input name="slugEn" value={slugEn} readOnly hidden  />
<input name="slugCn" value={slugCn} readOnly hidden  />
<input name="slugRs" value={slugRs} readOnly hidden  />
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
                          <button onClick={() => insertImageToEditor(img.image, "descriptionEn")}>For EN</button>
                          <button onClick={() => insertImageToEditor(img.image, "descriptionCn")}>For Cn</button>
                          <button onClick={() => insertImageToEditor(img.image, "descriptionRs")}>For Rs</button>
                          
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
                      <input type="file" accept="image/*" onChange={handleFileChange} hidden />
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