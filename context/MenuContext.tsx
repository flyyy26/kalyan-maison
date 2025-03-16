'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface MenuContextProps {
  isOpen: boolean;
  toggleMenu: (forceClose?: boolean) => void;
  hoveredImageId: number | null;
  setHoveredImageId: (id: number | null) => void;
  hoveredTab: number | null;
  setHoveredTab: (tab: number | null) => void;
  activeBannerImage: string;
  setActiveBannerImage: (image: string) => void;
  updateActiveBannerImage: (tabId: number | null, loungesFe: any[]) => void; // Pass locations here
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const [activeBannerImage, setActiveBannerImage] = useState('/images/bg_banner.png');

  const toggleMenu = (forceClose?: boolean) => {
    if (forceClose) {
      setIsOpen(false); // Tutup menu secara paksa
    } else {
      setIsOpen((prev) => !prev); // Toggle default
    }
  };

  const updateActiveBannerImage = (tabId: number | null, loungesFe: any[]) => {
      console.log('Tab ID:', tabId);
      console.log('Lounges:', loungesFe);

      const newActiveBannerImage = loungesFe.find((lounge) => lounge._id === tabId)?.banner || '/images/bg_banner.png';
      
      console.log('New Active Banner:', newActiveBannerImage);
      console.log('Current Active Banner:', activeBannerImage);

      if (newActiveBannerImage !== activeBannerImage) {
          setActiveBannerImage(newActiveBannerImage);
      }
  };


  return (
    <MenuContext.Provider
      value={{
        isOpen,
        toggleMenu,
        hoveredImageId,
        setHoveredImageId,
        hoveredTab,
        setHoveredTab,
        activeBannerImage,
        setActiveBannerImage,
        updateActiveBannerImage, // Expose this function
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
