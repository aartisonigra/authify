import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // લોગિન સ્ટેટ ચેક કરવા માટેનું ફંક્શન
  const checkLoginStatus = () => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    // પહેલીવાર લોડ થાય ત્યારે ચેક કરો
    checkLoginStatus();

    // ૧. કસ્ટમ ઈવેન્ટ લિસનર (Login/Logout માટે)
    window.addEventListener("authChange", checkLoginStatus);
    
    // ૨. Storage ઈવેન્ટ (જો બીજી ટેબમાં લોગિન/આઉટ થાય તો)
    window.addEventListener("storage", checkLoginStatus);
    
    // ક્લીનઅપ ફંક્શન
    return () => {
      window.removeEventListener("authChange", checkLoginStatus);
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  return (
    <nav className="navbar-container">
      {/* Left Side: Logo */}
      <div className="nav-brand-box">
        <Link to="/" className="nav-logo-text">dreama.</Link>
      </div>

      {/* Center Side: Links */}
      <div className="nav-menu-center">
        <Link to="/shop" className="nav-item">Shop All</Link>
        <Link to="/shop/cleanse" className="nav-item">Cleanse</Link>
        <Link to="/shop/hydrate" className="nav-item">Hydrate</Link>
        <Link to="/shop/protect" className="nav-item">Protect</Link>
        <Link to="/shop/new-arrivals" className="nav-item">New Arrivals</Link>
        <Link to="/our-story" className="nav-item">Our Story</Link>
      </div>

      {/* Right Side: Profile/Login and Cart */}
      <div className="nav-actions-right">
        {isLoggedIn ? (
          <Link to="/profile" className="login-link">
            <span className="icon">👤</span>
            <span>Profile</span>
          </Link>
        ) : (
          <Link to="/login" className="login-link">
            <span className="icon">👤</span>
            <span>Log In</span>
          </Link>
        )}
        
        <Link to="/cart" className="cart-box" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="icon">🛒</span>
          <span className="cart-count">0</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;