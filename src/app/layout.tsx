import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Provider from "./provider";
import NavBar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WikiMusic",
  description: "Toda la info de tus artistas y albums favoritos!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <Provider>
          <NavBar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
