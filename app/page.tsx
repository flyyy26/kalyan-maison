"use client"

import Image from 'next/image';
import home from "@/app/style/home.module.css"
import line from "@/public/images/line_banner.png"
import { HiChevronDown } from "react-icons/hi2";
import Link from 'next/link';
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { useMenu } from '@/context/MenuContext';
import { useLocationContext } from '@/context/LocationContext'; 
import { useState } from 'react';

export default function Home() {
  const { isOpen } = useMenu();
  const { locations } = useLocationContext();
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);

  const [openSelect, setOpenSelect] = useState(false);

  const toggleDropdown = () => {
    setOpenSelect(!openSelect); // Toggle dropdown visibility
  };

  // Array lokasi dengan dua gambar per lokasi
  // const locations = [
  //   { id: 1, name: 'Gunawarman', cover: '/images/gunawarman_cover.png', banner_image: '/images/gunawarman_banner.png' ,images: ['/images/gunawarman_1.png', '/images/gunawarman_2.png'], address: 'Jl. Gunawarman No.16, Selong, Kec. Kby. Baru, Jakarta, Daerah Khusus Ibukota Jakarta 12110, Indonesia', phone: '852-8146-6683', day: 'MON - SUN', time :'03.00-21.00', className: home.btn_tab_bottom, },
  //   { id: 2, name: 'Sudirman', cover: '/images/sudirman_cover.png', banner_image: '/images/sudirman_banner.png' ,images: ['/images/sudirman_1.png', '/images/sudirman_2.png'], address: 'Jl. Gunawarman No.16, Selong, Kec. Kby. Baru, Jakarta, Daerah Khusus Ibukota Jakarta 12110, Indonesia', phone: '852-8146-6683', day: 'MON - SUN', time :'03.00-21.00', className: home.btn_tab_right},
  //   { id: 3, name: 'Kemang', cover: '/images/kemang_cover.png', banner_image: '/images/kemang_banner.png' ,images: ['/images/kemang_image_1.png', '/images/kemang_image_2.png'], address: 'Jl. Gunawarman No.16, Selong, Kec. Kby. Baru, Jakarta, Daerah Khusus Ibukota Jakarta 12110, Indonesia', phone: '852-8146-6683', day: 'MON - SUN', time :'03.00-21.00', className: home.btn_tab_left},
  // ];

  const activeBannerImage =
  locations.find((branch) => branch.id === hoveredTab)?.cover || '/images/bg_banner.png';

  return (
    <>

      <div className={home.banner} style={{ backgroundImage: `url(${activeBannerImage})` }}> 
        <Image src={line} fill alt="Banner Kalyan Maison" className={home.line}/>
        {locations.map((location) => (
          <div
            key={location.id}
            className={`${home.btn_tab} ${home[location.className]}`}// Tambahkan class posisi
          >
            <Link href='https://youtube.com' target='blank_'
              className={`${home.circle} ${
                hoveredTab === location.id ? home.active : ''
              }`} // Tambahkan class jika dihover
              onMouseEnter={() => setHoveredTab(location.id)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              {hoveredTab === location.id && <span>Visit Branch</span>} {/* Munculkan tulisan */}
            </Link>
            <span
              className={`${home.tab_name} ${
                hoveredTab === location.id ? home.hidden : ''
              }`} // Sembunyikan span jika dihover
            >
              {location.name}
            </span>
          </div>
        ))}
        <div className={`${home.heading_banner} ${hoveredTab ? home.active : ''}`}>
          <span>Welcome To</span>
          <h1>Kalyan Maison</h1>
        </div>
        {locations.map((branch) => (
          <div
            key={branch.id}
            className={`${home.detail_branch_banner} ${
              hoveredTab === branch.id ? home.active : ''
            }`}
          >
            <div className={home.heading_banner_dynamic}>
              <h1>Kalyan Maison {branch.name}</h1>
              <p>{branch.address}</p>
              <p>+62 {branch.phone}</p>
            </div>
            <div className={home.galeri_banner_dynamic}>
              {branch.images.map((image, index) => (
                <div key={index} className={home.galeri_banner_dynamic_box}>
                  <Image src={image} fill alt={`Banner Image ${branch.name}`} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className={home.banner_bottom_content}>
          <div className={home.banner_branch}>
            <div className={`${home.dropdown} ${openSelect ? home.dropdown_active : ''}`}>
              <button onClick={toggleDropdown}>
                Jakarta <HiChevronDown />
              </button>
              <div className={`${home.dropdown_menu} ${openSelect ? home.dropdown_menu_show : ''}`}>
                <button>Bali</button>
              </div>
            </div>
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
      </div>
      <div className={home.section_2}>
        <div className={home.section_2_content}>
          <h1>Unique Hookah Experience</h1>
          <p>We perfected every hookah to your request, whether you want it to be soft or strong, bland or flavourful, your hookah will be personalized according how you like it. It is one of our commitment to give you a hookah experience that you`ve never had before.</p>
        </div>
      </div>
      {locations.map((location, index) => (
        index % 2 === 0 ? (
          <div
            className={home.branch_section}
            key={location.id}
            style={{
              background: `url(${location.banner_image}), linear-gradient(179.66deg, rgba(26, 26, 26, 0) 0.29%,rgba(26, 26, 26, 0.29) 63.24%)`
            }}
          >
            <div className={home.branch_layout}>
              <button className={home.branch_heading}>{location.name}</button>
              <div className={home.branch_detail_layout}>
                <p className={home.address_content}>{location.address}</p>
                <div className={home.branch_time}>
                  <span>{location.day}</span>
                  <p>{location.time}</p>
                </div>
              </div>
              <div className={home.branch_phone}>
                <p>+62 {location.phone}</p>
              </div>
            </div>
            <div className={home.branch_layout}>
              <div className={home.branch_button}>
                <Link href="/"><button>Explore More</button></Link>
                <Link href="/"><button>Menu</button></Link>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`${home.branch_section} ${home.branch_section_2}`}
            key={location.id}
            style={{
              background: `url(${location.banner_image}), linear-gradient(179.66deg, rgba(26, 26, 26, 0) 0.29%,rgba(26, 26, 26, 0.29) 63.24%)`
            }}
          >
            <div className={home.branch_layout}>
              <div className={home.branch_button}>
                <Link href="/"><button>Explore More</button></Link>
                <Link href="/"><button>Menu</button></Link>
              </div>
            </div>
            <div className={`${home.branch_layout} ${home.branch_layout_right}`}>
              <button className={home.branch_heading}>{location.name}</button>
              <div className={home.branch_detail_layout_2}>
                <div className={home.branch_time}>
                  <span>{location.day}</span>
                  <p>{location.time}</p>
                </div>
                <p className={home.address_content}>{location.address}</p>
              </div>
              <div className={home.branch_phone}>
                <p>+62 {location.phone}</p>
              </div>
            </div>
          </div>
        )
      ))}

      <div className={home.section_contact}>
        <div className={home.button_layout}>
          <Link href="/"><button>All Lounges</button></Link>
        </div>

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
  );
}
