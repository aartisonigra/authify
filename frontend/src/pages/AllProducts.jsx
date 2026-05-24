import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; // 💡 FIXED: useParams ઉમેર્યું
import axios from "axios";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import "./AllProducts.css";

const AllProducts = (props) => {
  const navigate = useNavigate();
  const { category: urlCategory } = useParams(); // 💡 FIXED: URL માંથી કેટેગરી મેળવશે
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});

  const token = localStorage.getItem("access_token");

  // 💡 FIXED: દરેક પ્રોડક્ટમાં સાચી 'category' પ્રોપર્ટી ઉમેરી દીધી છે
  const products = [
    { id: 1, name: "Midnight Moisture Mask", price: 60.0, time: "PM", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400", sizes: ["200ml", "300ml"], category: "hydrate" },
    { id: 2, name: "Awake Eye Balm", price: 42.0, time: "BOTH", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400", sizes: ["150ml", "200ml"], category: "hydrate" },
    { id: 3, name: "Silk Wash Cleanser", price: 35.0, time: "BOTH", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400", tag: "Bestseller", sizes: ["150ml", "200ml"], category: "cleanse" },
    { id: 4, name: "Glow Daily Serum", price: 48.0, time: "AM", img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=400", sizes: ["30ml", "50ml"], category: "new-arrivals" },
    { id: 5, name: "Hydrating Day Cream", price: 50.0, time: "AM", img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=400", sizes: ["50ml", "100ml"], category: "protect" },
    { id: 6, name: "Pure Micellar Water", price: 20.0, time: "BOTH", img: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=400", sizes: ["200ml", "400ml"], category: "cleanse" }
  ];

  // 💡 FIXED: નક્કી કરો કે અત્યારે કઈ કેટેગરી એક્ટિવ છે
  const currentCategory = props.category || urlCategory || "all";

  // 💡 FIXED: એક્ટિવ કેટેગરીના આધારે પ્રોડક્ટ્સ ફિલ્ટર કરવાનું લોજિક
  const filteredProducts = currentCategory === "all"
    ? products
    : products.filter(product => product.category === currentCategory.toLowerCase());

  // ટાઇટલ સેટ કરવા માટે (જેમ કે Cleanse Products, Hydrate Products વગેરે)
  const getPageTitle = () => {
    if (currentCategory === "all") return "All Products";
    return currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
  };

  const addToRoutine = async (productId, type) => {
    if (!token) {
      alert("Please login first to build your routine!");
      return;
    }
    try {
      await axios.post('http://127.0.0.1:8000/api/routine/', {
        product_id: productId,
        routine_type: type 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Added to ${type === 'AM' ? 'Morning' : 'Night'} Routine!`);
    } catch (err) {
      console.error("Error adding to routine", err);
      alert("Could not add to routine. Make sure you are logged in.");
    }
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const addToCart = (product) => {
    const sizeToAdd = selectedSizes[product.id] || product.sizes[0];
    const productToAdd = {
      ...product,
      cartId: Date.now(),
      chosenSize: sizeToAdd,
      quantity: 1
    };
    setCart((prev) => [...prev, productToAdd]);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const goToCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout", { state: { cartItems: cart, total: totalPrice } });
  };

  const goToCartPage = () => {
    setIsCartOpen(false);
    navigate("/cart", { state: { cartItems: cart } });
  };

  return (
    <div className="shop-all-wrapper">
      <Navbar />
      <div className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Cart ({cart.length} items)</h2>
          <button className="cart-close-icon" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <button onClick={() => setIsCartOpen(false)}>Continue Shopping</button>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.cartId}>
                <div className="cart-item-img"><img src={item.img} alt={item.name} /></div>
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="item-variant">Size: {item.chosenSize}</p>
                  <div className="qty-box">
                    <button onClick={() => updateQuantity(item.cartId, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartId, 1)}>+</button>
                  </div>
                </div>
                <button className="remove-item-btn" onClick={() => removeFromCart(item.cartId)}>✕</button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="total-box">
              <div className="total-line">
                <span>Estimated total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button className="checkout-btn" onClick={goToCheckout}>Checkout</button>
            <button className="view-cart-btn" onClick={goToCartPage}>View Cart</button>
          </div>
        )}
      </div>
      {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>}
      <div className="shop-container">
        <div className="shop-header">
          <p className="breadcrumb">
            <Link to="/">Home</Link> &gt; {getPageTitle()}
          </p>
          <h1 className="shop-title">{getPageTitle()}</h1>
        </div>
        <div className="all-products-grid">
          {/* 💡 FIXED: હવે અહીં 'products' ને બદલે 'filteredProducts' મેપ થશે */}
          {filteredProducts.map((product) => (
            <div className="shop-product-card" key={product.id}>
              <div className="shop-img-wrapper">
                {product.tag && <span className="product-tag">{product.tag}</span>}
                <img src={product.img} alt={product.name} />
              </div>
              <div className="shop-product-info">
                <h3>{product.name}</h3>
                <p className="shop-product-price">${product.price.toFixed(2)}</p>
                <div className="routine-buttons" style={{ marginBottom: "10px", display: "flex", gap: "5px" }}>
                  {(product.time === "AM" || product.time === "BOTH") && (
                    <button onClick={() => addToRoutine(product.id, 'AM')} className="routine-btn am" title="Add to Morning Routine">☀️ AM</button>
                  )}
                  {(product.time === "PM" || product.time === "BOTH") && (
                    <button onClick={() => addToRoutine(product.id, 'PM')} className="routine-btn pm" title="Add to Night Routine">🌙 PM</button>
                  )}
                </div>
                <div className="size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={(selectedSizes[product.id] || product.sizes[0]) === size ? "selected" : ""}
                      onClick={() => handleSizeChange(product.id, size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button className="add-to-cart-btn" onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            </div>
          ))}
          
          {/* જો કોઈ કેટેગરીમાં પ્રોડક્ટ ના હોય ત્યાર માટે */}
          {filteredProducts.length === 0 && (
            <p style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", color: "#666" }}>
              No products found in this category.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllProducts;