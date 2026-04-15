import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../components/Auth/Auth.css'; 

const Signup = () => {
  const navigate = useNavigate();
  const ayurvedaImg = "https://www.tahaayurveda.com/service/image/9439073b400ba794bb716efc3aef1af0.webp";

  // --- 1. Form States ---
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  // --- 2. Input Change Handler ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. Signup Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pehla basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!termsAccepted) {
      alert("Please accept the Terms and Conditions.");
      return;
    }

    try {
      // Tamara Django settings mujab URL
      const url = "http://127.0.0.1:8000/api/signup/";
      
      const response = await axios.post(url, {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 201 || response.status === 200) {
        alert("Account Created Successfully! Please Login.");
        navigate("/login"); // Signup thaya pachi login page par moklo
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data);
      alert(error.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-split-container">
        {/* Left Side Design */}
        <div className="auth-left-design">
          <div className="brand-name-top">KYAWO</div>
          <div className="main-image-wrapper">
            <img src={ayurvedaImg} alt="Skincare" />
          </div>
          <div className="protect-skin-badge">Protect Your Skin</div>
        </div>

        {/* Right Side Form */}
        <div className="auth-right-form">
          <h1 className="form-title">Create an account</h1>
          <p className="form-subtitle">Lets get started Sabi Girl!!!</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Name*</label>
              <input 
                type="text" 
                name="full_name"
                className="input-field" 
                placeholder="Your Name" 
                value={formData.full_name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="input-group">
              <label>Email*</label>
              <input 
                type="email" 
                name="email"
                className="input-field" 
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Password*</label>
                <input 
                  type="password" 
                  name="password"
                  className="input-field" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Confirm Password*</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  className="input-field" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="checkbox-row">
              <input 
                type="checkbox" 
                id="terms" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms">Accept our Terms and Conditions</label>
            </div>

            <button type="submit" className="submit-btn-premium">Create Account</button>
          </form>

          <div className="divider">or</div>
          
          <button className="google-btn" type="button">
            <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="G" />
            Sign up with Google
          </button>

          <p className="footer-link">
            Already a member? <Link to="/login"><b>Login</b></Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;