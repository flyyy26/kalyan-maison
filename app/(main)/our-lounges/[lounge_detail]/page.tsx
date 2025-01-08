import style from '@/app/style/lounge_detail.module.css';
import Image from 'next/image';
import ClientSwiper from '@/components/slideLounge/page';
import ContactSection from '@/components/Contact_section/page'
import Link from 'next/link';
import { BsChevronLeft } from "react-icons/bs";

export default async function DetailLounge({
    params,
    }: {
        params: Promise<{ lounge_detail: string }>;
    }) {

    const Locations = [
        { id: 1, slug: 'gunawarman', name: 'Gunawarman', gallery: ['/images/galeri_1.png', '/images/galeri_2.png', '/images/galeri_4.png'], banner: '/images/gunawarman_cover.png', section_image: ['/images/gunawarman_banner.png', '/images/sudirman_banner.png', '/images/kemang_banner.png', '/images/gunawarman_cover.png'], images_circle: ['/images/gunawarman_1.png', '/images/gunawarman_2.png'], address: 'Jl. Gunawarman No.16, Selong, Kec. Kby. Baru, Jakarta, Daerah Khusus Ibukota Jakarta 12110, Indonesia', phone: '852-8146-6683', day: 'MON - SUN', time :'03.00-21.00', className: 'btn_tab_bottom' },
        { id: 2, slug: 'sudirman', name: 'Sudirman', gallery: ['/images/galeri_3.png', '/images/galeri_2.png', '/images/galeri_1.png'], banner: '/images/sudirman_cover.png', section_image: ['/images/sudirman_banner.png', '/images/kemang_banner.png', '/images/gunawarman_banner.png', '/images/gunawarman_cover.png'], images_circle: ['/images/sudirman_1.png', '/images/sudirman_2.png'], address: 'Jl. Gunawarman No.16, Selong, Kec. Kby. Baru, Jakarta, Daerah Khusus Ibukota Jakarta 12110, Indonesia', phone: '852-8146-6683', day: 'MON - SUN', time :'03.00-21.00', className: 'btn_tab_right' },
        { id: 3, slug: 'kemang', name: 'Kemang', gallery: ['/images/galeri_4.png', '/images/galeri_2.png', '/images/galeri_3.png'], banner: '/images/kemang_cover.png', section_image: ['/images/kemang_banner.png', '/images/sudirman_banner.png', '/images/gunawarman_banner.png', '/images/gunawarman_cover.png'], images_circle: ['/images/kemang_image_1.png', '/images/kemang_image_2.png'], address: 'Jl. Gunawarman No.16, Selong, Kec. Kby. Baru, Jakarta, Daerah Khusus Ibukota Jakarta 12110, Indonesia', phone: '852-8146-6683', day: 'MON - SUN', time :'03.00-21.00', className: 'btn_tab_left' },
    ];

    const loungeDetail = (await params).lounge_detail;

    const currentLounge = Locations.find((lounge) => lounge.slug === loungeDetail);

    const filteredLocations = Locations.filter((lounge) => lounge.slug !== loungeDetail);

    const swiperImages = currentLounge ? currentLounge.gallery : [];

    return( 
        <>
            {currentLounge ? (
                <>
                    <div className={style.banner}  style={{ background: `url(${currentLounge.banner}`}}>
                        <div className={style.location_arrow}>
                            {filteredLocations.map((location_item) => (
                                <Link href={`/our-lounges/${location_item.slug}`} className={style.next_lounge} key={location_item.id}><BsChevronLeft/>{location_item.name}</Link>
                            ))}
                        </div>
                        <div className={style.heading_banner}>
                            <h1>Kalyan Maison {currentLounge.name}</h1>
                            <p>{currentLounge.address}</p>
                            <p>+62 {currentLounge.phone}</p>
                        </div>
                    </div>
                    <div className={style.section_2}>
                        <h1>An innovative lounge in the heart of Jakarta</h1>
                        <div className={style.section_2_img}>
                            <Image src={currentLounge.section_image[2]} fill objectFit='cover' alt={`Kalyan Maison ${currentLounge.name}`}/>
                        </div>
                    </div>
                    <div className={style.section_3}>
                        <ClientSwiper slides={swiperImages} />
                        <div className={style.heading_slide}>
                            <button>Bar Lounge</button>
                            <p>100+ Beverage Choices</p>
                        </div>
                    </div>
                    <div className={style.section_4}>
                        <div className={style.section_4_heading}>
                            <h1>OUR SPACES</h1>
                        </div>
                        <div className={style.section_4_layout}>
                            {currentLounge.section_image.map((image, index) => (
                                <div className={style.spaces_box} key={index}>
                                    <Image src={image} fill objectFit='cover' alt={`Kalyan Maison ${currentLounge.name}`}/>
                                </div>
                            ))}
                        </div>
                    </div>
                    <ContactSection/>
                </>
            ) : (
                <h1>Blog not found</h1>
            )}
        </>
    )
}