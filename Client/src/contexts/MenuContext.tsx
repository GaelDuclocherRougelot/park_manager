import React, { ReactNode, createContext, useContext, useState } from "react";

interface MenuContextType {
  menuIsOpen: boolean;
  setMenuIsOpen: (menuIsOpen: boolean) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useAuth must be used within an MenuProvider");
  }
  return context;
};

export const MenuProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  return (
    <MenuContext.Provider value={{ menuIsOpen, setMenuIsOpen }}>
      {children}
    </MenuContext.Provider>
  );
};
