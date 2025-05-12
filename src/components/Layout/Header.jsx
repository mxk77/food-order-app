import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const { items } = useCart();
  return (
    <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <nav>
        <Link to="/">Меню</Link> |{' '}
        <Link to="/cart">Кошик ({items.length})</Link> |{' '}
        <Link to="/profile">Профіль</Link>
      </nav>
    </header>
  );
}