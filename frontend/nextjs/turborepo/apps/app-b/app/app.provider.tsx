"use client";

import { WagmiConfig } from "../wagmi.config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { State, WagmiProvider } from "wagmi";
const queryClient = new QueryClient();

interface AppProviderProps {
  initialState: State | undefined;
  children: ReactNode;
}
const AppProvider = ({ children, initialState }: AppProviderProps) => {
  return (
    <WagmiProvider config={WagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default AppProvider;
