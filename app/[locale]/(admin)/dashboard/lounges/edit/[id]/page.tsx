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

interface Space {
  name: string;
  image: string | null;
  imageFile?: File; // Tambahkan imageFile untuk menyimpan File yang diunggah
}

interface Slide {
  name: string;
  image: string | null;
  imageFile?: File; // Tambahkan imageFile untuk menyimpan File yang diunggah
}

interface Menu {
  name: string;
  description: string;
  image: string | null;
  imageFile?: File; // Tambahkan imageFile untuk menyimpan File yang diunggah
}


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
        previewTaglineBanner,
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
    const [taglineBanner, setTaglineBanner] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [previewLogoEdit, setPreviewLogo] = useState<string | null>(null);
    const [previewTagline, setPreviewTagline] = useState<string | null>(null);
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
    const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const buttonRef = useRef<HTMLButtonElement | null>(null); // Ref untuk tombol
    const [newCity, setNewCity] = useState(""); // State untuk input baru
    const [showInput, setShowInput] = useState(false); 
    const [selectedCity, setSelectedCity] = useState<string | null>(null); // Simpan _id, bukan nama
    const [selectedCityName, setSelectedCityName] = useState<string>("");
    const [, setDeletingCityId] = useState<string | null>(null);
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [imageSlide, setImageSlide] = useState<Slide[]>([]);
    const [menu, setMenu] = useState<Menu[]>([]);

    useEffect(() => {
      if (loungesDetail.imageSlide) {
        setImageSlide(loungesDetail.imageSlide);
      }
    }, [loungesDetail.imageSlide]);

    useEffect(() => {
        if (loungesDetail?.spaces?.length) {
            setSpaces(loungesDetail.spaces);
        }
    }, [loungesDetail.spaces]);
    
      useEffect(() => {
        if (loungesDetail?.menu?.length) {
            setMenu(loungesDetail.menu);
        }
    }, [loungesDetail.menu]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!loungesDetail) return;
    
      setLoungesDetail({
        ...loungesDetail,
        [e.target.name]: e.target.value, // Update field yang diubah
      });
    };

    useEffect(() => {
      if (loungesDetail?.name) {
          setLoungesDetail((prevState) => ({
              ...prevState!,
              slug: loungesDetail.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
          }));
      }
  }, [loungesDetail?.name, setLoungesDetail]);

    const handleImageSlideChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files ? event.target.files[0] : null;
    
        if (!file) return;
    
        setImageSlide((prevSlides) => {
            const newSlides = [...prevSlides];
            newSlides[index] = {
                ...newSlides[index],
                image: URL.createObjectURL(file), // Untuk pratinjau
                imageFile: file, // Simpan file asli
            };
            return newSlides;
        });
    };

    const handleTitleSlideChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = event.target;
        setImageSlide((prevSlides) =>
            prevSlides.map((slide, i) =>
                i === index ? { ...slide, name: value } : slide
            )
        );
    };

    const addMoreSlide = () => {
      setImageSlide((prevSlides) => [...prevSlides, { image: null, name: "" }]);
    };


    const handleImageSpacesChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files ? event.target.files[0] : null;
    
        if (!file) return;
    
        setSpaces((prevSpaces) => {
            const newSpaces = [...prevSpaces];
            newSpaces[index] = {
                ...newSpaces[index],
                image: URL.createObjectURL(file), // Untuk pratinjau
                imageFile: file, // Simpan file asli
            };
            return newSpaces;
        });
    };  
  
    
    const handleTitleSpacesChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = event.target;
        setSpaces((prevSpaces) =>
            prevSpaces.map((space, i) =>
                i === index ? { ...space, name: value } : space
            )
        );
    };
    
    const addMoreSlideSpaces = () => {
        setSpaces((prevSpaces) => [...prevSpaces, { image: null, name: "" }]);
    };

    const removeSpace = (index: number) => {
      setSpaces((prevSpaces) => prevSpaces.filter((_, i) => i !== index));
    };

    const removeSlide = (index: number) => {
      setImageSlide((prevSlides) => prevSlides.filter((_, i) => i !== index));
    };
  
  
    const handleImageMenuChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files ? event.target.files[0] : null;
    
        if (!file) return;
    
        setMenu((prevMenu) => {
            const newMenu = [...prevMenu];
            newMenu[index] = {
                ...newMenu[index],
                image: URL.createObjectURL(file), // Untuk pratinjau
                imageFile: file, // Simpan file asli
            };
            return newMenu;
        });
    };  

    
    const handleTitleMenuChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = event.target;
        setMenu((prevMenu) =>
            prevMenu.map((menu, i) =>
                i === index ? { ...menu, name: value } : menu
            )
        );
    };

    const handleDescriptionMenuChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = event.target;
        setMenu((prevMenu) =>
            prevMenu.map((menu, i) =>
                i === index ? { ...menu, description: value } : menu
            )
        );
    };
    
    const addMoreMenu = () => {
        setMenu((prevMenu) => [...prevMenu, { image: null, name: "", description: "" }]);
    };

    const removeMenu = (index: number) => {
      setMenu((prevMenu) => prevMenu.filter((_, i) => i !== index));
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
            image: selectedFile, // ✅ Sekarang bisa menyimpan File
          }));
        }
    };

    // const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    //     if (e.target.files && e.target.files[0]) {
    //       const selectedFileLogo = e.target.files[0];
    //       setLogo(selectedFileLogo);
    //       setPreviewLogo(URL.createObjectURL(selectedFileLogo));
      
    //       setLoungesDetail((prev) => ({
    //         ...prev,
    //         image: selectedFileLogo, // ✅ Sekarang bisa menyimpan File
    //       }));
    //     }
    // };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFileLogo = e.target.files?.[0];
        if (selectedFileLogo) {
        setLogo(selectedFileLogo);
        setPreviewLogo(URL.createObjectURL(selectedFileLogo)); // Buat preview gambar
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

    // for tagline banner
    const handleImageTaglineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
        setTaglineBanner(selectedFile);
        setPreviewTagline(URL.createObjectURL(selectedFile)); // Buat preview gambar
        }
    };

    const handleDragOverTagline = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeaveTagline = () => {
        setDragActive(false);
    };

    const handleDropTagline = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setDragActive(false);

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
          setTaglineBanner(droppedFile); // Correctly set the tagline banner
          setPreviewTagline(URL.createObjectURL(droppedFile)); // Buat preview gambar
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
    
      const loungeId = loungesDetail?._id;
    
      setError(null);
      setSuccess(null);
    
      try {
        const formData = new FormData();
        formData.append("_id", loungeId);
        formData.append("name", loungesDetail.name);
        formData.append("slug", loungesDetail.slug);
        formData.append("address", loungesDetail.address);
        formData.append("day", loungesDetail.day);
        formData.append("time", loungesDetail.time);
        formData.append("phone", loungesDetail.phone);
        formData.append("city", selectedCity ?? loungesDetail.city ?? "");
        formData.append("banner", loungesDetail.banner);
        formData.append("logo", loungesDetail.logo);
        formData.append("taglineBanner", loungesDetail.taglineBanner); // Correctly append taglineBanner
        formData.append("taglineId", loungesDetail.taglineId);
        formData.append("taglineEn", loungesDetail.taglineEn);

        // UNTUK IMAGE SLIDES
        const slidesArray = imageSlide.map((slide, index) => ({
          name: slide.name || "Untitled",
          image: slide.imageFile ? `__file__${index}` : slide.image, // Sesuaikan indeks
        }));

        // 🛠 Gunakan filter agar hanya file yang valid yang ditambahkan ke FormData
        const imageSlideFiles = imageSlide
          .map((slide) => slide.imageFile)
          .filter((file): file is File => !!file); // Pastikan hanya File yang valid

        // 🚀 Kirim slidesArray & imageSlideFiles dengan urutan yang benar
        formData.append("imageSlide", JSON.stringify(slidesArray));

        imageSlideFiles.forEach((file) => {
          formData.append("imageSlide[]", file);
        });

    
        // UNTUK SPACES
        const spacesArray = spaces.map((space, index) => ({
          name: space.name || "Untitled",
          image: space.imageFile ? `__file__${index}` : space.image, // Sesuaikan indeks
        }));
        
        // 🛠 Gunakan filter agar hanya file yang valid yang ditambahkan ke FormData
        const imageFiles = spaces
          .map((space) => space.imageFile)
          .filter((file): file is File => !!file); // Pastikan hanya File yang valid
        
        // 🚀 Kirim spacesArray & imageFiles dengan urutan yang benar
        formData.append("spaces", JSON.stringify(spacesArray));
        
        imageFiles.forEach((file) => {
          formData.append("imageSpaces[]", file);
        });
        
    
        // UNTUK SPACES
        const menuArray = menu.map((menu, index) => ({
          name: menu.name || "Untitled",
          image: menu.imageFile ? `__file__${index}` : menu.image, // Sesuaikan indeks
          description: menu.description || "Untitled",
        }));
        
        // 🛠 Gunakan filter agar hanya file yang valid yang ditambahkan ke FormData
        const imageMenuFiles = menu
          .map((menu) => menu.imageFile)
          .filter((file): file is File => !!file); // Pastikan hanya File yang valid
        
        // 🚀 Kirim menuArray & imageMenuFiles dengan urutan yang benar
        formData.append("menu", JSON.stringify(menuArray));
        
        imageMenuFiles.forEach((file) => {
          formData.append("menu[]", file);
        });
    
        const success = await updateLounge(loungeId, formData);
    
        if (success) {
          router.push(`/${locale}/dashboard/lounges`);
        } else {
          setError("⚠️ Gagal menambahkan lounge.");
        }
      } catch {
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
          <div className={styles.form_double}>
            <div className={styles.form_single}>
              <label htmlFor="taglineId">Tagline ID</label>
              <input
                type="text"
                id="taglineId"
                name="taglineId"
                value={loungesDetail.taglineId || ""}
                onChange={handleChange}
                required
                placeholder="Enter tagline id"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="taglineEn">Tagline EN</label>
              <input
                type="text"
                id="taglineEn"
                name="taglineEn"
                value={loungesDetail.taglineEn || ""}
                onChange={handleChange}
                required
                placeholder="Enter tagline en"
              />
            </div>
          </div>
          <div className={styles.form_single}>
            <label
              htmlFor="imageTagline"
              className={`${styles.dropzone} ${dragActive ? styles.active : ""}`}
              onDragOver={handleDragOverTagline}
              onDragLeave={handleDragLeaveTagline}
              onDrop={handleDropTagline}
            >
              {taglineBanner ? (
                <Image width={800} height={800} src={previewTagline || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
              ) : (
                <>
                <Image width={800} height={800} src={previewTaglineBanner || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
                </>
              )}
              <input
                type="file"
                id="imageTagline"
                accept="image/*"
                onChange={handleImageTaglineChange}
                className={styles.file_input}
                required
              />
            </label>
          </div>
          <div className={styles.form_single}>
            <label htmlFor="menu">Lounge Image Slide</label>

              {imageSlide.map((slide, index) => (
                <div key={index} className={styles.form_double}>
                  {/* Input Gambar */}
                  <div className={styles.form_single}>
                    <label
                      htmlFor={`image-${index}`}
                      className={`${styles.dropzone_small} ${slide.image ? styles.active : ""}`}
                    >
                        {slide.image ? (
                        <Image
                          width={800}
                          height={800}
                          src={typeof slide.image === 'string' ? slide.image : URL.createObjectURL(slide.image)}
                          alt="Preview"
                          className={styles.previewImage}
                        />
                        ) : (
                        <p>Upload Image</p>
                        )}
                      <input
                        type="file"
                        id={`image-${index}`}
                        accept="image/*"
                        onChange={(e) => handleImageSlideChange(e, index)}
                        className={styles.file_input}
                      />
                    </label>
                  </div>

                  {/* Input Judul */}
                  <div className={styles.form_single}>
                    <input
                      type="text"
                      placeholder="Enter image slide title"
                      name="name"
                      value={slide.name || ""}
                      onChange={(e) => handleTitleSlideChange(e, index)}
                    />
                  </div>

                  {/* Tombol Hapus */}
                  <button onClick={() => removeSlide(index)} className={styles.delete_button}>
                      ❌
                  </button>
                </div>
              ))}

            {/* Tombol Tambah Slide */}
            <button
              type="button"
              className={`${styles.btn_primary} ${styles.btn_primary_full}`}
              onClick={addMoreSlide}
            >
              + Add More Slide
            </button>
          </div>

          <div className={styles.form_single}>
            <label htmlFor="menu">Lounge Menu</label>
            {menu.map((menu, index) => (
              <div key={index} className={`${styles.form_double} ${styles.form_third}`}>
                {/* Input Gambar */}
                <div className={styles.form_single}>
                  <label
                    htmlFor={`imageMenu-${index}`}
                    className={`${styles.dropzone_small} ${menu.image ? styles.active : ""}`}
                  >
                    {menu.image ? (
                      <Image
                        width={800}
                        height={800}
                        src={typeof menu.image === 'string' ? menu.image : URL.createObjectURL(menu.image)}
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

                {/* Input Judul */}
                <div className={styles.form_single}>
                  <input
                    type="text"
                    placeholder="Enter menu name"
                    value={menu.name || ""}
                    onChange={(e) => handleTitleMenuChange(e, index)}
                  />
                </div>

                <div className={styles.form_single}>
                  <input
                    type="text"
                    placeholder="Enter menu description"
                    value={menu.description || ""}
                    onChange={(e) => handleDescriptionMenuChange(e, index)}
                  />
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
            <label htmlFor="spaces">Lounge Spaces</label>
            {spaces.map((space, index) => (
                <div key={index} className={styles.form_double}>
                    {/* Input Gambar */}
                    <div className={styles.form_single}>
                        <label
                            htmlFor={`imageSpace-${index}`}
                            className={`${styles.dropzone_small} ${space.image ? styles.active : ""}`}
                        >
                            {space.image ? (
                                <Image
                                    width={800}
                                    height={800}
                                    src={typeof space.image === 'string' ? space.image : URL.createObjectURL(space.image)}
                                    alt="Preview"
                                    className={styles.previewImage}
                                />
                            ) : (
                                <p>Upload Image</p>
                            )}
                            <input
                                type="file"
                                id={`imageSpace-${index}`}
                                accept="image/*"
                                onChange={(e) => handleImageSpacesChange(e, index)}
                                className={styles.file_input}
                            />
                        </label>
                    </div>

                    {/* Input Nama */}
                    <div className={styles.form_single}>
                        <input
                            type="text"
                            placeholder="Enter image space name"
                            name="name"
                            value={space.name || ""}
                            onChange={(e) => handleTitleSpacesChange(e, index)}
                        />
                    </div>

                    {/* Tombol Hapus */}
                    <button onClick={() => removeSpace(index)} className={styles.delete_button}>
                        ❌
                    </button>
                </div>
            ))}

            
            <button
                type="button"
                className={`${styles.btn_primary} ${styles.btn_primary_full}`}
                onClick={addMoreSlideSpaces}
            >
                + Add More Spaces
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