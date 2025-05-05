import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'], // Tambahkan 'localhost' agar Next.js mengizinkan gambar dari local
  },
};

export default withNextIntl(nextConfig);