import React from 'react';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';

const MENU = [
  { id: 1, name: 'Піцца Маргарита', price: 200 },
  { id: 2, name: 'Бургер', price: 150 },
  { id: 3, name: 'Салат Цезар', price: 120 }
];

export default function MenuPage() {
  const { addToCart } = useCart();

  return (
    <div>
      <h1>Меню</h1>
      <ul>
        {MENU.map(item => (
          <li key={item.id} style={{ marginBottom: '1rem' }}>
            {item.name} — {item.price} грн{' '}
            <Button onClick={() => addToCart(item)}>Додати</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}