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
  title: "Recordatorio App",
  description:
    "Recordatorio App es una aplicación web moderna para gestionar tareas y recordatorios con notificaciones en tiempo real. Organiza tus pendientes, recibe alertas automáticas y mejora tu productividad desde cualquier dispositivo.",
  icons: {
    icon: "/icons/notification.png",
  },
  keywords: [
    "recordatorios",
    "tareas",
    "todo app",
    "productividad",
    "notificaciones",
    "gestión de tareas",
    "aplicación web",
  ],
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
