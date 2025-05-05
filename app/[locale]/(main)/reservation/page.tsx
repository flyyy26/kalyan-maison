'use client'

import React from 'react'
import style from '@/app/[locale]/style/reservation.module.css'
import { useState, useRef } from 'react';
import { HiChevronDown } from "react-icons/hi2";
import ContactSection from "@/components/Contact_section/page"
import { useTranslations } from 'next-intl';
import { useLounge } from '@/hooks/useLounge';
import { useReservation } from '@/hooks/useReservation';
import LoadingPopup from '@/components/loading_popup/page';

const Reservation = () => { 
    const {
        lounges,
        loading,
        setLoading,
      } = useLounge();

    const {
        error,
        setError,
        success,
        setSuccess,
        addReservation
    } = useReservation();
    const t =  useTranslations();
    const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
    const [selectedLounge, setSelectedLounge] = useState<string | null>(null);
    const [selectedLoungeSpace, setSelectedLoungeSpace] = useState<string | null>(null);
    const [selectedLoungeName, setSelectedLoungeName] = useState<string>("Lounge*");
    const [selectedLoungeNameSpace, setSelectedLoungeNameSpace] = useState<string>(t("reservation.space"));
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
    const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
    const [name, setName] = useState<string>("");
    const [number, setNumber] = useState<string>("");
    const [timeError, setTimeError] = useState<string | null>(null);

    // Toggle dropdown visibility
    const toggleDropdown = (id: string) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle only the selected dropdown
        }));
    };

    // Handle Lounge Selection
    const handleSelectLounge = (loungeId: string, loungeName: string) => {
        setSelectedLounge(loungeId);
        setSelectedLoungeName(loungeName);
        setOpenDropdowns((prev) => ({ ...prev, menu1: false }));
        setSelectedLoungeSpace(null); // Reset space selection when lounge changes
        setSelectedLoungeNameSpace(t("reservation.space"));
    };

    // Handle Space Selection
    const handleSelectSpace = (spaceId: string, spaceName: string) => {
        setSelectedLoungeSpace(spaceId);
        setSelectedLoungeNameSpace(spaceName);
        setOpenDropdowns((prev) => ({ ...prev, menu2: false }));
    };

    const availableSpaces = [
        { _id: "1", name: "VIP Lounge" },
        { _id: "2", name: "Outdoor Area" },
        { _id: "3", name: "Private Room" },
      ];

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedLoungeData = lounges.find(lounge => lounge._id === selectedLounge);
        if (selectedLoungeData) {
            const [openTime, closeTime] = selectedLoungeData.time.split('-').map(time => time.trim());
            const selectedTimeValue = event.target.value;

            if (selectedTimeValue < openTime || selectedTimeValue > closeTime) {
                setTimeError('⚠️ Melewati jam buka');
                setSelectedTime(null);
            } else {
                setTimeError(null);
                setSelectedTime(selectedTimeValue);
            }
        }
    };

    const selectDuration = (duration: string) => {
        setSelectedDuration(duration);
        setOpenDropdowns({ dropdown5: false }); // Tutup dropdown setelah memilih durasi
    };

    const selectPerson = (person: string) => {
        setSelectedPerson(person);
        setOpenDropdowns({ dropdown6: false }); // Tutup dropdown setelah memilih durasi
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        setError(null);
        setSuccess(null);
    
        // Form Validation
        if (!selectedLounge || !selectedLoungeSpace || !selectedTime || !selectedDate || !selectedDuration || !selectedPerson || !name || !number) {
            setError('⚠️ Semua kolom harus diisi!');
            return;
        }
    
        const formData = new FormData();
        formData.append('lounge', selectedLoungeName);
        formData.append('space', selectedLoungeNameSpace);
        formData.append('date', selectedDate);
        formData.append('duration', selectedDuration);
        formData.append('person', selectedPerson);
        formData.append('name', name);
        formData.append('phoneNumber', number);
        formData.append('time', selectedTime);
    
        setLoading(true);
    
        try {
            const success = await addReservation(formData);
            if (success) {
                setSelectedDuration(null);
                setSelectedPerson(null);
                setSelectedTime(null);
                setName('');
                setNumber('');
            } else {
                setError('⚠️ Gagal melakukan reservasi.');
            }
        } catch {
            setError('⚠️ Terjadi kesalahan jaringan.');
        } finally {
            setLoading(false);
        }   
    };

  return (
    <>
        <LoadingPopup duration={700} />
         <div className={style.reservation_layout}>
            <div className={style.reservation_content}>
                <h1>{t('reservation.heading')}</h1>
                <p>{t('reservation.description')}</p>
            </div>
            <div className={style.reservation_form}>
                <form onSubmit={handleSubmit}>
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
                            <button type="button" onClick={() => toggleDropdown("menu2")}>
                                {selectedLoungeNameSpace} <HiChevronDown />
                            </button>
                            {openDropdowns["menu2"] && (
                                <div
                                    ref={(el) => { dropdownRefs.current["menu2"] = el; }}
                                    className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${style.dropdown_menu_show}`}
                                >
                                    {availableSpaces.length > 0 ? (
                                        availableSpaces.map((space) => (
                                            <div key={space._id} className={style.loungeContainer}>
                                                <button type="button" onClick={() => handleSelectSpace(space._id, space.name)}>
                                                    {space.name}
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={style.noSpaces}>{t('reservation.select_first')}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={style.form_single}>
                        <input type="text" placeholder={t('reservation.name')} value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className={style.form_single}>
                        <input type="text" placeholder={t('reservation.number')} value={number} onChange={(e) => setNumber(e.target.value)} />
                    </div>
                    <div className={style.form_double}>
                        <input type="date" onChange={handleDateChange} className={style.date_input} />
                        <div className={style.form_single}>
                            <input type="time" value={selectedTime || ''} onChange={handleTimeChange} className={style.date_input} />
                            {timeError && selectedLounge && (
                                <p style={{ color: '#FF4646' }}>
                                    {timeError} {lounges.find(lounge => lounge._id === selectedLounge)?.time}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className={style.form_double}>
                        <div className={`${style.dropdown} ${openDropdowns["dropdown5"] ? style.dropdown_active : ""}`}>
                            <button type="button" onClick={() => toggleDropdown("dropdown5")}>
                                {selectedDuration ? selectedDuration : t('reservation.duration')} <HiChevronDown />
                            </button>
                            <div
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
                                {selectedPerson ? selectedPerson :  t('reservation.number_person')} <HiChevronDown />
                            </button>
                            <div
                                className={`${style.dropdown_menu} ${style.dropdown_menu_bottom} ${
                                openDropdowns["dropdown6"] ? style.dropdown_menu_show : ""
                                }`}
                            >
                                {[1, 2, 3, 4, 5].map((person) => (
                                <button key={person} type="button" onClick={() => selectPerson(`${person} ${t('reservation.person')}`)}>
                                    {person} {t('reservation.person')}
                                </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button type="submit" className={style.btn_primary}>{t('reservation.button')}</button>
                    <div className={style.notif_form}>
                        {loading && <p>Loading...</p>}
                        {error && <p style={{ color: '#FF4646' }}>{t('reservation.reservation_error')}</p>}
                        {success && <p style={{ color: '#26FF00' }}>{t('reservation.reservation_success')}</p>}
                    </div>
                </form>
            </div>
         </div>
         <ContactSection/>
    </>
  )
}

export default Reservation
