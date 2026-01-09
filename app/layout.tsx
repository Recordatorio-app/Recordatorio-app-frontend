import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Recordatorio App | Organiza tus tareas y recordatorios",
  description:
    "Recordatorio App es una aplicación web para gestionar tareas y recordatorios con notificaciones automáticas. Aumenta tu productividad desde cualquier dispositivo.",
  keywords: [
    "recordatorios",
    "tareas",
    "todo app",
    "productividad",
    "notificaciones",
    "gestión de tareas",
  ],
  authors: [{ name: "Joao Dev" }],
  creator: "Joao Dev",
  openGraph: {
    title: "Recordatorio App",
    description:
      "Gestiona tus tareas y recibe recordatorios automáticos con notificaciones en tiempo real.",
    url: "https://recordatorio-app.vercel.app",
    siteName: "Recordatorio App",
    images: [
      {
        url: "/icons/icon.png",
        width: 1200,
        height: 630,
        alt: "Recordatorio App",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  icons: {
    icon: "/icons/icon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
