'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipe untuk data lokasi
interface Location {
  id: number;
  name: string;
  cover: string;
  banner_image: string;
  images: string[];
  address: string;
  phone: string;
  day: string;
  time: string;
  className: 'btn_tab_left' | 'btn_tab_right' | 'btn_tab_bottom';  // Mendefinisikan nilai className yang valid
}

// Tipe untuk context value
interface LocationContextType {
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
}

// Data lokasi
const initialLocations: Location[] = [
  { id: 1, name: 'Gunawarman', cover: '/images/gunawarman_cover.png', banner_image: '/images/gunawarman_banner.png', images: ['/images/gunawarman_1.png', '/images/gunawarman_2.png'], address: 'Jl. Gunawarman No.16, Selong, Kec. Kby. Baru, Jakarta, Daerah Khusus Ibukota Jakarta 12110, Indonesia', phone: '852-8146-6683', day: 'MON - SUN', time :'03.00-21.00', className: 'btn_tab_bottom' },
  { id: 2, name: 'Sudirman', cover: '/images/sudirman_cover.png', banner_image: '/images/sudirman_banner.png', images: ['/images/sudirman_1.png', '/images/sudirman_2.png'], address: 'Jl. Gunawarman No.16, Selong, Kec. Kby. Baru, Jakarta, Daerah Khusus Ibukota Jakarta 12110, Indonesia', phone: '852-8146-6683', day: 'MON - SUN', time :'03.00-21.00', className: 'btn_tab_right' },
  { id: 3, name: 'Kemang', cover: '/images/kemang_cover.png', banner_image: '/images/kemang_banner.png', images: ['/images/kemang_image_1.png', '/images/kemang_image_2.png'], address: 'Jl. Gunawarman No.16, Selong, Kec. Kby. Baru, Jakarta, Daerah Khusus Ibukota Jakarta 12110, Indonesia', phone: '852-8146-6683', day: 'MON - SUN', time :'03.00-21.00', className: 'btn_tab_left' },
];

// Membuat context dengan tipe LocationContextType
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Provider untuk LocationContext
interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [locations, setLocations] = useState<Location[]>(initialLocations);

  return (
    <LocationContext.Provider value={{ locations, setLocations }}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook untuk menggunakan context
export const useLocationContext = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
