import { useState, useEffect, useCallback } from "react";
import { AppState } from "react-native";
import { FOOD_QUOTES, type Quote } from "../constants/quotes";

const pick = (exclude?: Quote): Quote => {
  const pool = exclude ? FOOD_QUOTES.filter((q) => q !== exclude) : FOOD_QUOTES;
  return pool[Math.floor(Math.random() * pool.length)];
};

export function useQuote() {
  const [quote, setQuote] = useState<Quote>(() => pick());

  const next = useCallback(() => setQuote((q) => pick(q)), []);

  // Auto-rotate every 10 seconds
  useEffect(() => {
    const id = setInterval(next, 10_000);
    return () => clearInterval(id);
  }, [next]);

  // Refresh when app returns to foreground (tab switch / app resume)
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") next();
    });
    return () => sub.remove();
  }, [next]);

  return { quote, next };
}
