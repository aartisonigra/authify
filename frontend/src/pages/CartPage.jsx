import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import "./CartPage.css";

const CartPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
  const [isSubscribed, setIsSubscribed] = useState(false); // Subscription state

  const updateQty = (id, delta) => {
    setCartItems(cartItems.map(item => 
      item.cartId === id ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.cartId !== id));
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const discount = isSubscribed ? subtotal * 0.10 : 0; // 10% discount if subscribed
  const finalTotal = subtotal - discount;

  const handleCheckout = () => {
    navigate("/checkout", { 
      state: { 
        cartItems, 
        subtotal: finalTotal, 
        isSubscribed: isSubscribed 
      } 
    });
  };

  return (
    <div className="cart-page-wrapper">
      <Navbar />
      <div className="cart-main-container">
        <h1 className="cart-title">Your Shopping Basket</h1>

        {cartItems.length > 0 ? (
          <div className="cart-layout">
            <div className="cart-items-section">
              <div className="cart-info-banner">
                ✨ 5 Free Gifts on every order - Don't forget to make your selection below
              </div>

              {cartItems.map((item) => (
                <div className="basket-card" key={item.cartId}>
                  <img src={item.img} alt={item.name} className="basket-img" />
                  
                  <div className="basket-details">
                    <h3>{item.name}</h3>
                    <p className="basket-meta">{item.chosenSize} | Skin Type: {item.skinType || 'All'}</p>
                    <div className="basket-pricing">
                      <span className="current-price">£{item.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="basket-controls">
                    <div className="qty-box">
                      <button onClick={() => updateQty(item.cartId, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item.cartId, 1)}>+</button>
                    </div>
                    <button className="remove-trash" onClick={() => removeItem(item.cartId)}>🗑️</button>
                  </div>
                </div>
              ))}

              {/* SUBSCRIPTION BOX */}
              <div className="subscription-box" style={{ marginTop: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "10px", fontWeight: "bold" }}>
                  <input 
                    type="checkbox" 
                    checked={isSubscribed} 
                    onChange={() => setIsSubscribed(!isSubscribed)} 
                    style={{ width: "18px", height: "18px" }}
                  />
                  Repeat this order every 30 days (Save 10%)
                </label>
                {isSubscribed && (
                  <p style={{ color: "green", fontSize: "14px", marginTop: "10px", marginLeft: "28px" }}>
                    ✅ Subscription active! Next delivery: May 13, 2026
                  </p>
                )}
              </div>
            </div>

            <div className="cart-summary-sidebar">
              <div className="summary-row">
                <span>Basket subtotal:</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              
              {isSubscribed && (
                <div className="summary-row" style={{ color: "green" }}>
                  <span>Subscription Discount (10%):</span>
                  <span>-£{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row total">
                <span className="bold">Total to pay:</span>
                <span className="bold" style={{ fontSize: "1.2rem" }}>£{finalTotal.toFixed(2)}</span>
              </div>
              
              <button className="checkout-now-btn" onClick={handleCheckout}>
                Checkout Now
              </button>
              <p className="secure-text">🔒 This is a secure transaction</p>
            </div>
          </div>
        ) : (
          <div className="empty-basket">
            <p>Your basket is currently empty.</p>
            <Link to="/all-products" className="shop-link">Continue Shopping</Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;