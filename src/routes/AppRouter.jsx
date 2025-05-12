import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MenuPage from '../pages/MenuPage';
import CartPage from '../pages/CartPage';
import ProfilePage from '../pages/ProfilePage';
import ConfirmationPage from '../pages/ConfirmationPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/"           element={<MenuPage />}         />
      <Route path="/cart"       element={<CartPage />}         />
      <Route path="/profile"    element={<ProfilePage />}      />
      <Route path="/confirmation" element={<ConfirmationPage />} />
      <Route path="*"           element={<NotFoundPage />}     />
    </Routes>
  );
}