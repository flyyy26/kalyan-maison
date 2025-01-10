'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface MenuContextProps {
  isOpen: boolean;
  toggleMenu: () => void;
  hoveredImageId: number | null;
  setHoveredImageId: (id: number | null) => void;
  hoveredTab: number | null;
  setHoveredTab: (tab: number | null) => void;
  openSelect: boolean;
  toggleDropdown: () => void;
  activeBannerImage: string;
  setActiveBannerImage: (image: string) => void;
  updateActiveBannerImage: (tabId: number | null, locations: any[]) => void; // Pass locations here
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const [openSelect, setOpenSelect] = useState(false);
  const [activeBannerImage, setActiveBannerImage] = useState('/images/bg_banner.png');

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setOpenSelect(!openSelect);
  };

  const updateActiveBannerImage = (tabId: number | null, locations: any[]) => {
    // Find the new banner image based on the tabId
    const newActiveBannerImage = locations.find((branch) => branch.id === tabId)?.banner || '/images/bg_banner.png';
    
    // Update the active banner image only if it has changed
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
        openSelect,
        toggleDropdown,
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
