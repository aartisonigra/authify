import React from 'react';
import './Profile.css';

const Profile = () => {
    const userName = localStorage.getItem("user_name") || "Aarti Sonigra";
    const userEmail = localStorage.getItem("user_email") || "aa2@gmail.com";
    
    // નામનો પહેલો અક્ષર લેવા માટે (Avatar માટે)
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="profile-wrapper">
            <div className="profile-card">
                <div className="profile-banner">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">{userInitial}</div>
                    </div>
                </div>
                
                <div className="profile-content">
                    <h2 className="profile-name">{userName}</h2>
                    <p className="profile-role">Skincare Enthusiast</p>
                    
                    <div className="details-grid">
                        <div className="detail-row">
                            <span className="detail-label">Email Address</span>
                            <span className="detail-value">{userEmail}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Location</span>
                            <span className="detail-value">Surat, Gujarat</span>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button className="edit-btn">Edit Profile</button>
                        <button className="logout-btn" onClick={() => {
                            localStorage.clear();
                            window.location.href = "/login";
                        }}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;