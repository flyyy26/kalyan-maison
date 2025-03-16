'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useLounge } from '@/hooks/useLounge';
import useCity from '@/hooks/useCity';

type ImageSlide = {
  name: string;
  image: string;
};

type ImageSpaces = {
  _id: string
  name: string;
  image: string;
};

type menu = {
  name: string;
  description:string;
  image: string;
};

type LoungeFe = {
  _id: number;
  name: string;
  slug:string;
  address:string;
  banner: string | File;
  phone:string;
  day:string;
  time:string;
  city: string;
  taglineId: string;
  taglineEn: string;
  taglineBanner: string | File;
  imageSlide: ImageSlide[]; 
  menu: menu[];
  spaces: ImageSpaces[];
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