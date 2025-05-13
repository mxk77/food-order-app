import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../../styles/Layout.css';

export default function Layout({ children }) {
  return (
    <div className="site-container">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}