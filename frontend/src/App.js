import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AllProducts from "./pages/AllProducts";
import Checkout from "./pages/Checkout";
import CartPage from "./pages/CartPage";
import OurStory from "./pages/OurStory";
import Profile from "./pages/Profile";         // નવું પેજ
import OrderHistory from "./pages/OrderHistory"; // નવું પેજ
import Auth from "./components/Auth/Auth";

const NotFound = () => (
  <div style={{ textAlign: "center", padding: "100px" }}>
    <h1>404</h1>
    <p>Page Not Found</p>
    <a href="/">Go to Home</a>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Home />} />
        
        {/* હવે /all-products લખશો તો પણ આ જ પેજ ખુલશે */}
        <Route path="/shop" element={<AllProducts />} />
        <Route path="/all-products" element={<AllProducts />} /> 
        
        <Route path="/our-story" element={<OurStory />} />

        {/* Profile & History Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/order-history" element={<OrderHistory />} />
        
        {/* Category Pages */}
        <Route path="/shop/cleanse" element={<AllProducts category="cleanse" />} />
        <Route path="/shop/hydrate" element={<AllProducts category="hydrate" />} />
        <Route path="/shop/protect" element={<AllProducts category="protect" />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Checkout & Cart */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;