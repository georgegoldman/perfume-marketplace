import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scent Marketplace | Premium Fragrances",
  description: "A luxury marketplace for perfumes, oils, diffusers, and deodorants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
