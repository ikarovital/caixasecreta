import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearSession,
  getLoggedCustomer,
  loginCustomer,
  registerCustomer,
  updateCustomerProfile
} from '../lib/customer-account.js';

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(() => getLoggedCustomer());

  const refresh = useCallback(() => {
    setCustomer(getLoggedCustomer());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const register = useCallback(
    (data) => {
      const c = registerCustomer(data);
      setCustomer(c);
      return c;
    },
    []
  );

  const login = useCallback(
    (telefone) => {
      const c = loginCustomer(telefone);
      setCustomer(c);
      return c;
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();
    setCustomer(null);
  }, []);

  const updateProfile = useCallback(
    (patch) => {
      if (!customer) return null;
      const c = updateCustomerProfile(customer.id, patch);
      setCustomer(c);
      return c;
    },
    [customer]
  );

  const value = useMemo(
    () => ({
      customer,
      isLoggedIn: Boolean(customer),
      points: customer?.points ?? 0,
      orders: customer?.orders ?? [],
      register,
      login,
      logout,
      updateProfile,
      refresh
    }),
    [customer, register, login, logout, updateProfile, refresh]
  );

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomer deve ser usado dentro de CustomerProvider');
  return ctx;
}
