import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AET AI — Asisten Cerdas Mahasiswa AET PCR",
  description: "Platform AI Himpunan Mahasiswa AET Politeknik Caltex Riau. Chat cerdas untuk coding, penulisan akademik, dan diskusi sehari-hari.",
  keywords: ["AET PCR", "AI Assistant", "Gemini AI", "Politeknik Caltex Riau", "himpunan mahasiswa"],
  authors: [{ name: "AET PCR", url: "https://tet.pcr.ac.id" }],
  openGraph: {
    title: "AET AI — Asisten Cerdas Mahasiswa AET PCR",
    description: "Platform AI Himpunan Mahasiswa AET Politeknik Caltex Riau.",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "AET AI — Asisten Cerdas Mahasiswa AET PCR",
    description: "Platform AI Himpunan Mahasiswa AET Politeknik Caltex Riau.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${fontSans.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}