"use client"

import Image from 'next/image';
import home from "@/app/style/home.module.css"
import line from "@/public/images/line_banner.png"
import { HiChevronDown } from "react-icons/hi2";
import Link from 'next/link';
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { useMenu } from '@/context/MenuContext';
import { useState } from 'react';

export default function Home() {
  const { isOpen } = useMenu();
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);

  // Array lokasi dengan dua gambar per lokasi
  const locations = [
    { id: 1, name: 'Gunawarman', images: ['/images/gunawarman_1.png', '/images/gunawarman_2.png'] },
    { id: 2, name: 'Sudirman', images: ['/images/sudirman_1.png', '/images/sudirman_2.png'] },
    { id: 3, name: 'Kemang', images: ['/images/kemang_image_1.png', '/images/kemang_image_2.png'] },
  ];

  return (
    <>

      <div className={home.banner}>
        <Image src={line} fill alt="Banner Kalyan Maison" className={home.line}/>
        <div className={home.banner_bottom_content}>
          <div className={home.banner_branch}>
            <button>Jakarta<HiChevronDown /></button>
            <div className={`${home.branch_list} ${isOpen ? home.branch_list_active : ''}`}>
              {locations.map((location) => (
                <Link
                  key={location.id}
                  href="/"
                  onMouseEnter={() => setHoveredImageId(location.id)} // Set ID saat di-hover
                  onMouseLeave={() => setHoveredImageId(null)}
                >
                  {location.name}
                </Link>
              ))}
            </div>
          </div>
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
        <div className={`${home.image_hover} ${hoveredImageId ? home.image_hover_active : ''}`}>
            {hoveredImageId !== null && (
              <>
                {locations
                  .find(loc => loc.id === hoveredImageId)
                  ?.images.map((image, index) => (
                    <div key={index} className={home.image_hover_box}>
                      <Image
                        src={image}
                        fill
                        alt={`Image ${index + 1}`}
                      />
                    </div>
                  ))}
              </>
            )}
        </div>
      </div>

    </>
  );
}
