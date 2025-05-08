import Navbar from "@/components/Navbar/page";
import Footer from "@/components/Footer/page";

// ✅ Metadata global untuk halaman ini



export default function MainPageLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
      <Navbar/>
        {children}
      <Footer/>
      </>
    );
  }