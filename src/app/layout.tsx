import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAWLINK PRO - Premium Manager",
  description: "Enterprise level raw link management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased bg-mesh min-h-screen">
        {children}
      </body>
    </html>
  );
}
