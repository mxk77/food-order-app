import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../styles/Header.css';


export default function Header() {
  const { items } = useCart();
  return (
    <header className="app-header">
      <Link to="/" className="app-header__logo">
        <span role="img" aria-label="Логотип служби доставки" style={{ marginRight: '10px', fontSize: '1.3em' }}>
        🚚
        </span>
        FoodDelivery
      </Link>
      <nav className="app-header__nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            isActive ? "app-header__nav-link app-header__nav-link--active" : "app-header__nav-link"
          }
        >
          Меню
        </NavLink>
        <NavLink 
          to="/cart" 
          className={({ isActive }) => 
            isActive ? "app-header__nav-link app-header__nav-link--active" : "app-header__nav-link"
          }
        >
          Кошик ({items.length})
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            isActive ? "app-header__nav-link app-header__nav-link--active" : "app-header__nav-link"
          }
        >
          Профіль
        </NavLink>
      </nav>
    </header>
  );
}