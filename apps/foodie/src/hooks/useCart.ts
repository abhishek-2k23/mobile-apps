import { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";

/** Global cart count + order helpers */
export function useCart() {
  const { cartCount, setCartCount, addOrder } = useAuth();

  const increment = useCallback(() => setCartCount((n) => n + 1),              [setCartCount]);
  const decrement = useCallback(() => setCartCount((n) => Math.max(n - 1, 0)), [setCartCount]);
  const clear     = useCallback(() => setCartCount(0),                          [setCartCount]);

  return { cartCount, increment, decrement, clear, setCartCount, addOrder };
}

/** Per-item counts for RestaurantDetailScreen */
export function useMenuCart() {
  const { setCartCount } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});

  const add = useCallback((id: string) => {
    setCounts((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
    setCartCount((n) => n + 1);
  }, [setCartCount]);

  const remove = useCallback((id: string) => {
    setCounts((c) => {
      const cur = c[id] ?? 0;
      if (cur <= 1) { const { [id]: _removed, ...rest } = c; return rest; }
      return { ...c, [id]: cur - 1 };
    });
    setCartCount((n) => Math.max(n - 1, 0));
  }, [setCartCount]);

  const getCount = (id: string) => counts[id] ?? 0;

  return { counts, add, remove, getCount };
}
