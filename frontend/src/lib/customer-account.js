import { BONUS_FIRST_ORDER, PONTOS_ATIVO, pointsFromOrderTotal } from '../data/points-config.js';
import { saveClient } from './cart-storage.js';
import { sanitizeTextField } from './cart-security.js';

const CUSTOMERS_KEY = 'caixasecreta_clientes_v1';
const SESSION_KEY = 'caixasecreta_sessao_v1';
const MAX_ORDERS = 80;

export function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 11);
}

function loadDb() {
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDb(db) {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(db));
}

export function customerIdFromPhone(phone) {
  const digits = normalizePhone(phone);
  return digits ? `c-${digits}` : '';
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(customerId) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ customerId, at: Date.now() }));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCustomerById(id) {
  const db = loadDb();
  return db[id] || null;
}

export function getCustomerByPhone(phone) {
  const id = customerIdFromPhone(phone);
  return id ? getCustomerById(id) : null;
}

export function registerCustomer({ nome, telefone, cep, email = '' }) {
  const digits = normalizePhone(telefone);
  if (digits.length < 10 || digits.length > 11) throw new Error('WhatsApp inválido.');
  const nomeSafe = sanitizeTextField(nome, 80);
  if (!nomeSafe) throw new Error('Informe seu nome.');

  const id = customerIdFromPhone(digits);
  const db = loadDb();
  const now = new Date().toISOString();
  const existing = db[id];

  const customer = {
    id,
    nome: nomeSafe,
    telefone: digits,
    cep: sanitizeTextField(cep || existing?.cep || '', 9).replace(/\D/g, '').slice(0, 8),
    email: sanitizeTextField(email || existing?.email || '', 120),
    points: existing?.points ?? 0,
    orders: existing?.orders ?? [],
    createdAt: existing?.createdAt ?? now,
    updatedAt: now
  };

  db[id] = customer;
  saveDb(db);
  saveSession(id);
  saveClient({ nome: customer.nome, telefone: customer.telefone, cep: customer.cep });

  return customer;
}

export function loginCustomer(telefone) {
  const customer = getCustomerByPhone(telefone);
  if (!customer) {
    throw new Error('Cadastro não encontrado. Crie sua conta com nome e WhatsApp.');
  }
  saveSession(customer.id);
  saveClient({ nome: customer.nome, telefone: customer.telefone, cep: customer.cep });
  return customer;
}

export function updateCustomerProfile(id, patch) {
  const db = loadDb();
  const customer = db[id];
  if (!customer) throw new Error('Cliente não encontrado.');

  const updated = {
    ...customer,
    ...patch,
    nome: patch.nome?.trim() ?? customer.nome,
    email: patch.email?.trim() ?? customer.email,
    updatedAt: new Date().toISOString()
  };
  db[id] = updated;
  saveDb(db);
  saveClient({ nome: updated.nome, telefone: updated.telefone, cep: updated.cep });
  return updated;
}

export function recordOrder(customerId, payload) {
  const db = loadDb();
  const customer = db[customerId];
  if (!customer) throw new Error('Cliente não encontrado.');

  const total = Number(payload.total) || 0;
  const pointsRedeemed = PONTOS_ATIVO
    ? Math.max(0, Math.floor(Number(payload.pointsRedeemed) || 0))
    : 0;
  const saldo = customer.points || 0;
  if (PONTOS_ATIVO && pointsRedeemed > saldo) {
    throw new Error('Pontos insuficientes para este desconto.');
  }

  const earned = pointsFromOrderTotal(total);
  const isFirst = (customer.orders?.length || 0) === 0;
  const bonus = PONTOS_ATIVO && isFirst ? BONUS_FIRST_ORDER : 0;
  const pointsEarned = earned + bonus;

  const order = {
    id: `ped-${Date.now()}`,
    date: new Date().toISOString(),
    items: payload.items,
    subtotal: payload.subtotal,
    freight: payload.freight,
    total,
    payment: payload.payment,
    pointsEarned,
    pointsRedeemed,
    pointsDiscountReais: payload.pointsDiscountReais ?? 0,
    bonusFirstOrder: bonus,
    address: payload.address || null,
    status: 'aguardando_whatsapp'
  };

  const orders = [order, ...(customer.orders || [])].slice(0, MAX_ORDERS);
  const updated = {
    ...customer,
    orders,
    points: Math.max(0, saldo - pointsRedeemed) + pointsEarned,
    updatedAt: new Date().toISOString()
  };

  db[customerId] = updated;
  saveDb(db);
  return { customer: updated, order, pointsEarned, bonus };
}

export function getLoggedCustomer() {
  const sess = loadSession();
  if (!sess?.customerId) return null;
  return getCustomerById(sess.customerId);
}
