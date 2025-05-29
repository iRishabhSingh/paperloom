import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "@/app/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "paperloom - effortless pdf sharing and collaboration",
  description:
    "paperloom is a platform that simplifies PDF collaboration—enabling seamless sharing, feedback, and teamwork.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
