import React from 'react';
import '../../styles/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="app-footer__content">
        <div className="app-footer__copyright">
          &copy; {currentYear} FoodDelivery
        </div>
        <div className="app-footer__contacts">
          <a href="tel:+380001112233" className="app-footer__phone-link">(000) 111-22-33</a>
          <a href="tel:+380004445566" className="app-footer__phone-link">(000) 444-55-66</a>
        </div>
      </div>
    </footer>
  );
}