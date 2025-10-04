import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingSpinnerClient from "./LoadingSpinnerClient";
import { CartProvider } from "./CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Eldrop",
  description: "Eldrop - Your delivery service",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <LoadingSpinnerClient />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
