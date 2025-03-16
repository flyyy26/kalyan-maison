'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/public/images/logo.png";

export default function LoadingPopup({ duration = 1000 }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer); // Bersihkan timeout jika komponen unmount
    }, [duration]);

    return (
        <div className={`popup-overlay ${visible ? "show" : "hide"}`}>
            <div className={`popup-content ${visible ? "fade-in" : "fade-out"}`}>
                <div className="popup-box">
                    <div className="logo-loading">
                        <Image fill src={Logo} alt='Kalyan Maison Logo' objectFit='contain'/>
                    </div>
                    <p>Loading</p>
                </div>
                
            </div>
        </div>
    );
}
