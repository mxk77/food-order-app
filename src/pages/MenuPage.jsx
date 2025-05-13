import React from 'react';
import { useCart } from '../context/CartContext';

const MENU = [
  { id: 'menu1', name: 'Піца Маргарита', price: 200 },
  { id: 'menu2', name: 'Бургер Класичний', price: 150 },
  { id: 'menu3', name: 'Салат Цезар', price: 120 },
  { id: 'menu4', name: 'Паста Карбонара', price: 220 },
  { id: 'menu5', name: 'Суші Сет "Філадельфія"', price: 350 },
];

export default function MenuPage() {
  const { addToCart } = useCart();

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>Меню</h1>
      <div style={styles.menuGrid}>
        {MENU.map(item => (
          <div key={item.id} style={styles.card}>
            <img src={`https://via.placeholder.com/200x150.png?text=${encodeURIComponent(item.name)}`} alt={item.name} style={styles.cardImage} />
            <div style={styles.cardBody}>
              <h3 style={styles.cardTitle}>{item.name}</h3>
              <p style={styles.cardPrice}>{item.price} грн</p>
              <button 
                onClick={() => addToCart(item)} 
                style={styles.addButton}
                title={`Додати ${item.name} до кошика`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  pageTitle: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  menuGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    width: '220px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out',
  },
  cardImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  },
  cardBody: {
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1, // Щоб тіло картки розтягувалось
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    minHeight: '44px', // Для вирівнювання висоти заголовків
  },
  cardPrice: {
    fontSize: '1rem',
    color: '#333',
    margin: '0 0 12px 0',
    flexGrow: 1, // Щоб ціна "відштовхувала" кнопку вниз
  },
  addButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '50%', // Робить кнопку круглою
    width: '40px',
    height: '40px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    alignSelf: 'flex-end', // Кнопка в правому нижньому куті картки
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: '1', // Для кращого центрування плюса
    paddingBottom: '2px', // Невелике коригування для візуального центрування плюса
  },
};