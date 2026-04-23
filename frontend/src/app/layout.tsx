import type { Metadata, Viewport } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Added weights based on Figma (ExtraBold=800, Bold=700, etc.)
});

export const viewport: Viewport = {
  themeColor: "#4F3422",
};

export const metadata: Metadata = {
  title: "Unwind Mobile | Mental Health Support",
  description: "A calm, supportive mental health companion for students.",
  appleWebApp: {
    title: "Unwind",
    statusBarStyle: "default",
    capable: true,
  },
  icons: {
    apple: "/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${urbanist.variable} antialiased`}
      >
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
