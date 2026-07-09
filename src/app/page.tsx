import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAWLINK Dashboard",
  description: "Professional Raw Link Manager",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-[#0a1428] text-slate-200">
        {children}
      </body>
    </html>
  );
}
