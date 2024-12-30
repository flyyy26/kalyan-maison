'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface MenuContextProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <MenuContext.Provider value={{ isOpen, toggleMenu }}>
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
