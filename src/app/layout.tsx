import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAWLINK - Premium Dashboard",
  description: "Luxury Raw Link Manager for Professionals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-[#0a0f1c] text-slate-200">
        {children}
      </body>
    </html>
  );
}
