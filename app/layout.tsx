import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Fast quote request form for handyman and business services."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
