// import style from '@/app/[locale]/style/lounge_detail.module.css';
// import Image from 'next/image';
// import ClientSwiper from '@/components/slideLounge/page';
// import ContactSection from '@/components/Contact_section/page'
// import { Link } from '@/i18n/routing';
// import { BsChevronLeft } from "react-icons/bs";
// import { getTranslations } from 'next-intl/server';
// import { useLounge } from '@/hooks/useLounge';

// export default async function DetailLounge({
//     params, 
//     }: {
//         params: Promise<{ lounge_detail: string }>;
//     }) {

//     const {
//         lounges,
//     } = useLounge();

//     const t = await getTranslations();

//     const loungeDetail = (await params).lounge_detail;

//     const currentLounge = lounges.find((lounge) => lounge.slug === loungeDetail); 

//     const filteredLocations = lounges.filter((lounge) => lounge.slug !== loungeDetail);

//     const swiperImages = currentLounge ? currentLounge.menu.map(item => item.image) : [];
//     const swiperHeading = currentLounge ? currentLounge.menu.map(item => item.name) : [];
//     const swiperDescription = currentLounge ? currentLounge.menu.map(item => item.description) : [];

//     return( 
//         <>
//             {currentLounge ? (
//                 <>
//                     <div className={style.banner}  style={{ background: `url(${currentLounge.banner}`}}>
//                         <div className={style.location_arrow}>
//                             {filteredLocations.map((location_item) => (
//                                 <Link href={`/our-lounges/${location_item.slug}`} className={style.next_lounge} key={location_item._id}><BsChevronLeft/>{location_item.name}</Link>
//                             ))}
//                         </div>
//                         <div className={style.heading_banner}>
//                             <h1>Kalyan Maison {currentLounge.name}</h1>
//                             <p>{currentLounge.address}</p>
//                             <p>+62 {currentLounge.phone}</p>
//                         </div>
//                     </div>
//                     <div className={style.section_2}>
//                         <h1>{t('lounge.sectionHeading')}</h1>
//                         <div className={style.section_2_img}>
//                             <Image src={currentLounge.spaces?.[0].image} fill objectFit='cover' alt={`Kalyan Maison ${currentLounge.name}`}/>
//                         </div>
//                     </div>
//                     <div className={style.section_3}>
//                         <ClientSwiper slides={swiperImages} heading={swiperHeading} desc={swiperDescription} />
                        
//                     </div>
//                     <div className={style.section_4}>
//                         <div className={style.section_4_heading}>
//                             <h1>{t('lounge.spaces')}</h1>
//                         </div>
//                         <div className={style.section_4_layout}>
//                             {currentLounge.spaces.map((image, index) => (
//                                 <div className={style.spaces_box} key={index}>
//                                     <Image src={image.image} fill objectFit='cover' alt={`Kalyan Maison ${currentLounge.name}`}/>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     <ContactSection/>
//                 </>
//             ) : (
//                 <h1>Blog not found</h1>
//             )}
//         </>
//     )
// }

import { getTranslations } from "next-intl/server";
import LoungeDetailPage from "@/components/lounge_detail/page";
import LoadingPopup from "@/components/loading_popup/page";

export default async function DetailLounge({ params }: { params: Promise<{ lounge_detail: string }> }) {
    

    const t = await getTranslations();
    
    // Ambil teks terjemahan yang dibutuhkan
    const translations = {
        sectionHeading: t("lounge.sectionHeading"),
        spaces: t("lounge.spaces"),
    };
    

    return (
        <>
            <LoadingPopup duration={700} />
            <LoungeDetailPage loungeDetail={(await params).lounge_detail} translations={translations} />
        </>
    );  
}
