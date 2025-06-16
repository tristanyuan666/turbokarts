import { TempoInit } from "@/components/tempo-init";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import RevolutionaryCursor from "@/components/RevolutionaryCursor";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TurboKart - Ultimate Premium Go-Kart Experience",
  description:
    "Revolutionary go-karts engineered for the ultimate thrill. Premium materials, cutting-edge technology, and unmatched performance.",
  keywords: "go-kart, racing, premium, electric, performance, customization",
  openGraph: {
    title: "TurboKart - Ultimate Premium Go-Kart Experience",
    description: "Revolutionary go-karts engineered for the ultimate thrill.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable}`}
    >
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={`${inter.className} overflow-x-hidden bg-white`}>
        <CartProvider>
          {children}
          <CartDrawer />
          <RevolutionaryCursor />
          <TempoInit />
        </CartProvider>
      </body>
    </html>
  );
}
