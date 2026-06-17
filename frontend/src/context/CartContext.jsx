import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('petzone-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('petzone-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCartMessage('');

    if ((product.stock ?? 0) <= 0) {
      setCartMessage('Producto agotado');
      return false;
    }

    let agregado = false;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity >= (product.stock ?? 0)) {
          setCartMessage('No hay suficiente stock disponible.');
          return prevCart;
        }

        agregado = true;

        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      agregado = true;

      return [
        ...prevCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    return agregado;
  };

  const decreaseQuantity = (id) => {
    setCartMessage('');
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCartMessage('');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const precio = parseFloat(item.precio || 0);
      return total + precio * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartMessage,
        setCartMessage,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};