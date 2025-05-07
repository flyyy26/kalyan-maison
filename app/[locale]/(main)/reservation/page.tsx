// 'use client'

// import React from 'react'
// import style from '@/app/[locale]/style/reservation.module.css'
// import { useState, useRef } from 'react';
// import { HiChevronDown } from "react-icons/hi2";
// import ContactSection from "@/components/Contact_section/page"
// import { useTranslations } from 'next-intl';
// import { useLounge } from '@/hooks/useLounge';
// import { useReservation } from '@/hooks/useReservation';
// import LoadingPopup from '@/components/loading_popup/page';

// const Reservation = () => { 
//     const {
//         lounges,
//         loading,
//         setLoading,
//       } = useLounge();

//     const {
//         error,
//         setError,
//         success,
//         setSuccess,
//         addReservation
//     } = useReservation();
//     const t =  useTranslations();
//     const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
//     const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
//     const [selectedLounge, setSelectedLounge] = useState<string | null>(null);
//     const [selectedLoungeSpace, setSelectedLoungeSpace] = useState<string | null>(null);
//     const [selectedLoungeName, setSelectedLoungeName] = useState<string>("Lounge*");
//     const [selectedLoungeNameSpace, setSelectedLoungeNameSpace] = useState<string>(t("reservation.space"));
//     const [selectedDate, setSelectedDate] = useState<string | null>(null);
//     const [selectedTime, setSelectedTime] = useState<string | null>(null);
//     const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
//     const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
//     const [name, setName] = useState<string>("");
//     const [number, setNumber] = useState<string>("");
//     const [timeError, setTimeError] = useState<string | null>(null);

//     // Toggle dropdown visibility
//     const toggleDropdown = (id: string) => {
//         setOpenDropdowns((prev) => ({
//             ...prev,
//             [id]: !prev[id], // Toggle only the selected dropdown
//         }));
//     };

//     // Handle Lounge Selection
//     const handleSelectLounge = (loungeId: string, loungeName: string) => {
//         setSelectedLounge(loungeId);
//         setSelectedLoungeName(loungeName);
//         setOpenDropdowns((prev) => ({ ...prev, menu1: false }));
//         setSelectedLoungeSpace(null); // Reset space selection when lounge changes
//         setSelectedLoungeNameSpace(t("reservation.space"));
//     };

//     // Handle Space Selection
//     const handleSelectSpace = (spaceName: string) => {
//         setSelectedLoungeNameSpace(spaceName);
//         setOpenDropdowns((prev) => ({ ...prev, menu2: false }));
//     };

//     const availableSpaces = [
//         { _id: "1", name: "VIP Lounge" },
//         { _id: "2", name: "Outdoor Area" },
//         { _id: "3", name: "Private Room" },
//     ];

//     // Tambahkan ini di dalam komponen Reservation, setelah state definition
//     const selectedLoungeObj = lounges.find((l) => l._id === selectedLounge);


//     const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSelectedDate(event.target.value);
//     };

//     const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedLoungeData = lounges.find(lounge => lounge._id === selectedLounge);
//         if (selectedLoungeData) {
//             const [openTime, closeTime] = selectedLoungeData.time.split('-').map(time => time.trim());
//             const selectedTimeValue = event.target.value;

//             if (selectedTimeValue < openTime || selectedTimeValue > closeTime) {
//                 setTimeError('⚠️ Melewati jam buka');
//                 setSelectedTime(null);
//             } else {
//                 setTimeError(null);
//                 setSelectedTime(selectedTimeValue);
//             }
//         }
//     };

//     const selectDuration = (duration: string) => {
//         setSelectedDuration(duration);
//         setOpenDropdowns({ dropdown5: false }); // Tutup dropdown setelah memilih durasi
//     };

//     const selectPerson = (person: string) => {
//         setSelectedPerson(person);
//         setOpenDropdowns({ dropdown6: false }); // Tutup dropdown setelah memilih durasi
//     };

