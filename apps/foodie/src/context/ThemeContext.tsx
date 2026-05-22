import { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { VEG_COLORS, VEG_GRAD, NONVEG_COLORS, NONVEG_GRAD, ALL_COLORS, ALL_GRAD, type AppColors, type AppGrad } from "../constants/colors";

type ThemeContextType = { C: AppColors; GRAD: AppGrad };

const ThemeContext = createContext<ThemeContextType>({ C: ALL_COLORS, GRAD: ALL_GRAD });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { foodFilter } = useAuth();
  const value = useMemo(() => {
    if (foodFilter === "veg")    return { C: VEG_COLORS,    GRAD: VEG_GRAD };
    if (foodFilter === "nonveg") return { C: NONVEG_COLORS, GRAD: NONVEG_GRAD };
    return { C: ALL_COLORS, GRAD: ALL_GRAD };
  }, [foodFilter]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
