import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Locale, routing } from '@/i18n/routing';

import { MenuProvider } from '@/context/MenuContext';
import { LocationProvider } from '@/context/LocationContext';
import ClientLayout from '@/components/clientLayout/page';

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Kalyan Maison",
  description: "Kalyan Maison Official Website",
};

export default async function RootLayout({ children, params }: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${montserrat.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <MenuProvider>
            <LocationProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </LocationProvider>
          </MenuProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}