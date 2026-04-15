import React from "react";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";

const OurStory = () => {
  return (
    <div style={{ backgroundColor: "#FAF9F6", minHeight: "100vh" }}>
      <Navbar />
      
      <main className="story-container" style={{ 
        padding: "100px 8%", 
        display: "flex", 
        gap: "60px", 
        alignItems: "center",
        maxWidth: "1400px",
        margin: "0 auto" 
      }}>
        
        {/* Left Side: Content */}
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            color: "#601010", 
            fontSize: "3.5rem", 
            marginBottom: "30px", 
            fontFamily: "serif",
            fontWeight: "500"
          }}>
            our rebel dna
          </h1>
          
          <div style={{ color: "#601010", opacity: 0.9 }}>
            <p style={{ lineHeight: "1.8", fontSize: "1.1rem", marginBottom: "20px" }}>
              This is the space to introduce the story of your business. 
              Tell visitors how it got started. It’s an opportunity for you 
              to describe a special service or product it offers. You can 
              use this section to share your company’s history or highlight 
              a particular feature that sets it apart from competitors.
            </p>
            
            <p style={{ lineHeight: "1.8", fontSize: "1.1rem", marginBottom: "40px" }}>
              Let the writing speak for itself. Keep a consistent tone and 
              voice throughout the website to stay true to the brand image 
              and give visitors a taste of the company’s values and personality.
            </p>
          </div>

          {/* Signature Section */}
          <div style={{ marginTop: "30px" }}>
            <span style={{ 
              fontFamily: "'Cursive', 'Brush Script MT', sans-serif", 
              fontSize: "2.5rem", 
              color: "#601010" 
            }}>
              Aarti Sonigra
            </span>
            <p style={{ 
              marginTop: "5px", 
              fontSize: "0.9rem", 
              letterSpacing: "1px", 
              textTransform: "uppercase",
              color: "#601010"
            }}>
              Founder & Developer
            </p>
          </div>
        </div>

        {/* Right Side: Image */}
        <div style={{ flex: 1, position: "relative" }}>
          <img 
            src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800" 
            alt="Our Story Rebel DNA" 
            style={{ 
              width: "100%", 
              height: "auto",
              borderRadius: "4px", // Slight curve for modern look
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }} 
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OurStory;