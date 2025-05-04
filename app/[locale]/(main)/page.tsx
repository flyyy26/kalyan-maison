// import Image from 'next/image';
// import line from "@/public/images/line_banner.png"
// import { HiChevronDown } from "react-icons/hi2";
// import { useMenu } from '@/context/MenuContext';
// import { useLocationContext } from '@/context/LocationContext'; 
// import Link from 'next/link';
// import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";
import ContactSection from "@/components/Contact_section/page"
// import {useTranslations} from 'next-intl';
import Banner from "@/components/banner/page"
import ListLounge from '@/components/listLounge/page';
import LoadingPopup from '@/components/loading_popup/page';
import GallerySection from "@/components/GallerySection/page";

export default async function Home() {

  return (
    <>
    <LoadingPopup duration={700} />
      <Banner/>
      <ListLounge/>
      {/* <div className={home.button_layout}>
        <Link href="/our-lounges"><button>{t('allLounges')}</button></Link>
      </div> */}
      <GallerySection/>
      <ContactSection/>  
    </>
  );
}
