import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function CartPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const total = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <div>
      <h1>Кошик</h1>
      {items.length === 0 ? (
        <p>Ваш кошик порожній.</p>
      ) : (
        <>
          <ul>
            {items.map((i, idx) => (
              <li key={idx}>
                {i.name} — {i.price} грн
              </li>
            ))}
          </ul>
          <p>Всього: {total} грн</p>
          <Button onClick={() => navigate('/confirmation')}>Підтвердити замовлення</Button>
          <Button onClick={clearCart}>Очистити кошик</Button>
        </>
      )}
      <p>
        <Link to="/">← Повернутись до меню</Link>
      </p>
    </div>
  );
}
