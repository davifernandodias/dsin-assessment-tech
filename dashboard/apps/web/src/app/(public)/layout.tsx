import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import "../globals.css";
import { Toaster } from 'sonner'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Desáfio tecnico DSIN",
  description: "frontend do app de agenda da cabeleila leila",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId }: any =  auth()
  if(userId) redirect('/')
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
      <Toaster />
      {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
