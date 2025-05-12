import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div>
      <h1>404 — Сторінку не знайдено</h1>
      <p>
        <Link to="/">Повернутись на головну</Link>
      </p>
    </div>
  );
}
