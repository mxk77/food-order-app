import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import MENU_ITEMS_DATA from '../data/menuData.json';
import '../styles/MenuPage.css';

export default function MenuPage() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const uniqueCategories = new Set(MENU_ITEMS_DATA.map(item => item.category));
    return ['All', ...Array.from(uniqueCategories)];
  }, []);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return MENU_ITEMS_DATA;
    }
    return MENU_ITEMS_DATA.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="menu-page-container">
      <h1 className="menu-page-title">Меню</h1>

      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`category-filters__button ${
              selectedCategory === category ? 'category-filters__button--active' : ''
            }`}
          >
            {category === 'All' ? 'Всі категорії' : category}
          </button>
        ))}
      </div>

      {filteredItems.length > 0 ? (
        <div className="menu-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="menu-card"> 
              <div className="menu-card__image-container">
                <img
                  src={item.imagePath}
                  alt={item.name}
                  className="menu-card__image"
                />
              </div>
              <div className="menu-card__body">
                <h3 className="menu-card__title">{item.name}</h3>
                <p className="menu-card__description">{item.description}</p>
                <div className="menu-card__footer">
                  <p className="menu-card__price">{item.price} грн</p>
                  <button
                    onClick={() => addToCart(item)}
                    className="btn menu-card__add-button" 
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
        <p className="menu-page__no-items">В цій категорії товари відсутні.</p>
      )}
    </div>
  );
}