import React, { createContext, useContext, useState, ReactNode } from "react";

type GlobalContextType = {
  name: string;
  setName: (name: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState("Fullstack CRUD Debentures");
  const [open, setOpen] = useState(true);

  return (
    <GlobalContext.Provider value={{ name, setName, open, setOpen }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalContext must be used within GlobalProvider");
  return context;
};
