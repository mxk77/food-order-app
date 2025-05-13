import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = useCallback((itemToAdd) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === itemToAdd.id);
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 0) + 1,
        };
        return updatedItems;
      } else {
        return [...prevItems, { ...itemToAdd, quantity: 1 }];
      }
    });
  }, []);

  const removeItemById = useCallback((itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * (item.quantity || 0)), 0);
  }, [items]);

  const totalItemCount = useMemo(() => {
    return items.reduce((count, item) => count + (item.quantity || 0), 0);
  }, [items]);

  const contextValue = useMemo(() => ({
    items,
    addToCart,
    clearCart,
    removeItemById,
    total,
    totalItemCount
  }), [items, total, totalItemCount, addToCart, clearCart, removeItemById]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}