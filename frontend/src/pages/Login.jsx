import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/Auth/Auth.css'; 

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); 

  // Form States
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  });

  // Input change handle કરવા માટે
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // API Call logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = isLogin ? "login/" : "signup/";
    // તમારા Django backend નો સાચો URL અહિયાં હોવો જોઈએ
    const url = `http://127.0.0.1:8000/api/${endpoint}`;

    try {
      const response = await axios.post(url, formData);
      
      console.log("Response from Backend:", response.data);

      if (response.status === 200 || response.status === 201) {
        if (isLogin) {
            // બધો ડેટા Local Storage માં સેવ કરો
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            localStorage.setItem("user_name", response.data.full_name || "User");
            localStorage.setItem("user_email", formData.email); // પ્રોફાઇલ માટે ઈમેલ સેવ કર્યો
            
            alert("Login Successful! Welcome Back.");
            
            // લોગિન પછી સીધા પ્રોફાઇલ પેજ પર જવા માટે:
            navigate("/profile"); 
        } else {
            alert("Account Created Successfully! હવે લોગિન કરો.");
            setIsLogin(true); 
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      
      // જો સર્વર બંધ હોય અથવા ડેટાબેઝ એરર હોય તો:
      if (!error.response) {
          alert("Database connection error! મહેરબાની કરીને ચેક કરો કે તમારું Python સર્વર ચાલુ છે.");
      } else {
          const errorMsg = error.response?.data?.error || "Something went wrong. Please try again!";
          alert(errorMsg);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-split-container">
        {/* Left Side: Branding & Image */}
        <div className="auth-left-design">
          <div className="brand-name-top">dreama.</div>
          <div className="main-image-wrapper">
            <img src="https://www.tahaayurveda.com/service/image/9439073b400ba794bb716efc3aef1af0.webp" alt="Skincare" />
          </div>
          <div className="protect-skin-badge">Protect Your Skin</div>
        </div>

        {/* Right Side: Login/Signup Form */}
        <div className="auth-right-form">
          <h1 className="form-title">{isLogin ? "Welcome Back" : "Create account"}</h1>
          <p className="form-subtitle">
            {isLogin ? "The skincare revolution is here." : "Let's get started Sabi Girl!!!"}
          </p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <label>Name*</label>
                <input 
                  type="text" 
                  name="full_name"
                  className="input-field" 
                  placeholder="Full Name" 
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            
            <div className="input-group">
              <label>Email Address*</label>
              <input 
                type="email" 
                name="email"
                className="input-field" 
                placeholder="test1@gmail.com" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password*</label>
              <input 
                type="password" 
                name="password"
                className="input-field" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="submit-btn-premium">
              {isLogin ? "Login to Account →" : "Create Account"}
            </button>
          </form>

          <p className="footer-link">
            {isLogin ? "New to Dreama?" : "Already a member?"} 
            <span 
              onClick={() => setIsLogin(!isLogin)} 
              style={{cursor: 'pointer', color: '#e85289', fontWeight: 'bold', marginLeft: '5px'}}
            >
              {isLogin ? "Create account" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;