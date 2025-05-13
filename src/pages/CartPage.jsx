import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/CartPage.css';

export default function CartPage() {
  const { items, removeItemById, clearCart, total } = useCart();
  const navigate = useNavigate();

  return (
    <div className="cart-page-container">
      <h1 className="cart-page-title">Кошик</h1>
      {items.length === 0 ? (
        <p className="cart-page__empty-message">Ваш кошик порожній.</p>
      ) : (
        <>
          <ul className="cart-items-list">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <span className="cart-item__details">
                  {item.name} (x{item.quantity || 1}) — {item.price * (item.quantity || 1)} грн
                </span>
                <button
                  onClick={() => removeItemById(item.id)}
                  className="cart-item__remove-button"
                  title="Видалити товар"
                  aria-label="Видалити товар"
                >
                  &#x2716; {/* × */}
                </button>
              </li>
            ))}
          </ul>
          <p className="cart-page__total">Всього: {total} грн</p>
          <div className="cart-page__actions">
            <button 
              className="btn btn--primary cart-page__action-button" 
              onClick={() => navigate('/confirmation')}
            >
              Оформити замовлення
            </button>
            <button 
              className="btn btn--danger cart-page__action-button" 
              onClick={clearCart}
            >
              Очистити кошик
            </button>
          </div>
        </>
      )}
      <div className="cart-page__back-link-container">
        <Link to="/" className="cart-page__back-link">← Повернутись до меню</Link>
      </div>
    </div>
  );
}