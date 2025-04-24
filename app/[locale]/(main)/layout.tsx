import Navbar from "@/components/Navbar/page";
import Footer from "@/components/Footer/page"


export default function MainPageLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
      <Navbar/>
        {children}
      <Footer/>
      </>
    );
  }