//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault();
        
//         setError(null);
//         setSuccess(null);
    
//         // Form Validation
//         if (!selectedLounge || !selectedLoungeSpace || !selectedTime || !selectedDate || !selectedDuration || !selectedPerson || !name || !number) {
//             setError('⚠️ Semua kolom harus diisi!');
//             return;
//         }
    
//         const formData = new FormData();
//         formData.append('lounge', selectedLoungeName);
//         formData.append('space', selectedLoungeNameSpace);
//         formData.append('date', selectedDate);
//         formData.append('duration', selectedDuration);
//         formData.append('person', selectedPerson);
//         formData.append('name', name);
//         formData.append('phoneNumber', number);
//         formData.append('time', selectedTime);
    
//         // Convert FormData entries to an array for easier logging
//         const formDataEntries = Array.from(formData.entries());
    
//         // Log FormData entries to console (this will show in browser console when the button is clicked)
//         console.log("Form Data yang dikirim:", formDataEntries);
    
//         setLoading(true);
    
//         try {
//             const success = await addReservation(formData);
//             if (success) {
//                 setSelectedDuration(null);
//                 setSelectedPerson(null);
//                 setSelectedTime(null);
//                 setName('');
//                 setNumber('');
//             } else {
//                 setError('⚠️ Gagal melakukan reservasi.');
//             }
//         } catch {
//             setError('⚠️ Terjadi kesalahan jaringan.');
//         } finally {
//             setLoading(false);
//         }   
//     };
    

//   return (
//     <>
//         <LoadingPopup duration={700} />
//          <div className={style.reservation_layout}>
//             <div className={style.reservation_content}>
//                 <h1>{t('reservation.heading')}</h1>
//                 <p>{t('reservation.description')}</p>
//             </div>
//             <div className={style.reservation_form}>
//                 <form onSubmit={handleSubmit}>
//                     <div className={style.form_double}>
//                         <div className={`${style.dropdown} ${openDropdowns["menu1"] ? style.dropdown_active : ""}`}>
//                             <button type="button" onClick={() => toggleDropdown("menu1")}>
//                                 {selectedLoungeName} <HiChevronDown />
//                             </button>
//                             {openDropdowns["menu1"] && (
//                                 <div
//                                     ref={(el) => { dropdownRefs.current["menu1"] = el; }}
//                                     className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${style.dropdown_menu_show}`}
//                                 >
//                                     {lounges.map((lounge) => (
//                                         <div key={lounge._id} className={style.loungeContainer}>
//                                             <button type="button" onClick={() => handleSelectLounge(lounge._id, lounge.name)}>
//                                                 {lounge.name}
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                         <div className={`${style.dropdown} ${openDropdowns["menu2"] ? style.dropdown_active : ""}`}>
//                             <button type="button" onClick={() => toggleDropdown("menu2")}>
//                                 {selectedLoungeNameSpace} <HiChevronDown />
//                             </button>

//                             {openDropdowns["menu2"] && (
//                                 <div
//                                 ref={(el) => { dropdownRefs.current["menu2"] = el; }}
//                                 className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${style.dropdown_menu_show}`}
//                                 >
//                                 {selectedLoungeObj && selectedLoungeObj.spaces.length > 0 ? (
//                                     selectedLoungeObj.spaces.map((space, index) => (
//                                     <div key={index} className={style.loungeContainer}>
//                                         <button type="button" onClick={() => handleSelectSpace(space)}>
//                                         {space}
//                                         </button>
//                                     </div>
//                                     ))
//                                 ) : (
//                                     <div className={style.noSpaces}>{t("reservation.select_first")}</div>
//                                 )}
//                                 </div>
//                             )}
//                             </div>

//                     </div>
//                     <div className={style.form_single}>
//                         <input type="text" placeholder={t('reservation.name')} value={name} onChange={(e) => setName(e.target.value)} />
//                     </div>
//                     <div className={style.form_single}>
//                         <input type="text" placeholder={t('reservation.number')} value={number} onChange={(e) => setNumber(e.target.value)} />
//                     </div>
//                     <div className={style.form_double}>
//                         <input type="date" onChange={handleDateChange} className={style.date_input} />
//                         <div className={style.form_single}>
//                             <input type="time" value={selectedTime || ''} onChange={handleTimeChange} className={style.date_input} />
//                             {timeError && selectedLounge && (
//                                 <p style={{ color: '#FF4646' }}>
//                                     {timeError} {lounges.find(lounge => lounge._id === selectedLounge)?.time}
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//                     <div className={style.form_double}>
//                         <div className={`${style.dropdown} ${openDropdowns["dropdown5"] ? style.dropdown_active : ""}`}>
//                             <button type="button" onClick={() => toggleDropdown("dropdown5")}>
//                                 {selectedDuration ? selectedDuration : t('reservation.duration')} <HiChevronDown />
//                             </button>
//                             <div
//                                 className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${
//                                 openDropdowns["dropdown5"] ? style.dropdown_menu_show : ""
//                                 }`}
//                             >
//                                 {[1, 2, 3, 4, 5].map((hour) => (
//                                 <button key={hour} type="button" onClick={() => selectDuration(`${hour} ${t('reservation.hour')}`)}>
//                                     {hour} {t('reservation.hour')}
//                                 </button>
//                                 ))}
//                             </div>
//                         </div>
//                         <div className={`${style.dropdown} ${openDropdowns["dropdown6"] ? style.dropdown_active : ""}`}>
//                             <button type="button" onClick={() => toggleDropdown("dropdown6")}>
//                                 {selectedPerson ? selectedPerson :  t('reservation.number_person')} <HiChevronDown />
//                             </button>
//                             <div
//                                 className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${
//                                 openDropdowns["dropdown6"] ? style.dropdown_menu_show : ""
//                                 }`}
//                             >
//                                 {[1, 2, 3, 4, 5].map((person) => (
//                                 <button key={person} type="button" onClick={() => selectPerson(`${person} ${t('reservation.person')}`)}>
//                                     {person} {t('reservation.person')}
//                                 </button>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                     <button type="submit" className={style.btn_primary}>{t('reservation.button')}</button>
//                     <div className={style.notif_form}>
//                         {loading && <p>Loading...</p>}
//                         {error && <p style={{ color: '#FF4646' }}>{t('reservation.reservation_error')}</p>}
//                         {success && <p style={{ color: '#26FF00' }}>{t('reservation.reservation_success')}</p>}
//                     </div>
//                 </form>
//             </div>
//          </div>
//          <ContactSection/>
//     </>
//   )
// }

// export default Reservation

'use client';

import React, { useState, useEffect, useRef } from 'react';
import style from "@/app/[locale]/style/reservation.module.css";
import { HiChevronDown } from 'react-icons/hi';
import { useLounge } from '@/hooks/useLounge'; 
import { useTranslations } from 'next-intl';

interface ReservationForm {
  name: string;
  phoneNumber: string;
  lounge: string | null;
  space: string | null;
  date: string;
  time: string;
  duration: string;
  person: string;
}

interface Lounge {
    _id: string;
    name: string;
    time?: string;
    email: string;
    phone:string;
    spaces: string[]; // Pastikan ini adalah string[]
    // ... properti lainnya
  }

