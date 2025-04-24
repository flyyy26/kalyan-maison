'use client'
import { useState, useRef, useEffect  } from 'react';
import { useLounge } from '@/hooks/useLounge';
import { useCity } from '@/hooks/useCity';
import styles from '@/app/[locale]/style/form.module.css'
import { PiImageThin } from "react-icons/pi";
import { AiOutlineRollback } from "react-icons/ai";
import { Link } from '@/i18n/routing';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { HiChevronDown } from "react-icons/hi2";
import { GoTrash } from "react-icons/go";

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
        addLounge,
      } = useLounge();

    const {
        cities,
        setCities,
        addCity,
        fetchCities,
        deleteCity,
      } = useCity();

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [day, setDay] = useState('');
    const [time, setTime] = useState('');
    const [taglineId, setTaglineId] = useState('');
    const [taglineEn, setTaglineEn] = useState('');
    const [banner, setBanner] = useState<File | null>(null);
    const [logo, setLogo] = useState<File | null>(null);
    const [taglineBanner, setTaglineBanner] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
    const [previewTagline, setPreviewTagline] = useState<string | null>(null);
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
    const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const buttonRef = useRef<HTMLButtonElement | null>(null); // Ref untuk tombol
    const [newCity, setNewCity] = useState(""); // State untuk input baru
    const [showInput, setShowInput] = useState(false); 
    const [selectedCity, setSelectedCity] = useState<string | null>(null); // Simpan _id, bukan nama
    const [selectedCityName, setSelectedCityName] = useState<string>("");
    const [, setDeletingCityId] = useState<string | null>(null);
    const [imageSlide, setImageSlide] = useState<{ imageItem: File | null; titleItem: string }[]>([
      { imageItem: null, titleItem: "" }
    ]);
    const [spaces, setSpaces] = useState<{ imageItemSpaces: File | null; titleItemSpaces: string }[]>([
      { imageItemSpaces: null, titleItemSpaces: "" }
    ]);
    const [menu, setMenu] = useState<{ imageItemMenu: File | null; titleItemMenu: string; descriptionItemMenu: string  }[]>([
      { imageItemMenu: null, titleItemMenu: "", descriptionItemMenu: "" }
    ]);

    const handleImageSlideChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = event.target.files?.[0] || null;
      const newImageSlide = [...imageSlide];
      newImageSlide[index].imageItem = file;
      setImageSlide(newImageSlide);
    };
    
    const handleTitleSlideChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newImageSlide = [...imageSlide];
      newImageSlide[index].titleItem = event.target.value;
      setImageSlide(newImageSlide);
    };
    
    const addMoreSlide = () => {
      setImageSlide([...imageSlide, { imageItem: null, titleItem: "" }]);
    };

    const handleImageSpacesChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const fileSpaces = event.target.files?.[0] || null;
      const newSpaces = [...spaces];
      newSpaces[index].imageItemSpaces = fileSpaces;
      setSpaces(newSpaces);
    };
    
    const handleTitleSpacesChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newSpaces = [...spaces];
      newSpaces[index].titleItemSpaces = event.target.value;
      setSpaces(newSpaces);
    };
    
    const addMoreSlideSpaces = () => {
      setSpaces([...spaces, { imageItemSpaces: null, titleItemSpaces: "" }]);
    };

    const handleImageMenuChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const fileMenu = event.target.files?.[0] || null;
      const newMenu = [...menu];
      newMenu[index].imageItemMenu = fileMenu;
      setMenu(newMenu);
    };
    
    const handleTitleMenuChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newMenu = [...menu];
      newMenu[index].titleItemMenu = event.target.value;
      setMenu(newMenu);
    };

    const handleDescriptionMenuChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newMenu = [...menu];
      newMenu[index].descriptionItemMenu = event.target.value;
      setMenu(newMenu);
    };
    
    const addMoreMenu = () => {
      setMenu([...menu, { imageItemMenu: null, titleItemMenu: "", descriptionItemMenu: "" }]);
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
    

    const createSlug = (text: string) => {
        return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter khusus
        .trim() // Hapus spasi di awal/akhir
        .replace(/\s+/g, '-'); // Ganti spasi dengan tanda hubung
    };
    
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setName(newTitle);
        setSlug(createSlug(newTitle)); // Buat slug otomatis dari judul
    };

    // for banner
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
        setBanner(selectedFile);
        setPreview(URL.createObjectURL(selectedFile)); // Buat preview gambar
        }
    };

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
          setBanner(droppedFile);
          setPreviewTagline(URL.createObjectURL(droppedFile)); // Buat preview gambar
        }
    };
    
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
    
      setError(null);
      setSuccess(null);
    
      if (!name || !logo || !slug || !phone || !address || !day || !time || !selectedCity || !taglineId || !taglineEn || !banner || !taglineBanner) {
        setError("⚠️ Semua kolom harus diisi!");
        return;
      }
    
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("address", address);
      formData.append("day", day);
      formData.append("time", time);
      formData.append("phone", phone);
      formData.append("city", selectedCity);
      formData.append("banner", banner);
      formData.append("logo", logo);
      formData.append("taglineBanner", taglineBanner);
      formData.append("taglineId", taglineId);
      formData.append("taglineEn", taglineEn);
    
      // 🔹 Format imageSlide agar sesuai dengan format JSON yang diinginkan
      const imageSlideArray = imageSlide.map((slide) => ({
        name: slide.titleItem,
        image: slide.imageItem ? `${slide.imageItem.name}` : "",
      }));
    
      const imageSlideString = JSON.stringify(imageSlideArray);
      formData.append("imageSlide", imageSlideString);
    
      // 🔹 Upload setiap file gambar
      imageSlide.forEach((slide) => {
        if (slide.imageItem) {
          formData.append("imageSlides", slide.imageItem);
        }
      });
      
      const spacesArray = spaces.map((space) => ({
        name: space.titleItemSpaces,
        image: space.imageItemSpaces ? `${space.imageItemSpaces.name}` : "",
      }));
    
      const spacesString = JSON.stringify(spacesArray);
      formData.append("spaces", spacesString);
    
      // 🔹 Upload setiap file gambar
      spaces.forEach((space) => {
        if (space.imageItemSpaces) {
          formData.append("imageSpaces", space.imageItemSpaces);
        }
      });

      const menuArray = menu.map((menu) => ({
        name: menu.titleItemMenu,
        image: menu.imageItemMenu ? `${menu.imageItemMenu.name}` : "",
        description: menu.descriptionItemMenu,
      }));
    
      const menuString = JSON.stringify(menuArray);
      formData.append("menu", menuString);
    
      // 🔹 Upload setiap file gambar
      menu.forEach((menu) => {
        if (menu.imageItemMenu) {
          formData.append("imageMenu", menu.imageItemMenu);
        }
      });
    
      setLoading(true);
    
      try {
        const success = await addLounge(formData);
        if (success) {
          setName("");
          setSlug("");
          setPhone("");
          setAddress("");
          setDay("");
          setTime("");
          setSelectedCity(null);
          setTaglineId("");
          setTaglineEn("");
          setBanner(null);
          setLogo(null);
          setTaglineBanner(null);
          setImageSlide([{ imageItem: null, titleItem: "" }]);
          setSpaces([{ imageItemSpaces: null, titleItemSpaces: "" }]);
          setMenu([{imageItemMenu: null, titleItemMenu: "", descriptionItemMenu: ""}]);
    
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
        <h2>Add Lounge</h2>
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
                    <p>Lounge Banner</p>
                    <PiImageThin />
                    <p>Drag & Drop file here or click to upload</p>
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
                {banner ? (
                  <Image width={800} height={800} src={previewLogo || '/fallback.jpg'} alt="Preview" className={styles.previewImage}/>
                ) : (
                  <>
                    <p>Lounge Logo</p>
                    <PiImageThin />
                    <p>Drag & Drop file here or click to upload</p>
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
                value={name}
                onChange={handleNameChange}
                required
                placeholder="Enter lounge name"
              />
            </div>
            <div className={styles.form_single}>
                <label htmlFor="city">Lounge City</label>
                <div className={`${styles.dropdown} ${openDropdowns["menu1"] ? styles.dropdown_active : ""}`}>
                  <button ref={buttonRef} type="button" onClick={() => toggleDropdown("menu1")}>
                    {selectedCity ? selectedCityName : "Enter Lounge City"} <HiChevronDown />
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Enter lounge phone"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="address">Lounge Address</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
                value={day}
                onChange={(e) => setDay(e.target.value)}
                required
                placeholder="Ex: Monday - Sunday"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="time">Time Open</label>
              <input
                type="text"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
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
                value={taglineId}
                onChange={(e) => setTaglineId(e.target.value)}
                required
                placeholder="Enter tagline id"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="taglineEn">Tagline EN</label>
              <input
                type="text"
                id="taglineEn"
                value={taglineEn}
                onChange={(e) => setTaglineEn(e.target.value)}
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
                  <p>Tagline Banner</p>
                  <PiImageThin />
                  <p>Drag & Drop file here or click to upload</p>
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
                    className={`${styles.dropzone_small} ${slide.imageItem ? styles.active : ""}`}
                  >
                    {slide.imageItem ? (
                      <Image
                        width={800}
                        height={800}
                        src={URL.createObjectURL(slide.imageItem)}
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
                    value={slide.titleItem}
                    onChange={(e) => handleTitleSlideChange(e, index)}
                  />
                </div>
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
            {menu.map((menuItem, index) => (
              <div key={index} className={`${styles.form_double} ${styles.form_third}`}>
                {/* Input Gambar */}
                <div className={styles.form_single}>
                  <label
                    htmlFor={`imageMenu-${index}`}
                    className={`${styles.dropzone_small} ${menuItem.imageItemMenu ? styles.active : ""}`}
                  >
                    {menuItem.imageItemMenu ? (
                      <Image
                        width={800}
                        height={800}
                        src={URL.createObjectURL(menuItem.imageItemMenu)}
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
                    value={menuItem.titleItemMenu}
                    onChange={(e) => handleTitleMenuChange(e, index)}
                  />
                </div>

                <div className={styles.form_single}>
                  <input
                    type="text"
                    placeholder="Enter menu description"
                    value={menuItem.descriptionItemMenu}
                    onChange={(e) => handleDescriptionMenuChange(e, index)}
                  />
                </div>
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
                    className={`${styles.dropzone_small} ${space.imageItemSpaces ? styles.active : ""}`}
                  >
                    {space.imageItemSpaces ? (
                      <Image
                        width={800}
                        height={800}
                        src={URL.createObjectURL(space.imageItemSpaces)}
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

                {/* Input Judul */}
                <div className={styles.form_single}>
                  <input
                    type="text"
                    placeholder="Enter image space name"
                    value={space.titleItemSpaces}
                    onChange={(e) => handleTitleSpacesChange(e, index)}
                  />
                </div>
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
      </div>
    );
}