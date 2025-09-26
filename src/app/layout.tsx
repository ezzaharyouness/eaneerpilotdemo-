import type { Metadata } from "next";
import { Inter, Rubik, Source_Code_Pro } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  display: "swap",
});

const sourceCode = Source_Code_Pro({
  variable: "--font-source-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "eaneerPilot Ops Dashboard",
  description: "Operational control tower for the eaneerPilot platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[color:var(--color-superdark)]">
      <body
        className={`${inter.variable} ${rubik.variable} ${sourceCode.variable} min-h-screen bg-[color:var(--color-superdark)] text-[color:var(--color-white)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
