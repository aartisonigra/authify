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
import Profile from "./pages/Profile"; 
import OrderHistory from "./pages/OrderHistory"; 
import Auth from "./components/Auth/Auth";

// 404 Page Component
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
        
        {/* 💡 ફિક્સ: અહીં આપણે કેટેગરીને ડાયનેમિક (:category) બનાવી દીધી છે.
          આનાથી /shop, /shop/cleanse, /shop/hydrate બધું જ આ એક જ લાઇનથી હેન્ડલ થશે 
          અને React દર વખતે પેજને નવેસરથી અપડેટ પણ કરશે!
        */}
        <Route path="/shop" element={<AllProducts key="all" category="all" />} />
        <Route path="/all-products" element={<AllProducts key="all-products" category="all" />} /> 
        
        <Route path="/shop/:category" element={<AllProducts />} />

        {/* Our Story Route */}
        <Route path="/our-story" element={<OurStory />} />

        {/* Profile & History Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/order-history" element={<OrderHistory />} />
        
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