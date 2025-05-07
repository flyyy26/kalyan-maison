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
    const [instagram, setInstagram] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [facebook, setFacebook] = useState('');
    const [email, setEmail] = useState('');
    const [youtube, setYoutube] = useState('');
    const [slug, setSlug] = useState('');
    const [maps, setMaps] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [day, setDay] = useState('');
    const [time, setTime] = useState('');
    const [spaces, setSpaces] = useState<string[]>([]);
    const [banner, setBanner] = useState<File | null>(null);
    const [logo, setLogo] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
    const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const buttonRef = useRef<HTMLButtonElement | null>(null); // Ref untuk tombol
    const [newCity, setNewCity] = useState(""); // State untuk input baru
    const [showInput, setShowInput] = useState(false); 
    const [selectedCity, setSelectedCity] = useState<string | null>(null); // Simpan _id, bukan nama
    const [selectedCityName, setSelectedCityName] = useState<string>("");
    const [, setDeletingCityId] = useState<string | null>(null);
    const [menuImages, setMenuImages] = useState<{ imageItemMenu: File | null; }[]>([
      { imageItemMenu: null }
    ]);
    const [otherImages, setOtherImages] = useState<{ otherImageItem: File | null; }[]>([
      { otherImageItem: null }
    ]);

    const handleImageMenuChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const fileMenu = event.target.files?.[0] || null;
      const newMenu = [...menuImages];
      newMenu[index].imageItemMenu = fileMenu;
      setMenuImages(newMenu);
    };
    
    const addMoreMenu = () => {
      setMenuImages([...menuImages, { imageItemMenu: null }]);
    };

    const handleOtherImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const fileOtherImage = event.target.files?.[0] || null;
      const newOtherImage = [...otherImages];
      newOtherImage[index].otherImageItem = fileOtherImage;
      setOtherImages(newOtherImage);
    };
    
    const addMoreOtherImage = () => {
      setOtherImages([...otherImages, { otherImageItem: null }]);
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

    const handleDropLogo = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setDragActive(false);

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
          setLogo(droppedFile);
          setPreviewLogo(URL.createObjectURL(droppedFile)); // Buat preview gambar
        }
    };
    
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
    
      setError(null);
      setSuccess(null);
    
      if (!name || !logo || !slug || !phone || !address || !day || !time || !selectedCity || !banner) {
        setError("⚠️ Semua kolom harus diisi!");
        return;
      }
    
      const formData = new FormData();
      formData.append("name", name);
      formData.append("maps", maps);
      formData.append("instagram", instagram);
      formData.append("youtube", youtube);
      formData.append("facebook", facebook);
      formData.append("email", email);
      formData.append("whatsapp", whatsapp);
      formData.append("slug", slug);
      formData.append("address", address);
      formData.append("day", day);
      formData.append("time", time);
      formData.append("phone", phone);
      formData.append("city", selectedCity);
      formData.append("banner", banner);
      formData.append("logo", logo);
      formData.append('spaces', JSON.stringify(spaces));

      const menuArray = menuImages.map((menu) => ({
        image: menu.imageItemMenu ? `${menu.imageItemMenu.name}` : "",
      }));
    
      const menuString = JSON.stringify(menuArray);
      formData.append("menuImages", menuString);
    
      // 🔹 Upload setiap file gambar
      menuImages.forEach((menu) => {
        if (menu.imageItemMenu) {
          formData.append("imageMenu", menu.imageItemMenu);
        }
      });

      const otherImageArray = otherImages.map((menu) => ({
        image: menu.otherImageItem ? `${menu.otherImageItem.name}` : "",
      }));
    
      const otherImageString = JSON.stringify(otherImageArray);
      formData.append("otherImages", otherImageString);
    
      // 🔹 Upload setiap file gambar
      otherImages.forEach((menu) => {
        if (menu.otherImageItem) {
          formData.append("otherImageItem", menu.otherImageItem);
        }
      });
    
      setLoading(true);
    
      try {
        const success = await addLounge(formData);
        if (success) {
          setName("");
          setMaps("");
          setInstagram("");
          setYoutube("");
          setWhatsapp("");
          setEmail("");
          setFacebook("");
          setSlug("");
          setPhone("");
          setAddress("");
          setDay("");
          setTime("");
          setSpaces([]);
          setSelectedCity(null);
          setBanner(null);
          setLogo(null);
          setMenuImages([{imageItemMenu: null}]);
          setOtherImages([{otherImageItem: null}]);
    
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
                onDrop={handleDropLogo}
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
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Enter lounge instagram"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="facebook">Lounge Facebook</label>
              <input
                type="text"
                id="facebook"
                value={address}
                onChange={(e) => setFacebook(e.target.value)}
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
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="Enter lounge youtube"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="email">Lounge Email</label>
              <input
                type="text"
                id="email"
                value={address}
                onChange={(e) => setEmail(e.target.value)}
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
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Enter lounge whatsapp"
              />
            </div>
            <div className={styles.form_single}>
              <label htmlFor="maps">Lounge Maps</label>
              <input
                type="text"
                id="maps"
                value={maps}
                onChange={(e) => setMaps(e.target.value)}
                required
                placeholder="Enter lounge maps"
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
          <div className={styles.form_single}>
              <label htmlFor="spaces">Spaces</label>
              <input
                type="text"
                id="spaces"
                placeholder="Enter spaces (separate with commas)"
                onChange={(e) => setSpaces(e.target.value.split(',').map(space => space.trim()))}
              />
          </div>
          <div className={styles.form_single}>
            <label htmlFor="menu">Lounge Menu</label>
            {menuImages.map((menuItem, index) => (
              <div key={index} className={`${styles.form_single}`}>
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
            <label htmlFor="menu">Other Image</label>
            {otherImages.map((menuItem, index) => (
              <div key={index} className={`${styles.form_single}`}>
                {/* Input Gambar */}
                <div className={styles.form_single}>
                  <label
                    htmlFor={`otherImage-${index}`}
                    className={`${styles.dropzone_small} ${menuItem.otherImageItem ? styles.active : ""}`}
                  >
                    {menuItem.otherImageItem ? (
                      <Image
                        width={800}
                        height={800}
                        src={URL.createObjectURL(menuItem.otherImageItem)}
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