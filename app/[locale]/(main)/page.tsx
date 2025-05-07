import ContactSection from "@/components/Contact_section/page"
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
      <GallerySection/>
      <ContactSection/>  
    </>
  );
}
