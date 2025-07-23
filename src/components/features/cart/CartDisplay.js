import React, { useContext, useState } from 'react';
import { CartContext } from './CartContext';

export const CartDisplay = () => {
    const { cart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
    const [showDebug, setShowDebug] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false); // New state for toggling cart visibility

    const toggleDebug = () => {
        setShowDebug(!showDebug);
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized); // Toggle the state of cart visibility
    };

    // Function to handle removing an item from the cart
    const handleRemoveItem = (title) => {
        /*removeFromCart(title); // You'll need to implement this in your CartContext*/
    };

    return (
        <div className="cart-display">
            <div className="cart-header">
                <h3>Cart Items:</h3>
                <button onClick={toggleMinimize} className="minimize-button">
                    {isMinimized ? 'Show' : 'Hide'} {/* Text changes based on state */}
                </button>
            </div>
            {!isMinimized && ( // Only render cart items if not minimized
                <div className="cart-items">
                    <ul>
                        {cart.map((item, index) => (
                            <li key={index} className="cart-item">
                                <img src={item.imgUrl} alt={item.title} />
                                <div className="item-details">
                                    <div className="item-name">
                                        <strong>{item.title}</strong>
                                    </div>
                                    <div className="quantity-buttons">
                                        <button onClick={() => decreaseQuantity(item.title)}>-</button>
                                        <span>Qty: {item.quantity}</span>
                                        <button onClick={() => increaseQuantity(item.title)}>+</button>
                                        <button onClick={() => handleRemoveItem(item.title)} className="remove-item">Clear</button> {/* New Clear button */}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <button onClick={toggleDebug} className="toggle-debug">
                {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
            </button>
            {showDebug && (
                <div className="cart-debug">
                    <strong>Debug Cart (JSON):</strong>
                    <pre>{JSON.stringify(cart, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};
