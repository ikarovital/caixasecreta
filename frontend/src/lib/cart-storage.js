const CART_KEY = 'caixasecreta_carrinho_v2';
const CLIENT_KEY = 'caixasecreta_cliente_v2';

export function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function loadClient() {
  try {
    const raw = localStorage.getItem(CLIENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveClient(client) {
  localStorage.setItem(CLIENT_KEY, JSON.stringify(client));
}

export function cartItemCount(items) {
  return items.reduce((n, i) => n + (i.quantity || 0), 0);
}

export function cartSubtotal(items) {
  return items.reduce((n, i) => n + (Number(i.price) || 0) * (i.quantity || 0), 0);
}

/** Peso estimado para Correios (kg) */
export function estimateWeightKg(items) {
  const q = cartItemCount(items);
  if (q <= 0) return 0.3;
  return Math.min(30, Math.max(0.3, q * 0.12));
}
