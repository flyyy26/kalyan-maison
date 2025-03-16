'use client';

import { usePathname } from 'next/navigation';
import AnalyticsProvider from '@/components/analytics/page';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.includes('dashboard');

  return (
    <>
      {isDashboardRoute ? (
        children
      ) : (
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      )}
    </>
  );
}