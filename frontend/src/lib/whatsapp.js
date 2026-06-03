export function whatsappLink({ phoneE164, message }) {
  const phone = String(phoneE164 || '').replace(/\D/g, '');
  if (!/^\d{10,15}$/.test(phone)) {
    throw new Error('Número WhatsApp inválido.');
  }
  const base = `https://wa.me/${phone}`;
  const text = encodeURIComponent(String(message || '').slice(0, 4000));
  return `${base}?text=${text}`;
}

export function openWhatsapp({ phoneE164, message }) {
  const url = whatsappLink({ phoneE164, message });
  window.open(url, '_blank', 'noopener,noreferrer');
}

