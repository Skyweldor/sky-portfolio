// CartContext.js
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.title === item.title);
        if (existingItem) {
            setCart(cart.map(cartItem => 
                cartItem.title === item.title 
                    ? { ...cartItem, quantity: cartItem.quantity + 1 } 
                    : cartItem
            ));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (itemTitle) => {
        setCart(cart.filter(cartItem => cartItem.title !== itemTitle));
    };

    const increaseQuantity = (itemTitle) => {
        setCart(cart.map(cartItem => 
            cartItem.title === itemTitle 
                ? { ...cartItem, quantity: cartItem.quantity + 1 } 
                : cartItem
        ));
    };

    const decreaseQuantity = (itemTitle) => {
        setCart(cart.map(cartItem => 
            cartItem.title === itemTitle 
                ? { ...cartItem, quantity: cartItem.quantity > 1 ? cartItem.quantity - 1 : 0 } 
                : cartItem
        ).filter(cartItem => cartItem.quantity > 0));
    };

    

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity }}>
            {children}
        </CartContext.Provider>
    );
};