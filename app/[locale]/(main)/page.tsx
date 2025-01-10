// import Image from 'next/image';
import home from "@/app/[locale]/style/home.module.css"
// import line from "@/public/images/line_banner.png"
// import { HiChevronDown } from "react-icons/hi2";
// import { useMenu } from '@/context/MenuContext';
// import { useLocationContext } from '@/context/LocationContext'; 
// import Link from 'next/link';
// import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";
import ContactSection from "@/components/Contact_section/page"
// import {useTranslations} from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Banner from "@/components/banner/page"
import ListLounge from '@/components/listLounge/page';
import { Link } from '@/i18n/routing';

export default async function Home() {
  const t = await getTranslations();

  return (
    <>
      <Banner/>
      <ListLounge/>
      <div className={home.button_layout}>
        <Link href="/our-lounges"><button>{t('allLounges')}</button></Link>
      </div>
      <ContactSection/>
    </>
  );
}
