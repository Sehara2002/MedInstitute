import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Family Medicine Forum | MRCGP Fast Track",
  description:
    "Family Medicine Forum (FMF) is a Sri Lanka-based medical education initiative supporting doctors in Family Medicine, General Practice, and Primary Care.",
  icons: {
    icon: '/logo.png',
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
        className={`${inter.variable} ${manrope.variable} font-sans antialiased bg-ink-50 text-ink-900`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}