import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { ChakraProvider } from "@chakra-ui/react";
import { Component } from "react";

const FontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CemoMapper",
  description:
    "CemoMapper is an application for adding, listing, and editing locations, displaying them on a map, and drawing routes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
