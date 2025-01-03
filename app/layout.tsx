import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/page";
import Footer from "@/components/Footer/page"
import { MenuProvider } from '@/context/MenuContext';
import { LocationProvider } from '@/context/LocationContext'; 

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Kalyan Maison",
  description: "Generated by create next app",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable}`}>
        <MenuProvider>
          <LocationProvider>
            <Navbar/>
            {children}
            <Footer/>
          </LocationProvider>
        </MenuProvider>
      </body>
    </html>
  );
}
