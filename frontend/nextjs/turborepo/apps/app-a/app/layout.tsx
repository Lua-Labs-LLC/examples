import AppProvider from "./app.provider";
import { cn } from "@repo/shared/utils/tailwind";
import { WagmiConfig } from "../wagmi.config";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { Footer } from "./components/footer/footer";
import { Header } from "./components/header/header";
import "@repo/shared/globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EVM Wallet Authentication",
  description: "Next.js EVM Wallet Authentication example created by Lua Labs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    WagmiConfig,
    headers().get("cookie")
  );
  return (
    <html lang="en">
      <AppProvider initialState={initialState}>
        <body className={cn(inter.className, "dark")}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
          </div>
        </body>
      </AppProvider>
    </html>
  );
}
