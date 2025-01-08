import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import { MenuProvider } from '@/context/MenuContext';
import { LocationProvider } from '@/context/LocationContext'; 

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Kalyan Maison",
  description: "Kalyan Maison Official Website",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable}`}>
        <MenuProvider>
          <LocationProvider>
            {children}
          </LocationProvider>
        </MenuProvider>
      </body>
    </html>
  );
}