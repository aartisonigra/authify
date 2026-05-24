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

  // 🏠 MULTIPLE ADDRESSES STATE
  const [addresses, setAddresses] = useState([
    { id: 1, label: "Home", fullName: "Aarti Patel", address: "A-101, Shanti Appt, MG Road", city: "Surat", zip: "395003" },
    { id: 2, label: "Office", fullName: "Aarti Patel", address: "302, Tech Hub, VIP Road", city: "Surat", zip: "395007" }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    city: "",
    zip: ""
  });

  // 🎟️ COUPON STATE
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  // 💵 PAYMENT METHOD STATE
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // 🚚 SHIPPING CHARGE LOGIC ($50 થી ઉપર Free, નહીંતર $5)
  const shippingCharge = subtotal > 50 || subtotal === 0 ? 0 : 5.0;

  // યુઝર લોગિન ડેટા ઓટો-ફિલ
  useEffect(() => {
    const userEmail = localStorage.getItem("email"); 
    const userName = localStorage.getItem("full_name");
    if (userEmail) setFormData(prev => ({ ...prev, email: userEmail, fullName: userName || "" }));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // નવું એડ્રેસ લિસ્ટમાં ઉમેરવા માટે
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.address || !formData.city || !formData.zip) {
      alert("Please fill all address fields! ⚠️");
      return;
    }
    const newId = addresses.length + 1;
    const newAddr = {
      id: newId,
      label: `Address ${newId}`,
      fullName: formData.fullName,
      address: formData.address,
      city: formData.city,
      zip: formData.zip
    };
    setAddresses([...addresses, newAddr]);
    setSelectedAddressId(newId);
    setShowNewAddressForm(false);
  };

  // કૂપન કોડ અપ્લાય કરવાનું લોજિક
  const handleApplyCoupon = () => {
    setCouponError("");
    if (coupon.toUpperCase() === "WELCOME10") {
      setDiscount(subtotal * 0.10); // 10% OFF
      setAppliedCoupon("WELCOME10 (10% OFF)");
    } else if (coupon.toUpperCase() === "DREAMA20") {
      setDiscount(20.00); // Flat $20 OFF
      setAppliedCoupon("DREAMA20 ($20 OFF)");
    } else {
      setCouponError("Invalid Coupon Code! Try WELCOME10");
      setDiscount(0);
      setAppliedCoupon("");
    }
  };

  // ფાઇનલ ટોટલ ગણતરી
  const finalTotal = subtotal + shippingCharge - discount;

  // ==========================================
  // BACKEND INTEGRATION: PLACE ORDER FUNCTION
  // ==========================================
  const handlePlaceOrder = async () => {
    if (!formData.email) {
      alert("Please enter your email address! ⚠️");
      return;
    }

    // એક્ટિવ એડ્રેસ ડેટા લો
    const activeAddress = addresses.find(a => a.id === selectedAddressId);
    const token = localStorage.getItem("access_token"); 

    if (!token) {
      alert("Please login first to place an order!");
      navigate("/login");
      return;
    }

    try {
      // ૧. Django API માં રિક્વેસ્ટ મોકલો
      const response = await axios.post(
        "http://127.0.0.1:8000/api/place-order/", 
        {
          full_name: activeAddress.fullName,
          email: formData.email,
          address: activeAddress.address,
          city: activeAddress.city,
          pincode: activeAddress.zip, 
          total_amount: finalTotal, 
          payment_method: paymentMethod
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ૨. જો યુઝરે COD રાખ્યું હોય તો ડાયરેક્ટ ઓર્ડર સક્સેસ
      if (paymentMethod === "cod") {
        alert(`🎉 Order Placed Successfully! Order ID: #${response.data.order_id}`);
        navigate("/"); 
        return;
      }

      // ૩. જો ઓનલાઇન પેમેન્ટ હોય તો Razorpay પોપ-અપ ઓપન કરો
      if (response.data.online_payment) {
        const options = {
          key: response.data.razorpay_key_id, 
          amount: response.data.amount,
          currency: "INR",
          name: "dreama. Skincare",
          description: "Complete your premium skincare purchase",
          order_id: response.data.razorpay_order_id, 
          handler: async function (res) {
            try {
              // પેમેન્ટ વેરિફિકેશન માટે બેકએન્ડમાં ડેટા મોકલો
              await axios.post(
                "http://127.0.0.1:8000/api/verify-payment/",
                {
                  razorpay_order_id: res.razorpay_order_id,
                  razorpay_payment_id: res.razorpay_payment_id,
                  razorpay_signature: res.razorpay_signature,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              
              alert(`🎉 Payment Success & Order Confirmed! ID: #${response.data.order_id}`);
              navigate("/");
            } catch (err) {
              alert("❌ Payment verification failed!");
            }
          },
          prefill: {
            name: activeAddress.fullName,
            email: formData.email,
          },
          theme: { color: "#4a2c2c" }, 
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error("Order Error:", error);
      const errorMsg = error.response?.data?.error || "Server connection failed.";
      alert("Error: " + errorMsg);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        
        {/* LEFT SIDE: FORM & ADDRESSES */}
        <div className="checkout-left">
          <div className="brand-header">
            <Link to="/" className="brand-logo">dreama.</Link>
          </div>

          {/* CONTACT INFO */}
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

          {/* SHIPPING ADDRESS */}
          <section className="form-section">
            <h3>SHIPPING ADDRESS</h3>
            
            <div className="saved-addresses-grid" style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
              {addresses.map((addr) => (
                <label key={addr.id} className={`payment-card ${selectedAddressId === addr.id ? "active" : ""}`}>
                  <input 
                    type="radio" 
                    name="selectedAddress" 
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)} 
                  />
                  <div className="payment-label" style={{ display: "block", textAlign: "left", paddingLeft: "10px" }}>
                    <strong>{addr.label}: {addr.fullName}</strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#666" }}>{addr.address}, {addr.city} - {addr.zip}</p>
                  </div>
                </label>
              ))}
            </div>

            {!showNewAddressForm ? (
              <button type="button" className="add-address-toggle-btn" onClick={() => setShowNewAddressForm(true)}>
                + Add New Address
              </button>
            ) : (
              <div className="new-address-subform" style={{ background: "#fdfafa", padding: "15px", borderRadius: "4px", border: "1px dashed #ccc", marginTop: "10px" }}>
                <h4 style={{ margin: "0 0 10px 0" }}>New Address Details</h4>
                <input name="fullName" type="text" placeholder="Full Name *" value={formData.fullName} required onChange={handleInputChange} style={{ marginBottom: "10px", width: "100%" }} />
                <input name="address" type="text" placeholder="Street Address *" value={formData.address} required onChange={handleInputChange} style={{ marginBottom: "10px", width: "100%" }} />
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                  <input name="city" type="text" placeholder="City *" value={formData.city} onChange={handleInputChange} />
                  <input name="zip" type="text" placeholder="Zip Code *" value={formData.zip} onChange={handleInputChange} />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="button" onClick={handleAddAddress} style={{ background: "#000", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}>Save & Use</button>
                  <button type="button" onClick={() => setShowNewAddressForm(false)} style={{ background: "#ccc", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            )}
          </section>

          {/* PAYMENT METHODS */}
          <section className="form-section">
            <h3>PAYMENT METHOD</h3>
            <div className="payment-options">
              <label className={`payment-card ${paymentMethod === "cod" ? "active" : ""}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                <div className="payment-label"><span>💵 Cash on Delivery (COD)</span></div>
              </label>

              <label className={`payment-card ${paymentMethod === "gpay" ? "active" : ""}`}>
                <input type="radio" name="payment" value="gpay" checked={paymentMethod === "gpay"} onChange={() => setPaymentMethod("gpay")} />
                <div className="payment-label"><span>🔵 Online Payment (UPI / Card)</span></div>
              </label>
            </div>
          </section>

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            PLACE ORDER (${finalTotal.toFixed(2)})
          </button>
        </div>

        {/* RIGHT SIDE: SUMMARY & COUPON */}
        <div className="checkout-right">
          <div className="order-summary-box">
            
            {/* COUPON BOX */}
            <h3 className="summary-title" style={{ marginTop: "0" }}>Apply Coupon</h3>
            <div className="coupon-apply-container" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input 
                type="text" 
                placeholder="Promo Code (WELCOME10)" 
                value={coupon} 
                onChange={(e) => setCoupon(e.target.value)}
                style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
              />
              <button type="button" onClick={handleApplyCoupon} style={{ background: "#000", color: "#fff", border: "none", padding: "0 15px", borderRadius: "4px", cursor: "pointer" }}>
                Apply
              </button>
            </div>
            {appliedCoupon && <p style={{ color: "green", margin: "-15px 0 15px 0", fontSize: "0.9rem" }}>✅ Applied: {appliedCoupon}</p>}
            {couponError && <p style={{ color: "red", margin: "-15px 0 15px 0", fontSize: "0.9rem" }}>❌ {couponError}</p>}

            <h3 className="summary-title" style={{ borderTop: "1px solid #eee", paddingTop: "15px" }}>Order Summary</h3>
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

            <div className="price-calculation" style={{ borderTop: "1px solid #eee", paddingTop: "15px" }}>
              <div className="line">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="line">
                <span>Shipping Charge</span>
                <span>{shippingCharge === 0 ? "FREE" : `$${shippingCharge.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="line" style={{ color: "green" }}>
                  <span>Coupon Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="line total" style={{ borderTop: "1px solid #333", paddingTop: "10px", marginTop: "10px" }}>
                <span>Total</span>
                <span className="bold">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;