import React, { useState } from "react";
import "./Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Processing...");
    setIsSuccess(false);

    const url = isLogin
      ? "http://127.0.0.1:8000/api/login/"
      : "http://127.0.0.1:8000/api/signup/";

    const bodyData = isLogin
      ? { email, password }
      : { email, password, full_name: fullName };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage(isLogin ? "Welcome back! 🎉" : "Account created successfully 🎉");
        if (data.access) localStorage.setItem("access", data.access);
        
        if (!isLogin) {
          setTimeout(() => {
            setIsLogin(true);
            setMessage("Please login with your new account.");
            setIsSuccess(false);
          }, 2000);
        }
      } else {
        setIsSuccess(false);
        // Error message handling for 'auth_user' table missing error
        setMessage(data.error || data.detail || "Something went wrong. Run 'migrate' on backend.");
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage("Server connection failed! 🔌 Check if Python server is running.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Brand Header */}
        <h1 className="auth-brand">dreama.</h1>
        <h2 className="auth-title">{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className="auth-subtitle">Experience the skincare revolution.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Full Name" 
              className="auth-input"
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            className="auth-input"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="auth-input"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />

          <button type="submit" className="auth-submit-btn">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Status Messages */}
        {message && (
          <div className={`status-alert ${isSuccess ? "success" : "err"}`}>
            {message}
          </div>
        )}

        {/* Switch Login/Signup */}
        <p className="auth-switch">
          {isLogin ? "New to Dreama?" : "Already a member?"} 
          <span onClick={() => { setIsLogin(!isLogin); setMessage(""); }}>
            {isLogin ? " Create account" : " Sign in"}
          </span>
        </p>

        <button className="back-to-home" onClick={() => window.history.back()}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default Auth;