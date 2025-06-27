// File: app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Katalog Buku Interaktif",
  description: "Cari dan simpan buku favoritmu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth bg-white dark:bg-gray-950">
      <body className={`${poppins.className} text-gray-800 dark:text-gray-200 transition-colors duration-300`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8 md:py-12">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
