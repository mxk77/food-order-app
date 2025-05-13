import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1 className="not-found-page__title">404 — Сторінку не знайдено</h1>
      <p className="not-found-page__message">
        На жаль, сторінка, яку ви намагаєтеся знайти, не існує або була переміщена.
      </p>
      <div className="not-found-page__actions">
        <Link to="/" className="btn btn--primary">
          Повернутись на головну
        </Link>
      </div>
    </div>
  );
}