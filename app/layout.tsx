import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bayern Systems - Elevator Configurator",
  description: "Configure your custom elevator with Bayern Systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col m-0 p-0 overflow-hidden text-bayern-black bg-bayern-lightgrey">
        {children}
      </body>
    </html>
  );
}
