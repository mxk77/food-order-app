import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function ConfirmationPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Після підтвердження очищаємо кошик
    clearCart();
  }, [clearCart]);

  return (
    <div>
      <h1>Замовлення підтверджено!</h1>
      <p>Дякуємо за ваше замовлення. Ми з вами зв’яжемося найближчим часом.</p>
      <p>
        <Link to="/">Повернутись до меню</Link>
      </p>
    </div>
  );
}
