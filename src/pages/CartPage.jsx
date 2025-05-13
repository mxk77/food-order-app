import React from 'react';
import { useCart } from '../context/CartContext'; // Переконайтеся, що шлях правильний
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { items, removeItemById, clearCart, total } = useCart();
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>Кошик</h1>
      {items.length === 0 ? (
        <p>Ваш кошик порожній.</p>
      ) : (
        <>
          <ul style={styles.ul}>
            {items.map((item) => (
              <li key={item.id} style={styles.li}>
                <span style={styles.itemName}>
                  {item.name} (x{item.quantity || 1}) — {item.price * (item.quantity || 1)} грн
                </span>
                <button 
                  onClick={() => removeItemById(item.id)} 
                  style={styles.removeButton}
                  title="Видалити товар"
                >
                  &#x2716;
                </button>
              </li>
            ))}
          </ul>
          <p style={styles.totalText}>Всього: {total} грн</p>
          <div style={styles.buttonGroup}>
            <button style={styles.button} onClick={() => navigate('/confirmation')}>
              Оформити замовлення
            </button>
            <button style={{...styles.button, ...styles.clearButton}} onClick={clearCart}>
              Очистити кошик
            </button>
          </div>
        </>
      )}
      <p style={styles.linkContainer}>
        <Link to="/" style={styles.link}>← Повернутись до меню</Link>
      </p>
    </div>
  );
}

// Прості стилі для демонстрації (залишаються без змін)
const styles = {
  container: {
    padding: '20px',
    maxWidth: '700px',
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  ul: {
    listStyleType: 'none',
    padding: 0,
  },
  li: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
  itemName: {
    flexGrow: 1,
  },
  removeButton: {
    background: 'none',
    border: 'none',
    color: 'red',
    cursor: 'pointer',
    fontSize: '1.2em',
    padding: '5px',
  },
  totalText: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: '15px',
  },
  buttonGroup: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    flexGrow: 1,
  },
  clearButton: {
    backgroundColor: '#dc3545',
  },
  linkContainer: {
    marginTop: '25px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  }
};