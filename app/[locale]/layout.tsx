import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Locale, routing} from '@/i18n/routing';

import { MenuProvider } from '@/context/MenuContext';
import { LocationProvider } from '@/context/LocationContext'; 
import Script from "next/script";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title : "Kalyan Maison",
  description: "Kalyan Maison Official Website",
};

export default async function RootLayout({ children, params }: Readonly<{ children: React.ReactNode; params: {locale: string} }>) {

  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  
  const messages = await getMessages();
  return (
    <html lang={locale}>
       <Script
        strategy="lazyOnload"
        src="http://localhost:3000/script.js"
        data-website-id="58dde6a3-8cc2-4dad-93fc-d42e79d53c30"
      />
      <body className={`${montserrat.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <MenuProvider>
            <LocationProvider>
              {children}
            </LocationProvider>
          </MenuProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}