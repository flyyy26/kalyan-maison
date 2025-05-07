'use client'

import LoadingPopup from "@/components/loading_popup/page";
import contact from "@/app/[locale]/style/contact.module.css"
import useLounge from "@/hooks/useLounge";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { MdEmail } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { IoLogoYoutube, IoLogoWhatsapp } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";

export default function Contact(){
    const { loungesFe } = useLounge();

    return(
        <>
            <LoadingPopup duration={700} />
            <div className={contact.contact_container}>
                <div className={contact.contact_header}>
                    <span>Contact</span>
                    <h1>Kalyan Maison</h1>
                </div>
                <div className={contact.contact_layout}>
                    {loungesFe.map((lounges, index) => {
                        const isEven = index % 2 === 0;

                        return (
                        <div className={contact.contact_box} key={index}>
                            {isEven && (
                            <div className={contact.contact_maps}>
                                <div dangerouslySetInnerHTML={{ __html: lounges.maps }} />
                            </div>
                            )}

                            <div className={contact.contact_content}>
                            <div className={contact.contact_logo}>
                                <Image
                                src={
                                    lounges.logo instanceof File
                                    ? URL.createObjectURL(lounges.logo)
                                    : lounges.logo
                                }
                                width={800}
                                height={800}
                                alt={lounges.name}
                                style={{ height: "auto", objectFit: "contain" }}
                                />
                            </div>

                            <p>{lounges.address}</p>
                            <span>{lounges.day} | {lounges.time}</span>

                            <div className={contact.social_lounge_detail}>
                                {lounges.instagram && lounges.instagram !== "undefined" && (
                                <Link href={lounges.instagram} target="_blank"><FaInstagram /></Link>
                                )}
                                {lounges.youtube && lounges.youtube !== "undefined" && (
                                <Link href={lounges.youtube} target="_blank"><IoLogoYoutube /></Link>
                                )}
                                {lounges.whatsapp && lounges.whatsapp !== "undefined" && (
                                <Link href={`https://api.whatsapp.com/send?phone=${lounges.whatsapp}`} target="_blank"><IoLogoWhatsapp /></Link>
                                )}
                                {lounges.email && lounges.email !== "undefined" && (
                                <Link href={`mailto:${lounges.email}`} target="_blank"><MdEmail /></Link>
                                )}
                                {lounges.facebook && lounges.facebook !== "undefined" && (
                                <Link href={lounges.facebook} target="_blank"><FaFacebook /></Link>
                                )}
                            </div>

                            <Link href={`/our-lounges/${lounges.slug}`}>
                                <button>Visit Lounge</button>
                            </Link>
                            </div>

                            {!isEven && (
                            <div className={contact.contact_maps}>
                                <div dangerouslySetInnerHTML={{ __html: lounges.maps }} />
                            </div>
                            )}
                        </div>
                        );
                    })}
                    </div>

            </div>
        </>
    );
}