import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios"; 
import "./Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  const cartItems = data?.cartItems || [];
  const subtotal = data?.subtotal || 0;

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    city: "",
    zip: ""
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // જો યુઝર લોગિન હોય તો તેનું નામ અને ઈમેલ પહેલેથી ભરી દેવા માટે (Optional)
  useEffect(() => {
    const userEmail = localStorage.getItem("email"); // અથવા તમારી સ્ટેટ મેનેજમેન્ટમાંથી લો
    const userName = localStorage.getItem("full_name");
    if (userEmail) setFormData(prev => ({ ...prev, email: userEmail, fullName: userName || "" }));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==========================================
  // BACKEND INTEGRATION: PLACE ORDER FUNCTION
  // ==========================================
  const handlePlaceOrder = async () => {
    // Validation
    if (!formData.email || !formData.fullName || !formData.address || !formData.city || !formData.zip) {
      alert("Please fill in all required fields! ⚠️");
      return;
    }

    try {
      // JWT Token મેળવો (કારણ કે Django માં IsAuthenticated પરમિશન છે)
      const token = localStorage.getItem("access_token"); 
      
      if (!token) {
        alert("Please login first to place an order!");
        navigate("/login");
        return;
      }

      // Django API Call
      const response = await axios.post(
        "http://127.0.0.1:8000/api/place-order/", 
        {
          full_name: formData.fullName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          pincode: formData.zip, // Django માં આપણે 'pincode' તરીકે લઈએ છીએ
          total_amount: subtotal,
          payment_method: paymentMethod
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // સાચું ઓથેન્ટિકેશન
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert(`Order Placed Successfully! ✅ Order ID: #${response.data.order_id}`);
        
        if (paymentMethod !== "cod") {
          alert(`Redirecting to ${paymentMethod.toUpperCase()} gateway...`);
        }
        
        navigate("/"); 
      }
    } catch (error) {
      console.error("Order Submission Error:", error);
      const errorMsg = error.response?.data?.error || "Server connection failed. Make sure Django is running!";
      alert("Error: " + errorMsg);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* LEFT SIDE: CONTACT & SHIPPING FORM */}
        <div className="checkout-left">
          <div className="brand-header">
            <Link to="/" className="brand-logo">dreama.</Link>
          </div>

          <section className="form-section">
            <h3>CONTACT INFORMATION</h3>
            <input 
              name="email" 
              type="email" 
              placeholder="Email *" 
              value={formData.email}
              required 
              onChange={handleInputChange} 
            />
          </section>

          <section className="form-section">
            <h3>SHIPPING ADDRESS</h3>
            <input 
              name="fullName" 
              type="text" 
              placeholder="Full Name *" 
              value={formData.fullName}
              required 
              onChange={handleInputChange} 
            />
            <input 
              name="address" 
              type="text" 
              placeholder="Street Address *" 
              value={formData.address}
              required 
              onChange={handleInputChange} 
            />
            <div className="form-grid">
              <input 
                name="city" 
                type="text" 
                placeholder="City *" 
                value={formData.city}
                onChange={handleInputChange} 
              />
              <input 
                name="zip" 
                type="text" 
                placeholder="Zip Code *" 
                value={formData.zip}
                onChange={handleInputChange} 
              />
            </div>
          </section>

          {/* PAYMENT METHOD SECTION */}
          <section className="form-section">
            <h3>PAYMENT METHOD</h3>
            <div className="payment-options">
              <label className={`payment-card ${paymentMethod === "cod" ? "active" : ""}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod" 
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")} 
                />
                <div className="payment-label">
                   <span>💵 Cash on Delivery (COD)</span>
                </div>
              </label>

              <label className={`payment-card ${paymentMethod === "gpay" ? "active" : ""}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="gpay" 
                  checked={paymentMethod === "gpay"}
                  onChange={() => setPaymentMethod("gpay")} 
                />
                <div className="payment-label">
                   <span>🔵 Google Pay</span>
                </div>
              </label>

              <label className={`payment-card ${paymentMethod === "applepay" ? "active" : ""}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="applepay" 
                  checked={paymentMethod === "applepay"}
                  onChange={() => setPaymentMethod("applepay")} 
                />
                <div className="payment-label">
                   <span>🍎 Apple Pay</span>
                </div>
              </label>
            </div>
          </section>

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            PLACE ORDER
          </button>
        </div>

        {/* RIGHT SIDE: ORDER SUMMARY */}
        <div className="checkout-right">
          <div className="order-summary-box">
            <h3 className="summary-title">Order Summary</h3>
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item, index) => (
                <div className="summary-item" key={index}>
                  <div className="summary-img">
                    <img src={item.img || item.image_url} alt={item.name} />
                    <span className="qty-badge">{item.quantity}</span>
                  </div>
                  <div className="summary-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-variant">{item.chosenSize || "Standard"}</p>
                  </div>
                  <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))
            )}

            <div className="price-calculation">
              <div className="line">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="line total">
                <span>Total</span>
                <span className="bold">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;