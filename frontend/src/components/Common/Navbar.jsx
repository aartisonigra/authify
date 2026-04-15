import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar-container">
      {/* Left Side: Logo */}
      <div className="nav-brand-box">
        <Link to="/" className="nav-logo-text">dreama.</Link>
      </div>

      {/* Center Side: Active Navigation Links */}
      <div className="nav-menu-center">
        <Link to="/shop" className="nav-item">Shop All</Link>
        <Link to="/shop/cleanse" className="nav-item">Cleanse</Link>
        <Link to="/shop/hydrate" className="nav-item">Hydrate</Link>
        <Link to="/shop/protect" className="nav-item">Protect</Link>
        
        {/* FIXED: New Arrivals and Our Story are now active Links */}
        <Link to="/shop/new-arrivals" className="nav-item">New Arrivals</Link>
        <Link to="/our-story" className="nav-item">Our Story</Link>
      </div>

      {/* Right Side: Log In and Cart */}
      <div className="nav-actions-right">
        <Link to="/login" className="login-link">
          <span className="icon">👤</span>
          <span>Log In</span>
        </Link>
        
        <Link to="/cart" className="cart-box" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="icon">🛒</span>
          <span className="cart-count">0</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;