const Reservation: React.FC = () => {
  const t =  useTranslations();
  const { lounges, loading: loadingLounges } = useLounge();
  const [formData, setFormData] = useState<ReservationForm>({
    name: '',
    phoneNumber: '',
    lounge: null,
    space: null,
    date: '',
    time: '',
    duration: '',
    person: '',
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [selectedLoungeName, setSelectedLoungeName] = useState<string | null>("Lounge*");
  const [selectedLoungeObj, setSelectedLoungeObj] = useState<Lounge | null>(null);
  const [selectedLoungeNameSpace, setSelectedLoungeNameSpace] = useState<string | null>(t('reservation.space'));
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [selectedLoungeForContact, setSelectedLoungeForContact] = useState<Lounge | null>(null);
  const [reservationDetails, setReservationDetails] = useState<ReservationForm>({
    name: '',
    date: '',
    time: '',
    duration: '',
    person: '',
    space: null,
    lounge: null,
    phoneNumber: ''
  });

  const toggleDropdown = (menu: string) => {
    setOpenDropdowns(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleSelectLounge = (id: string, name: string) => {
    const selected = lounges.find(lounge => lounge._id === id);
    if (selected) {
      setSelectedLoungeObj(selected);
      setSelectedLoungeName(name);
      setFormData(prev => ({ ...prev, lounge: selected.name, space: null })); // Simpan nama
      setSelectedLoungeNameSpace(t('reservation.space'));
      toggleDropdown("menu1");
    } else {
      console.warn(`Lounge with ID ${id} not found.`);
      setSelectedLoungeObj(null);
      setSelectedLoungeName(t('reservation.select_lounge'));
      setFormData(prev => ({ ...prev, lounge: null, space: null }));
      setSelectedLoungeNameSpace(t('reservation.space'));
      toggleDropdown("menu1");
    }
  };

  const handleSelectSpace = (space: string) => {
    setFormData(prev => ({ ...prev, space: space }));
    setSelectedLoungeNameSpace(space);
    toggleDropdown("menu2");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, date: e.target.value }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = e.target.value;
    setFormData(prev => ({ ...prev, time: selectedTime }));
    if (selectedLoungeObj && selectedLoungeObj.time) {
      // Contoh validasi waktu, sesuaikan dengan kebutuhan backend Anda
      const [openTimeStr, closeTimeStr] = selectedLoungeObj.time.split(' - ');
      const [openHour, openMinute] = openTimeStr.split(':').map(Number);
      const [closeHour, closeMinute] = closeTimeStr.split(':').map(Number);
      const [selectedHour, selectedMinute] = selectedTime.split(':').map(Number);
  
      const openMinutes = openHour * 60 + openMinute;
      const closeMinutes = closeHour * 60 + closeMinute;
      const selectedMinutes = selectedHour * 60 + selectedMinute;
  
      if (selectedMinutes < openMinutes || selectedMinutes > closeMinutes) {
        setTimeError(t('reservation.time_error'));
      } else {
        setTimeError(null);
      }
    } else {
      setTimeError(null);
    }
  };

  const selectDuration = (duration: string) => {
    setFormData(prev => ({ ...prev, duration: duration }));
    setSelectedDuration(duration);
    toggleDropdown("dropdown5");
  };

  const selectPerson = (person: string) => {
    setFormData(prev => ({ ...prev, person: person }));
    setSelectedPerson(person);
    toggleDropdown("dropdown6");
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key as keyof ReservationForm] !== null) {
        formDataToSend.append(key, formData[key as keyof ReservationForm]!);
      }
    }

    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok && result.success) {
            setSuccessMessage(result.msg);
            setShowConfirmationPopup(true);
            setSelectedLoungeForContact(selectedLoungeObj); // Simpan info lounge
            setFormData({
             name: '',
             phoneNumber: '',
             lounge: null,
             space: null,
             date: '',
             time: '',
             duration: '',
             person: '',
            });
            setReservationDetails({
              name: formData.name,
              date: formData.date,
              time: formData.time,
              duration: formData.duration, 
              person: formData.person,
              space: formData.space,
              phoneNumber: formData.phoneNumber,
              lounge: formData.lounge
            });
            setSelectedLoungeName("Lounge*");
            setSelectedLoungeObj(null);
            setSelectedLoungeNameSpace(t('reservation.space'));
            setSelectedDuration(null);
            setSelectedPerson(null);
           } else {
            setErrorMessage(result.msg || t('Reservation Failed, please try again'));
           }
    } catch {
      setErrorMessage(t('reservation.network_error'));
      console.error('Error');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleSendEmail = (email?: string) => {
      if (email) {
       const subject = 'Reservasi Kalyan Maison'
       const body = `Konfirmasi Reservasi:\n\n` +
                  `Nama: ${reservationDetails.name}\n` +
                  `Tanggal: ${reservationDetails.date}\n` +
                  `Waktu: ${reservationDetails.time}\n` +
                  `Durasi: ${reservationDetails.duration}\n` +
                  `Lounge: ${reservationDetails.lounge}\n` +
                  `Ruang: ${reservationDetails.space}\n` +
                  `Jumlah Orang: ${reservationDetails.person}`;
       window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      } else {
       alert('email');
      }
      setShowConfirmationPopup(false);
     };
    
     const handleSendWhatsApp = (phone: string) => {
      const message = `Konfirmasi Reservasi:\n\n` +
                  `Nama: ${reservationDetails.name}\n` +
                  `Tanggal: ${reservationDetails.date}\n` +
                  `Waktu: ${reservationDetails.time}\n` +
                  `Durasi: ${reservationDetails.duration}\n` +
                  `Lounge: ${reservationDetails.lounge}\n` +
                  `Ruang: ${reservationDetails.space}\n` +
                  `Jumlah Orang: ${reservationDetails.person}`;
      const cleanedPhone = phone.replace(/[^0-9]/g, '');
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanedPhone}&text=${encodeURIComponent(message)}`;
    
      // Buat elemen <a> secara dinamis
      const link = document.createElement('a');
      link.href = whatsappUrl;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click(); // Simulasikan klik pada link
      document.body.removeChild(link); // Bersihkan elemen setelah digunakan
    
      setShowConfirmationPopup(false);
    };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      for (const key in openDropdowns) {
        if (openDropdowns[key] && dropdownRefs.current[key] && !dropdownRefs.current[key]!.contains(event.target as Node)) {
          setOpenDropdowns(prev => ({ ...prev, [key]: false }));
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdowns]);

  if (loadingLounges) {
    return <div>Loading...</div>; // Atau tampilan loading yang lebih baik
  }

  if (!lounges) {
    return <div>Load Failed</div>; // Atau tampilan error yang lebih baik
  }

  return (
    <div className={style.reservation_layout}>
    <form onSubmit={handleSubmit} className={`max-w-md mx-auto mt-8 p-6 border rounded shadow-md ${style.reservationForm}`} style={{ paddingTop: '9vw' }}>
      <div className={style.reservation_content}>
            <h1>{t('reservation.heading')}</h1>
            <p>{t('reservation.description')}</p>
      </div>

      {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{successMessage}</div>}
      {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{errorMessage}</div>}

      <div className={style.reservation_form}>
        <div className={style.form_double}>
          <div className={`${style.dropdown} ${openDropdowns["menu1"] ? style.dropdown_active : ""}`}>
            <button type="button" onClick={() => toggleDropdown("menu1")}>
              {selectedLoungeName} <HiChevronDown />
            </button>
            {openDropdowns["menu1"] && (
              <div
                ref={(el) => { dropdownRefs.current["menu1"] = el; }}
                className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${style.dropdown_menu_show}`}
              >
                {lounges.map((lounge) => (
                  <div key={lounge._id} className={style.loungeContainer}>
                    <button type="button" onClick={() => handleSelectLounge(lounge._id, lounge.name)}>
                      {lounge.name}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={`${style.dropdown} ${openDropdowns["menu2"] ? style.dropdown_active : ""}`}>
            <button type="button" onClick={() => toggleDropdown("menu2")} disabled={!selectedLoungeObj?.spaces?.length}>
              {selectedLoungeNameSpace} <HiChevronDown />
            </button>
            {openDropdowns["menu2"] && (
              <div
                ref={(el) => { dropdownRefs.current["menu2"] = el; }}
                className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${style.dropdown_menu_show}`}
              >
                {selectedLoungeObj?.spaces && selectedLoungeObj.spaces.length > 0 ? (
                  selectedLoungeObj.spaces.map((space, index) => (
                      <div key={index} className={style.loungeContainer}>
                      <button type="button" onClick={() => handleSelectSpace(space as string)}>
                          {space}
                      </button>
                      </div>
                  ))
                  ) : (
                  <div className={style.noSpaces}>{t("reservation.select_first")}</div>
                  )}
              </div>
            )}
          </div>
        </div>
        <div className={style.form_single}>
          <input
            type="text"
            name="name"
            placeholder={t('reservation.name')}
            value={formData.name}
            onChange={handleChangeInput}
            required
          />
        </div>
        <div className={style.form_single}>
          <input
            type="tel"
            name="phoneNumber"
            placeholder={t('reservation.number')}
            value={formData.phoneNumber}
            onChange={handleChangeInput}
            required
          />
        </div>
        <div className={style.form_double}>
          <input
            type="date"
            name="date"
            onChange={handleDateChange}
            className={style.date_input}
            required
          />
          <div className={style.form_single}>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleTimeChange}
              className={style.date_input}
              required
            />
            {timeError && selectedLoungeObj && selectedLoungeObj.time && (
              <p style={{ color: '#FF4646' }}>
                {timeError} ({selectedLoungeObj.time})
              </p>
            )}
          </div>
        </div>
        <div className={style.form_double}>
          <div className={`${style.dropdown} ${openDropdowns["dropdown5"] ? style.dropdown_active : ""}`}>
            <button type="button" onClick={() => toggleDropdown("dropdown5")}>
              {selectedDuration || t('reservation.duration')}  <HiChevronDown />
            </button>
            <div
              ref={(el) => { dropdownRefs.current["dropdown5"] = el; }}
              className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${
                openDropdowns["dropdown5"] ? style.dropdown_menu_show : ""
              }`}
            >
              {[1, 2, 3, 4, 5].map((hour) => (
                <button key={hour} type="button" onClick={() => selectDuration(`${hour} ${t('reservation.hour')}`)}>
                  {hour} {t('reservation.hour')}
                </button>
              ))}
            </div>
          </div>
          <div className={`${style.dropdown} ${openDropdowns["dropdown6"] ? style.dropdown_active : ""}`}>
            <button type="button" onClick={() => toggleDropdown("dropdown6")}>
              {selectedPerson || t('reservation.number_person')} <HiChevronDown />
            </button>
            <div
              ref={(el) => { dropdownRefs.current["dropdown6"] = el; }}
              className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${
                openDropdowns["dropdown6"] ? style.dropdown_menu_show : ""
              }`}
            >
              {[1, 2, 3, 4, 5].map((person) => (
                <button key={person} type="button" onClick={() => selectPerson(`${person}`)}>
                  {person} {t('reservation.person')}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button type="submit" className={style.btn_primary} disabled={loadingSubmit}>
          {loadingSubmit ? 'Mengirim' + '...' : t('reservation.button')}
        </button>
        <div className={style.notif_form}>
          {loadingSubmit && <p>Loading...</p>}
        </div>
      </div>

      {showConfirmationPopup && selectedLoungeForContact && (
    <div className={style.confirmationPopup}>
     <h3>Konfirmasi</h3>
     <p>Pilih Pesan</p>
     <div className={style.popupButtons}>
      <button onClick={() => handleSendEmail(selectedLoungeForContact?.email)}>
       Kirim ke email
      </button>
      {selectedLoungeForContact?.phone && (
       <button onClick={() => handleSendWhatsApp(selectedLoungeForContact.phone)}>
        kirim ke whatsapp
       </button>
      )}
      <button onClick={() => setShowConfirmationPopup(false)}>
       Tutup
      </button>
     </div>
    </div>
   )}
    </form>
    </div>
  );
};

export default Reservation;
