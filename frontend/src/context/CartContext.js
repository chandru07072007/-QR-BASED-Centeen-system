// Cart Context
// Manages cart state across the application using Context API

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

// Helper function to get cart key for current user
const getCartKey = () => {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        return `cart_${userData._id || userData.id}`;
    }
    return 'cart'; // Fallback for non-logged-in users
};

export const CartProvider = ({ children }) => {
    // Track current user to detect changes
    const [currentUserId, setCurrentUserId] = useState(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            return userData._id || userData.id;
        }
        return null;
    });

    // Initialize cart from localStorage using user-specific key
    const [cart, setCart] = useState(() => {
        const cartKey = getCartKey();
        const savedCart = localStorage.getItem(cartKey);
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save cart to localStorage whenever it changes using user-specific key
    useEffect(() => {
        const cartKey = getCartKey();
        localStorage.setItem(cartKey, JSON.stringify(cart));
    }, [cart]);

    // Monitor user changes and reload cart when user switches
    useEffect(() => {
        const checkUserChange = () => {
            const user = localStorage.getItem('user');
            const newUserId = user ? JSON.parse(user)._id || JSON.parse(user).id : null;

            if (newUserId !== currentUserId) {
                setCurrentUserId(newUserId);
                // Load cart for new user
                const cartKey = newUserId ? `cart_${newUserId}` : 'cart';
                const savedCart = localStorage.getItem(cartKey);
                setCart(savedCart ? JSON.parse(savedCart) : []);
            }
        };

        // Check every 500ms for user changes (for login/logout detection)
        const interval = setInterval(checkUserChange, 500);

        return () => clearInterval(interval);
    }, [currentUserId]);

    // Add item to cart
    const addToCart = (item) => {
        setCart((prevCart) => {
            // Check if item already exists
            const existingItem = prevCart.find((cartItem) => cartItem._id === item._id);

            if (existingItem) {
                // Increase quantity
                return prevCart.map((cartItem) =>
                    cartItem._id === item._id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                // Add new item with quantity 1
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
    };

    // Update item quantity
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item._id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // Increase quantity
    const increaseQuantity = (itemId) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    // Decrease quantity
    const decreaseQuantity = (itemId) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item._id === itemId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ).filter((item) => item.quantity > 0)
        );
    };

    // Clear entire cart
    const clearCart = () => {
        setCart([]);
    };

    // Calculate total amount
    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Get cart item count
    const getCartCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getTotalAmount,
        getCartCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
