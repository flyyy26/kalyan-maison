'use client'
import { useState, useRef, useEffect  } from 'react';
import { useLounge } from '@/hooks/useLounge';
import { useCity } from '@/hooks/useCity';
import styles from '@/app/[locale]/style/form.module.css'
import { AiOutlineRollback } from "react-icons/ai";
import { Link } from '@/i18n/routing';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { HiChevronDown } from "react-icons/hi2";
import { GoTrash } from "react-icons/go"; 

export default function EditLounge(){
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale || 'id'; 
    const {
        loading,
        error,
        success,
        previewBanner,
        previewLogo,
        loungesDetail,
        setError,
        setSuccess,
        setLoading,
        updateLounge,
        setLoungesDetail,
      } = useLounge();

    const {
        cities,
        setCities,
        addCity,
        fetchCities,
        deleteCity,
      } = useCity();

    const [banner, setBanner] = useState<File | null>(null);
    const [logo, setLogo] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [previewLogoEdit, setPreviewLogo] = useState<string | null>(null);
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
    const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const buttonRef = useRef<HTMLButtonElement | null>(null); // Ref untuk tombol
    const [newCity, setNewCity] = useState(""); // State untuk input baru
    const [showInput, setShowInput] = useState(false); 
    const [selectedCity, setSelectedCity] = useState<string | null>(null); // Simpan _id, bukan nama
    const [selectedCityName, setSelectedCityName] = useState<string>("");
    const [, setDeletingCityId] = useState<string | null>(null);
    const [menuImages, setMenuImages] = useState<(string | File)[]>([]);
    const [otherImages, setOtherImages] = useState<(string | File)[]>([]);

    useEffect(() => {
      if (loungesDetail?.name) {
          setLoungesDetail((prevState) => ({
              ...prevState!,
              slug: loungesDetail.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
          }));
      }
  }, [loungesDetail?.name, setLoungesDetail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!loungesDetail) return;
  
    setLoungesDetail({
      ...loungesDetail,
      [e.target.name]: e.target.value, // Update field yang diubah
    });
  };
    
    useEffect(() => {
      if (loungesDetail?.menuImages?.length) {
        setMenuImages(loungesDetail.menuImages); // langsung array of string
      }
    }, [loungesDetail.menuImages]);
    
    const handleImageMenuChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = event.target.files?.[0];
      if (!file) return;
    
      setMenuImages(prevMenu => {
        const updated = [...prevMenu];
        updated[index] = file; // simpan File bukan URL
        return updated;
      });
    };    
    
    const addMoreMenu = () => {
      setMenuImages(prevMenu => [...prevMenu, ""]);
    };
    
    const removeMenu = (index: number) => {
      setMenuImages(prevMenu => prevMenu.filter((_, i) => i !== index));
    };

    useEffect(() => {
      if (loungesDetail?.otherImages?.length) {
        setOtherImages(loungesDetail.otherImages);
      }
    }, [loungesDetail.otherImages]);
    
    const handleOtherImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = event.target.files?.[0];
      if (!file) return;
    
      setOtherImages(prevMenu => {
        const updated = [...prevMenu];
        updated[index] = file;
        return updated;
      });
    };
    
    const addMoreOtherImage = () => {
      setOtherImages(prevMenu => [...prevMenu, ""]); // Tambah slot kosong (string kosong)
    };
    
    const removeOtherImage = (index: number) => {
      setOtherImages(prevMenu => prevMenu.filter((_, i) => i !== index));
    };

    const handleSelectCity = (cityId: string, cityName: string) => {
      setSelectedCity(cityId); // Simpan _id kota
      setSelectedCityName(cityName); // Simpan nama kota untuk ditampilkan di tombol
      setOpenDropdowns((prev) => ({ ...prev, menu1: false })); // Tutup dropdown setelah memilih
    };
    
    const handleAddCity = async () => {
      if (!newCity.trim()) return;
    
      setLoading(true);
    
      const formData = new FormData();
      formData.append("name", newCity);
    
      try {
        const success = await addCity(formData); // API hanya mengembalikan true/false
    
        if (success) {
          // Fetch ulang daftar kota dari API agar data tetap valid
          const updatedCities = await fetchCities(); 
          setCities(updatedCities);
          setNewCity("");
          setShowInput(false);
        } else {
          console.error("Upload gagal.");
        }
      } catch (error) {
        console.error("Gagal menambahkan kota:", error);
      } finally {
        setLoading(false);
      }
    };

    // for banner
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.files && e.target.files[0]) {
          const selectedFile = e.target.files[0];
          setBanner(selectedFile);
          setPreview(URL.createObjectURL(selectedFile));
      
          setLoungesDetail((prev) => ({
            ...prev,
            banner: selectedFile, // ✅ Sekarang bisa menyimpan File
          }));
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFileLogo = e.target.files?.[0];
        if (selectedFileLogo) {
        setLogo(selectedFileLogo);
        setPreviewLogo(URL.createObjectURL(selectedFileLogo)); // Buat preview gambar

        setLoungesDetail((prev) => ({
          ...prev,
          logo: selectedFileLogo, // ✅ Sekarang bisa menyimpan File
        }));
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
          setBanner(droppedFile);
          setPreview(URL.createObjectURL(droppedFile)); // Buat preview gambar
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
    
      const loungeId = loungesDetail?._id;
    
      setError(null);
      setSuccess(null);
      setLoading(true);
    
      try {
        const formData = new FormData();
        formData.append("_id", loungeId);
        formData.append("name", loungesDetail.name);
        formData.append("youtube", loungesDetail.youtube);
        formData.append("instagram", loungesDetail.instagram);
        formData.append("facebook", loungesDetail.facebook);
        formData.append("email", loungesDetail.email);
        formData.append("whatsapp", loungesDetail.whatsapp);
        formData.append("slug", loungesDetail.slug);
        formData.append("address", loungesDetail.address);
        formData.append("day", loungesDetail.day);
        formData.append("time", loungesDetail.time);
        formData.append("phone", loungesDetail.phone);
        formData.append("city", selectedCity ?? loungesDetail.city ?? "");
    
        // ⬇️ Jika banner/logo adalah file, masukkan sebagai File, jika string, tetap string
        if (loungesDetail.banner instanceof File) {
          formData.append("banner", loungesDetail.banner);
        } else {
          formData.append("banner", loungesDetail.banner); // tetap URL
        }
    
        if (loungesDetail.logo instanceof File) {
          formData.append("logo", loungesDetail.logo);
        } else {
          formData.append("logo", loungesDetail.logo); // tetap URL
        }
    
        // menuImages
        const finalMenuImages = menuImages.map((item, i) =>
          item instanceof File ? `__file__${i}` : item
        );
        formData.append("menuImages", JSON.stringify(finalMenuImages));

        menuImages.forEach((item) => {
          if (item instanceof File) {
            formData.append("imageMenu", item);
          }
        });

        // otherImages
        const finalOtherImages = otherImages.map((item, i) =>
          item instanceof File ? `__file__${i}` : item
        );
        formData.append("otherImages", JSON.stringify(finalOtherImages));

        otherImages.forEach((item) => {
          if (item instanceof File) {
            formData.append("otherImageItem", item);
          }
        });
      
    
        // Kirim ke endpoint PUT
        const success = await updateLounge(loungeId, formData);
    
        if (success) {
          router.push(`/${locale}/dashboard/lounges`);
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

    const toggleDropdown = (id: string) => {
        setOpenDropdowns((prev) => ({
        ...prev,
        [id]: !prev[id], // Toggle visibility for the specific dropdown
        }));
    };

    const deleteCities = async (cityId: string) => {
      setDeletingCityId(cityId);
      try {
        await deleteCity(cityId);
      } catch (error) {
        console.error("Failed to delete image:", error);
      } finally {
        setDeletingCityId(null);
      }
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
        <Link href={`/dashboard/lounges`}>
            <button className={styles.back_button}>
                <AiOutlineRollback/>
            </button>
        </Link>
        <h2>Edit Lounge {loungesDetail.name}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.form_double}>
            <div className={styles.form_single}>
              <label
                htmlFor="banner"
                className={`${styles.dropzone} ${dragActive ? styles.active : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {banner ? (
                  <Image width={800} height={800} src={preview || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
                ) : (
                  <>
                    <Image width={800} height={800} src={previewBanner || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
                  </>
                )}
                <input
                  type="file"
                  id="banner"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.file_input}
                  required
                />
              </label>
            </div>
            <div className={styles.form_single}>
              <label
                htmlFor="logo"
                className={`${styles.dropzone} ${dragActive ? styles.active : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {logo ? (
                  <Image width={800} height={800} src={previewLogoEdit || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
                ) : (
                  <>
                    <Image width={800} height={800} src={previewLogo || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
                  </>
                )}
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className={styles.file_input}
                  required
                />
              </label>
            </div>
          </div>
          <div className={styles.form_double}>
            <div className={styles.form_single}>
              <label htmlFor="name">Lounge Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={loungesDetail.name || ""}
                onChange={handleChange}
                required
                placeholder="Enter lounge name"
              />
            </div>
            <div className={styles.form_single}>
                <label htmlFor="city">Lounge City</label>
                <div className={`${styles.dropdown} ${openDropdowns["menu1"] ? styles.dropdown_active : ""}`}>
                <button ref={buttonRef} type="button" onClick={() => toggleDropdown("menu1")}>
                  {selectedCity
                    ? selectedCityName
                    : cities.find((city) => city._id === loungesDetail.city)?.name || "Pilih Kota"} 
                  <HiChevronDown />
                </button>


                  {openDropdowns["menu1"] && (
                    <div
                      ref={(el) => { dropdownRefs.current["menu1"] = el; }}
                      className={`${styles.dropdown_menu} ${styles.dropdown_menu_bottom} ${openDropdowns["menu1"] ? styles.dropdown_menu_show : ""}`}
                    >
                      {/* Daftar kota yang bisa dipilih */}
                      {cities.map((city) => (
                        <div key={city._id} className={styles.cityContainer}>
                          <button type="button" onClick={() => handleSelectCity(city._id, city.name)}>
                            {city.name}
                          </button>
                          <span className={styles.btnDeleteItem} onClick={(e) => { 
                            e.stopPropagation(); // Mencegah onClick button ikut terpanggil
                            deleteCities(city._id);
                          }}>
                            <GoTrash/>
                          </span>
                        </div>
                      ))}


                      <div className={styles.inputAdd}>
                        {showInput && (
                          <>
                          <input
                            type="text"
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddCity()}
                            placeholder="Enter city name"
                            className={styles.input}
                            disabled={loading}
                          />
                          <p>Click Enter to Add</p>
                          </>
                        )}
                        
                      </div>

                      <button type="button" onClick={() => setShowInput(true)} disabled={loading}>
                        {loading ? "Adding..." : "+ Add More City"}
                      </button>
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
                name="phone"
                value={loungesDetail.phone || ""}
                onChange={handleChange}
                required
                placeholder="Enter lounge phone"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="address">Lounge Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={loungesDetail.address || ""}
                onChange={handleChange}
                required
                placeholder="Enter lounge address"
              />
            </div>
          </div>
          <div className={styles.form_double}>
            <div className={styles.form_single}>
              <label htmlFor="instagram">Lounge Instagram</label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                value={loungesDetail.instagram || ""}
                onChange={handleChange}
                required
                placeholder="Enter lounge instagram"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="facebook">Lounge Facebook</label>
              <input
                type="text"
                id="facebook"
                name="facebook"
                value={loungesDetail.facebook || ""}
                onChange={handleChange}
                required
                placeholder="Enter lounge facebook"
              />
            </div>
          </div>
          <div className={styles.form_double}>
            <div className={styles.form_single}>
              <label htmlFor="youtube">Lounge Youtube</label>
              <input
                type="text"
                id="youtube"
                name="youtube"
                value={loungesDetail.youtube || ""}
                onChange={handleChange}
                required
                placeholder="Enter lounge youtube"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="email">Lounge Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={loungesDetail.email || ""}
                onChange={handleChange}
                required
                placeholder="Enter lounge email"
              />
            </div>
          </div>
          <div className={styles.form_double}>
            <div className={styles.form_single}>
              <label htmlFor="whatsapp">Lounge Whatsapp</label>
              <input
                type="text"
                id="whatsapp"
                name="whatsapp"
                value={loungesDetail.whatsapp || ""}
                onChange={handleChange}
                required
                placeholder="Enter lounge whatsapp"
              />
            </div>
          </div>
          <div className={styles.form_double}>
            <div className={styles.form_single}>
              <label htmlFor="day">Day Open</label>
              <input
                type="text"
                id="day"
                name='day'
                value={loungesDetail.day || ""}
                onChange={handleChange}
                required
                placeholder="Ex: Monday - Sunday"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="time">Time Open</label>
              <input
                type="text"
                id="time"
                name="time"
                value={loungesDetail.time || ""}
                onChange={handleChange}
                required
                placeholder="Ex: 03.00-21.00"
              />
            </div>
          </div>

          <div className={styles.form_single}>
            <label htmlFor="menu">Lounge Menu</label>
            {menuImages.map((menu, index) => (
              <div key={index} className={`${styles.form_double} ${styles.form_third}`}>
                {/* Input Gambar */}
                <div className={styles.form_single}>
                  <label
                    htmlFor={`imageMenu-${index}`}
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
                      id={`imageMenu-${index}`}
                      accept="image/*"
                      onChange={(e) => handleImageMenuChange(e, index)}
                      className={styles.file_input}
                    />
                  </label>
                </div>
                {/* Tombol Hapus */}
                <button onClick={() => removeMenu(index)} className={styles.delete_button}>
                        ❌
                </button>
                
              </div>
            ))}
            <button
              type="button"
              className={`${styles.btn_primary} ${styles.btn_primary_full}`}
              onClick={addMoreMenu}
            >
              + Add More Menu
            </button>
          </div>

          <div className={styles.form_single}>
            <label htmlFor="otherImage">Other Image</label>
            {otherImages.map((menu, index) => (
              <div key={index} className={`${styles.form_double} ${styles.form_third}`}>
                {/* Input Gambar */}
                <div className={styles.form_single}>
                  <label
                    htmlFor={`otherImage-${index}`}
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
                      id={`otherImage-${index}`}
                      accept="image/*"
                      onChange={(e) => handleOtherImageChange(e, index)}
                      className={styles.file_input}
                    />
                  </label>
                </div>
                {/* Tombol Hapus */}
                <button onClick={() => removeOtherImage(index)} className={styles.delete_button}>
                        ❌
                </button>
                
              </div>
            ))}
            <button
              type="button"
              className={`${styles.btn_primary} ${styles.btn_primary_full}`}
              onClick={addMoreOtherImage}
            >
              + Add More Other Image
            </button>
          </div>

          <button type="submit" onClick={handleSubmit} disabled={loading} className={styles.btn_primary}>
            {loading ? 'Saving...' : 'Save Lounge'}
          </button>
          <input
            type="text"
            id="slug"
            name='slug'
            value={loungesDetail.slug || ""} 
            style={{display: 'none'}}
            readOnly // Slug hanya dibaca, dibuat otomatis
          />
        </form>
        <div className={styles.notif_form}>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: '#FF4646' }}>{error}</p>}
          {success && <p style={{ color: '#26FF00' }}>{success}</p>}
        </div>
      </div>
    );
}