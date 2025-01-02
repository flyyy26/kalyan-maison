import React from 'react'
import Link from 'next/link';
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";
import home from "@/app/style/home.module.css"

const page = () => {
  return (
    <>
      <div className={home.section_contact}>
        

        <div className={home.contact_container}>
          <div className={home.contact_layout}>
            <h1 className={home.heading_contact}>Need More Information?</h1>
            <p>Please don’t hesitate to reach out to one of our representative for further inquiries.</p>
            <div className={home.banner_social_media}>
              <Link href="/">
                <button className={home.banner_social_media_box}>
                  <FaInstagram />
                </button>
              </Link>
              <Link href="/">
                <button className={home.banner_social_media_box}>
                  <FaFacebook />
                </button>
              </Link>
              <Link href="/">
                <button className={home.banner_social_media_box}>
                  <FaTiktok />
                </button>
              </Link>
              <Link href="/">
                <button className={home.banner_social_media_box}>
                  <FaWhatsapp />
                </button>
              </Link>
            </div>
          </div>
          <div className={home.contact_layout}>
              <div className={home.contact_button}>
                <Link href="/"><button>Contact Via Whatsapp</button></Link>
                <Link href="/"><button>Contact Via Instagram</button></Link>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default page
