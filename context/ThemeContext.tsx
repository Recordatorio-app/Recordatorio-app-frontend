"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUserPalette } from "@/services/user/user.service";
import { useAuth } from "./AuthContext";

type ColorPalette = {
  urgente: string;
  importante: string;
  normal: string;
  baja: string;
  personal: string;
  otro: string;
};

type ThemeContextType = {
  palette: ColorPalette | null;
  setPalette: (palette: ColorPalette) => void;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [palette, setPalette] = useState<ColorPalette | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadPalette = async () => { 
      try {
        const data = await getUserPalette(user.id);
        setPalette(data);
      } catch (err) {
        console.error("Error cargando paleta", err);
      }
    };

    loadPalette();
  }, [user]);

  return (
    <ThemeContext.Provider value={{ palette,setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
