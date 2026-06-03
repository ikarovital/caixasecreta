import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  cartItemCount,
  cartSubtotal,
  loadCart,
  loadClient,
  saveCart,
  saveClient
} from '../lib/cart-storage.js';
import {
  clampQuantity,
  resolveProductForCart,
  sanitizeCartItems,
  toSecureCartLine
} from '../lib/cart-security.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => sanitizeCartItems(loadCart()));
  const [toast, setToast] = useState(null);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    const catalog = resolveProductForCart(product);
    if (!catalog) return;
    const amount = clampQuantity(qty);
    setItems((prev) => {
      const found = prev.find((i) => i.id === catalog.id);
      if (found) {
        return prev.map((i) =>
          i.id === catalog.id
            ? { ...i, quantity: clampQuantity(i.quantity + amount) }
            : i
        );
      }
      return [...prev, { ...toSecureCartLine({ quantity: amount }, catalog) }];
    });
    setToast({ name: catalog.name, image: catalog.image });
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQuantity = useCallback((id, quantity) => {
    const q = clampQuantity(quantity);
    if (!resolveProductForCart({ id })) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: q } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: cartItemCount(items),
      subtotal: cartSubtotal(items),
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      toast,
      dismissToast: () => setToast(null),
      loadSavedClient: loadClient,
      persistClient: saveClient
    }),
    [items, addItem, removeItem, setQuantity, clearCart, toast]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider');
  return ctx;
}
