import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prayash Jung Khadka | Full-Stack JavaScript Developer",
  description: "Full-Stack JavaScript Developer specializing in React, Next.js, Node.js, and TypeScript. Building scalable web applications with PostgreSQL, MongoDB, AWS, and modern tech stack.",
  keywords: ["Full-Stack Developer", "JavaScript Developer", "React Developer", "Next.js Developer", "Node.js", "TypeScript", "Prayash Khadka", "Web Developer Nepal"],
  authors: [{ name: "Prayash Jung Khadka" }],
  openGraph: {
    title: "Prayash Jung Khadka | Full-Stack JavaScript Developer",
    description: "Full-Stack JavaScript Developer specializing in React, Next.js, Node.js, and TypeScript",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prayash Jung Khadka | Full-Stack JavaScript Developer",
    description: "Building scalable web applications with modern technologies",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth transition-colors duration-200">
      <body className={`${dmSans.className} antialiased`}>{children}</body>
    </html>
  );
}

