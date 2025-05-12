import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
