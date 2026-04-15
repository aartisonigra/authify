import React from 'react';
import { Link } from 'react-router-dom'; 
import Navbar from '../components/Common/Navbar';
import Button from '../components/Common/Button';
import './Home.css'; 

// Local image imports
import girlFace from '../assets/girl-face.png'; 
import skincareProducts from '../assets/Top-5-Skincare-Products-Every-Girl-Should-Have-in-2025-removebg-preview.png';

const Home = () => {
  // 1. Products Data
  const products = [
    { id: 1, name: "Hydrating Solar Mist", price: "$22.00", tags: ["Coconut", "Unscented"], img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Cooling After Sun Gel", price: "$24.00", tags: ["50ml", "100ml"], img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "Solar Lip Shield", price: "$15.00", tags: ["Coconut", "Watermelon"], img: "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=400", oldPrice: "$20.00" },
    { id: 4, name: "Glow Daily Sun Serum", price: "$32.00", tags: ["30ml", "50ml"], img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400" }
  ];

  // 2. Glow Steps Data
  const glowSteps = [
    { id: 1, label: "cleanse", sub: "The ultimate reset.", path: "/shop/cleanse", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600" },
    { id: 2, label: "hydrate", sub: "Maximum dew. Zero effort.", path: "/shop/hydrate", img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600" },
    { id: 3, label: "protect", sub: "Shield the shine.", path: "/shop/protect", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLLbdW5D1SnqDoN9soRApyQSpmOjiuSyV9Wg&s" }
  ];

  // 3. Social Grid Data
  const socialFeed = [
    { id: 1, img: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=400" },
    { id: 2, img: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?q=80&w=400" },
    { id: 3, img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=400" }, 
    { id: 4, img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=400" }
  ];

  return (
    <div className="home-wrapper">
      <Navbar />

      {/* --- Section 1: Hero --- */}
      <main className="hero-section"> 
        <div className="hero-left">
          <div className="hero-content">
            <div className="hero-dash"></div> 
            <p className="hero-subtitle">
              the <span className="bold-text">skincare</span> <br /> 
              <span className="italic-text">revolution</span> is here.
            </p>
            <Link to="/shop">
               <Button text="Shop Now" variant="primary" />
            </Link>
          </div>
          <h1 className="hero-brand-name">dreama.</h1>
        </div>
        <div className="hero-right">
          <img src={girlFace} alt="Dreama Skincare" className="hero-img" />
        </div>
      </main>

      {/* --- Section 2: Solar Essentials --- */}
      <section className="essentials-container">
        <div className="essentials-grid">
          <div className="essentials-hero">
            <img src="https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=800" alt="Solar Model" />
            <div className="banner-badge">Sheer Body Sunscreen $35</div>
          </div>
          <div className="essentials-content">
            <div className="essentials-header">
              <h2 className="essentials-title">solar essentials</h2>
              <Link to="/shop">
                <Button text="Shop All →" variant="secondary" />
              </Link>
            </div>
            <div className="product-grid">
              {products.map((item) => (
                <div className="product-card" key={item.id}>
                  <div className="product-img-wrapper">
                    <img src={item.img} alt={item.name} />
                    <button className="add-btn">+</button>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{item.name}</h3>
                    <div className="price-container">
                      {item.oldPrice && <span className="old-price">{item.oldPrice}</span>}
                      <span className="current-price">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 3: Testimonial --- */}
      <section className="testimonial-section">
        <div className="quote-container">
          <h2 className="quote-text">“the search for real results is over at last.”</h2>
          <p className="quote-author">— Riley, SA</p>
        </div>
      </section>

      {/* --- Section 4: 1, 2, 3, Glow --- */}
      <section className="glow-steps-section">
        <h3 className="glow-title">1, 2, 3, glow</h3>
        <div className="glow-grid">
          {glowSteps.map((step) => (
            <div className="glow-card" key={step.id}>
              <div className="glow-img-wrapper">
                <img src={step.img} alt={step.label} className="glow-main-img" />
              </div>
              <div className="glow-info">
                <h4 className="step-name">{step.label}</h4>
                <p className="step-desc">{step.sub}</p>
                {/* Have aa button active chhe */}
                <Link to={step.path}>
                  <button className="glow-shop-btn">Shop All →</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Section 5: The New Standard --- */}
      <section className="standard-section">
        <div className="standard-container">
          <div className="standard-header">
            <h2 className="standard-title">the new <br /> standard</h2>
            <div className="standard-right-text">
              <p className="born-text">born in the lab.<br />worn in the wild.</p>
              {/* FIXED: Our Story button connected with Link */}
              <Link to="/our-story">
                <button className="story-btn">Our Story →</button>
              </Link>
            </div>
          </div>
          <div className="standard-banner">
            <img src={skincareProducts} alt="Products" className="banner-main-img centered-skincare" />
          </div>
        </div>
      </section>

      {/* --- Section 6: Shipping Banner --- */}
      <section className="shipping-banner">
        <div className="shipping-content">
          <h2 className="shipping-title">free shipping is on us.</h2>
          <div className="shipping-right">
            <p className="shipping-text">Own the glow. Free delivery on all orders over $60.</p>
            <Link to="/shop">
              <button className="shop-now-btn">Shop Now →</button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- Section 7: Social Grid --- */}
      <section className="unfiltered-section">
        <div className="unfiltered-header">
          <h3 className="unfiltered-title">dreama. unfiltered</h3>
          <button className="join-feed-btn">Join the Feed →</button>
        </div>
        <div className="unfiltered-grid">
          {socialFeed.map(post => (
            <div className="social-card" key={post.id}>
              <img src={post.img} alt="Social Feed" />
            </div>
          ))}
        </div>
      </section>

      {/* --- Section 8: Newsletter & Footer --- */}
      <footer className="footer-section">
        <div className="newsletter-container">
          <div className="newsletter-left">
            <h2 className="newsletter-title">get on the list</h2>
            <p className="newsletter-subtitle">10% off your first haul. Join for exclusive access and secret drops.</p>
          </div>
          <div className="newsletter-right">
            <form className="newsletter-form">
              <label>Email *</label>
              <input type="email" placeholder="Enter your email address" required />
              <div className="checkbox-group">
                <input type="checkbox" id="agree" required />
                <label htmlFor="agree">I agree to receive marketing emails *</label>
              </div>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
        </div>

        <div className="footer-main">
          <div className="footer-links-grid">
            <div className="footer-column">
              <Link to="/shop">Shop All</Link>
              <Link to="/shop/cleanse">Cleanse</Link>
              <Link to="/shop/hydrate">Hydrate</Link>
              <Link to="/shop/protect">Protect</Link>
              <Link to="/shop/new-arrivals">New Arrivals</Link>
              <Link to="/our-story">Our Story</Link>
            </div>
            <div className="footer-column">
              <Link to="/refund-policy">Refund Policy</Link>
              <Link to="/shipping-policy">Shipping Policy</Link>
              <Link to="/terms">Terms & Conditions</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/accessibility">Accessibility Statement</Link>
            </div>
          </div>
          
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer"><i className="fab fa-tiktok"></i></a>
          </div>

          <div className="footer-brand">
            <h1 className="footer-logo">dreama.</h1>
            <p className="copyright">© 2026 by dreama. Powered and secured by Wix</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;