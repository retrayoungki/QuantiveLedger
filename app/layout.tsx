import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Q-GL Accounting - Dashboard",
  description: "Enterprise Accounting Dashboard",
};


import { CompanyProvider } from "@/context/CompanyContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        <AuthProvider>
          <CompanyProvider>
            <AuthGuard>
              <div className="relative z-0 flex-1 flex flex-col">
                {children}
              </div>
            </AuthGuard>
          </CompanyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
