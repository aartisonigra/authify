import React from 'react';
import './Button.css'; // Pure CSS import

const Button = ({ text, onClick, className = "", type = "button", variant = "primary" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      // Tailwind classes kadhi ne custom classes nakhiya che
      className={`custom-btn-main ${variant} ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;