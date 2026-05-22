export const formatPrice = (amount: number): string => `₹${amount}`;

export const formatOrderCount = (n: number): string =>
  `${n} item${n !== 1 ? "s" : ""}`;

export const generateOrderId = (): string =>
  `FD-${Math.floor(1000 + Math.random() * 9000)}`;
