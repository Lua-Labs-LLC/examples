"use client";

import { ReactNode, createContext } from "react";

interface AppProviderProps {
  children: ReactNode;
  userId?: string;
}

interface AppState {
  userId?: string;
}
export const AppContext = createContext({} as AppState);
const AppProvider = ({ children, userId }: AppProviderProps) => {
  return (
    <>
      <AppContext.Provider value={{ userId }}>{children}</AppContext.Provider>
    </>
  );
};

export default AppProvider;
