import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import MENU_ITEMS_DATA from '../data/menuData.json'; // Імпортуємо дані меню

export default function MenuPage() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All'); // 'All' - для відображення всіх категорій

  // Отримуємо унікальні категорії для кнопок фільтрації
  const categories = useMemo(() => {
    const uniqueCategories = new Set(MENU_ITEMS_DATA.map(item => item.category));
    return ['All', ...Array.from(uniqueCategories)];
  }, []); // Залежність порожня, бо MENU_ITEMS_DATA не змінюється

  // Фільтруємо товари на основі вибраної категорії
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return MENU_ITEMS_DATA;
    }
    return MENU_ITEMS_DATA.filter(item => item.category === selectedCategory);
  }, [selectedCategory]); // Залежність від selectedCategory

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>Меню</h1>

      <div style={styles.categoryButtonsContainer}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={
              selectedCategory === category
                ? { ...styles.categoryButton, ...styles.activeCategoryButton }
                : styles.categoryButton
            }
          >
            {category === 'All' ? 'Всі категорії' : category}
          </button>
        ))}
      </div>

      {filteredItems.length > 0 ? (
        <div style={styles.menuGrid}>
          {filteredItems.map(item => (
            <div key={item.id} style={styles.card}>
              <img 
                src={item.imagePath} 
                alt={item.name} 
                style={styles.cardImage} 
              />
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{item.name}</h3>
                <p style={styles.cardDescription}>{item.description}</p>
                <div style={styles.cardFooter}>
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
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noItemsText}>В цій категорії товари відсутні.</p>
      )}
    </div>
  );
}

const styles = {
  pageContainer: {
    padding: '20px',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#333',
  },
  pageTitle: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '2.5rem',
    color: '#4A4A4A',
  },
  categoryButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '30px',
  },
  categoryButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
    border: '1px solid #007bff',
    backgroundColor: 'white',
    color: '#007bff',
    borderRadius: '20px',
    transition: 'all 0.3s ease',
  },
  activeCategoryButton: {
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
  },
  menuGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '25px', // Збільшено відступ
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px', // Більш заокруглені кути
    width: '250px', // Трохи ширші картки
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  },
  // cardHover (можна додати через :hover в CSS для кращої продуктивності):
  // '&:hover': {
  //   transform: 'translateY(-5px)',
  //   boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
  // },
  cardImage: {
    width: '100%',
    height: '180px', // Збільшено висоту зображення
    objectFit: 'cover', // Зберігає пропорції, обрізаючи зайве
  },
  cardBody: {
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  cardTitle: {
    fontSize: '1.2rem', // Збільшено шрифт
    fontWeight: '600', // Напівжирний
    margin: '0 0 10px 0',
    minHeight: '48px', 
    color: '#333',
  },
  cardDescription: {
    fontSize: '0.9rem',
    color: '#666',
    lineHeight: '1.5',
    margin: '0 0 15px 0',
    flexGrow: 1, // Опис займає доступний простір
    minHeight: '60px', // Мінімальна висота для опису
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto', // Притискає футер до низу картки
  },
  cardPrice: {
    fontSize: '1.1rem', // Збільшено шрифт
    color: '#007bff',
    fontWeight: 'bold',
    margin: '0',
  },
  addButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '45px', // Збільшено кнопку
    height: '45px',
    fontSize: '1.8rem', // Збільшено плюс
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: '1',
    transition: 'background-color 0.2s ease',
    // addButtonHover (можна додати через :hover):
    // '&:hover': {
    //   backgroundColor: '#218838',
    // },
  },
  noItemsText: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#777',
    marginTop: '30px',
  }
};