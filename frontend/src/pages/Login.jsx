import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/Auth/Auth.css'; 

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); 

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = isLogin ? "login/" : "signup/";
    const url = `http://127.0.0.1:8000/api/${endpoint}`;

    try {
      const response = await axios.post(url, formData);
      
      if (response.status === 200 || response.status === 201) {
        if (isLogin) {
            // ડેટા Save કરો
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            localStorage.setItem("user_name", response.data.full_name || "User");
            localStorage.setItem("user_email", formData.email);
            
            alert("Login Successful! Welcome Back.");
            
            // === આ લાઇન ખૂબ મહત્વની છે ===
            // આ ઇવેન્ટ Navbar ને અપડેટ થવા માટે સિગ્નલ આપશે
            window.dispatchEvent(new Event("authChange"));
            
            navigate("/profile"); // હવે સીધું પેજ રીલોડ થયા વગર નેવિગેટ કરો
        } else {
            alert("Account Created Successfully! હવે લોગિન કરો.");
            setIsLogin(true); 
            setFormData({ full_name: '', email: '', password: '' });
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      if (!error.response) {
          alert("Database connection error! પાયથોન સર્વર ચાલુ છે કે નહીં તે ચેક કરો.");
      } else {
          const errorMsg = error.response?.data?.error || "Invalid credentials!";
          alert(errorMsg);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-split-container">
        <div className="auth-left-design">
          <div className="brand-name-top">dreama.</div>
          <div className="main-image-wrapper">
            <img src="https://www.tahaayurveda.com/service/image/9439073b400ba794bb716efc3aef1af0.webp" alt="Skincare" />
          </div>
          <div className="protect-skin-badge">Protect Your Skin</div>
        </div>

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
                  type="text" name="full_name" className="input-field" 
                  placeholder="Full Name" value={formData.full_name}
                  onChange={handleChange} required
                />
              </div>
            )}
            
            <div className="input-group">
              <label>Email Address*</label>
              <input 
                type="email" name="email" className="input-field" 
                placeholder="test1@gmail.com" value={formData.email}
                onChange={handleChange} required
              />
            </div>

            <div className="input-group">
              <label>Password*</label>
              <input 
                type="password" name="password" className="input-field" 
                placeholder="••••••••" value={formData.password}
                onChange={handleChange} required
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