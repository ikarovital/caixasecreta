import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout.jsx';
import { categorySections } from '../data/catalog.js';
import { HomePage } from './HomePage.jsx';
import { CategoryPage } from './CategoryPage.jsx';
import { SearchPage } from './SearchPage.jsx';
import { TermsPage } from './TermsPage.jsx';
import { CartPage } from './CartPage.jsx';
import { AccountPage } from './AccountPage.jsx';

const categoryIds = new Set(categorySections.map((c) => c.id));

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="busca" element={<SearchPage />} />
          <Route path="carrinho" element={<CartPage />} />
          <Route path="conta" element={<AccountPage />} />
          <Route path="termos" element={<TermsPage />} />
          <Route path="fetiche-sado" element={<Navigate to="/sado" replace />} />
          <Route path="sex-shop" element={<Navigate to="/comestiveis" replace />} />
          <Route
            path=":categorySlug"
            element={<CategoryPage allowedIds={categoryIds} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
