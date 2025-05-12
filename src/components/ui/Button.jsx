import React from 'react';

export default function Button({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.5rem 1rem',
        margin: '0.5rem 0',
        cursor: 'pointer',
        border: '1px solid #333',
        background: '#fff'
      }}
    >
      {children}
    </button>
  );
}
