'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import { useLounge } from '@/hooks/useLounge';
import useCity from '@/hooks/useCity';

type LoungeFe = {
  logo: string | File;
  instagram: string;
  facebook: string;
  maps: string;
  youtube: string;
  email: string;
  whatsapp: string;
_id: number;
  name: string;
  slug:string;
  address:string;
  banner: string | File;
  phone:string;
  day:string;
  time:string;
  city: string;
  menuImages: []; 
  spaces: string[]; 
  otherImages: [];
  date: string;
  className: 'btn_tab_left' | 'btn_tab_right' | 'btn_tab_bottom'; 
};

// Tipe untuk context value 
interface LocationContextType {
  loungesFe: LoungeFe[];
  setLoungesFe: React.Dispatch<React.SetStateAction<LoungeFe[]>>;
}


// Membuat context dengan tipe LocationContextType
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Provider untuk LocationContext
interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const {
      loungesFe,
      setLoungesFe,
    } = useLounge();
  
  const {
    cities,
    setCities,
  } = useCity();
  

  return (
    <LocationContext.Provider value={{ loungesFe, setLoungesFe }}>
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