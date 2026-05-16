import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

// તારી Home.jsx ફાઇલને અહીં લિંક કરી દીધી છે
import Home from './Home'; 

const Profile = () => {
    // === 1. NAVIGATION TAB STATE ===
    // બાય-ડિફોલ્ટ 'ailab' રાખ્યું છે જેથી પહેલા આ પેજ ખુલે
    const [activeTab, setActiveTab] = useState('ailab'); 

    // 2. Core Profile States
    const [profileData, setProfileData] = useState({
        full_name: localStorage.getItem("user_name") || "aarti",
        email: localStorage.getItem("user_email") || "test1@gmail.com",
        bio: "SKINCARE ENTHUSIAST",
        location: "Surat, Gujarat",
        balance: "450.00"
    });
    const [loading, setLoading] = useState(true);
    const [addAmount, setAddAmount] = useState("200");

    // 3. Interactive Feature States
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [skinScore, setSkinScore] = useState(78);
    const [currentQuote, setCurrentQuote] = useState("Your skin is an investment, not an expense. ✨");
    const [timeString, setTimeString] = useState("");

    // Store products data mock for interactivity
    const products = [
        { id: 1, name: "Hydrating Cleanser", icon: "🧴", category: "Cleanser" },
        { id: 2, name: "Niacinamide Serum", icon: "🧪", category: "Serum" },
        { id: 3, name: "Hyaluronic Acid Mask", icon: "🎭", category: "Mask" },
        { id: 4, name: "Vitamin C Glow Cream", icon: "☀️", category: "Cream" }
    ];

    // Filter products based on search
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Live clock & Quotes effect
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);

        const quotes = [
            "Your skin is an investment, not an expense. ✨",
            "Invest in your skin. It is going to represent you for a long time. 💆‍♀️",
            "Glowing skin is always in style! 🌟",
            "Be good to your skin. You'll wear it every day for the rest of your life."
        ];
        setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setProfileData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const handleAddMoney = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/add-money/', 
                { amount: addAmount },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (response.data.status === "success") {
                setProfileData({ ...profileData, balance: response.data.balance });
                alert("Top-Up Successful!");
            }
        } catch (error) {
            alert("Failed to top up balance.");
        }
    };

    if (loading) return <div className="loading-spinner">✨ Preparing Dreama Artificial Intelligence Lab...</div>;

    return (
        <div className="dashboard-outer-wrapper">
            
            {/* === CONDITION 1: જો HOME ACTIVE હોય તો HOME.JSX લોડ થશે === */}
            {activeTab === 'home' && (
                <div className="tab-content-render animate-fade-in" style={{ width: '100%' }}>
                    <Home />
                </div>
            )}

            {/* === CONDITION 2: જો AI LAB ACTIVE હોય તો આખું લક્ઝુરિયસ ડેશબોર્ડ દેખાશે === */}
            {activeTab === 'ailab' && (
                <div className="tab-content-render animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    
                    {/* === FLOATING GREETING HEADER === */}
                    <div className="live-greeting-bar">
                        <div className="greeting-text">
                            <h2>Hello, {profileData.full_name} 👋</h2>
                            <p className="quote-fade">"{currentQuote}"</p>
                        </div>
                        <div className="live-clock-badge">
                            ⏰ {timeString || "12:00 PM"}
                        </div>
                    </div>

                    <div className="dashboard-grid-container">
                        
                        {/* === LEFT COLUMN: AI LAB & ROUTINE === */}
                        <div className="grid-column column-left">
                            {/* Card 1: AI Skin Intelligence with Live Score */}
                            <div className="dash-card ai-intelligence-card">
                                <div className="card-header-flex">
                                    <h3 className="card-heading">AI Skin Intelligence</h3>
                                    <div className="live-pill-pulse">Live Scanner</div>
                                </div>
                                <div className="ai-content-layout">
                                    <div className="ai-scanner-mock">
                                        <div className="scanner-line"></div>
                                        <span className="face-emoji">👤</span>
                                    </div>
                                    <div className="ai-stats-list">
                                        <div className="stat-item"><span>Skin Texture:</span> <strong>Smooth</strong></div>
                                        <div className="stat-item"><span>Pores:</span> <strong>Refined</strong></div>
                                        <div className="stat-item"><span>Hydration:</span> <strong>Radiant</strong></div>
                                    </div>
                                </div>
                                {/* Interactive Skin Health Progress Bar */}
                                <div className="skin-health-score-zone">
                                    <div className="score-meta-txt">
                                        <span>Overall Skin Health Index</span>
                                        <strong>{skinScore}%</strong>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div className="progress-bar-fill" style={{ width: `${skinScore}%` }}></div>
                                    </div>
                                    <button className="re-scan-btn" onClick={() => setSkinScore(Math.floor(Math.random() * (95 - 75 + 1)) + 75)}>
                                        🔄 Re-Scan Skin
                                    </button>
                                </div>
                            </div>

                            {/* Card 2: Recommendations */}
                            <div className="dash-card ingredients-card">
                                <h4 className="card-subheading">Personalized Ingredient Recommendations</h4>
                                <div className="ingredients-row">
                                    <div className="ing-badge">🧪 Niacinamide <small>(Redness Reduction)</small></div>
                                    <div className="ing-badge">💧 Hyaluronic Acid <small>(Instant Plump)</small></div>
                                </div>
                            </div>

                            {/* Card 3: Skincare Tracker */}
                            <div className="dash-card routine-tracker-card">
                                <h3 className="card-heading">Daily Skincare Routine Tracker</h3>
                                <div className="tracker-timeline">
                                    <div className="timeline-row">
                                        <span className="time-lbl">AM</span>
                                        <div className="check-bubbles">
                                            <span className="bubble checked">✓</span>
                                            <span className="bubble checked">✓</span>
                                            <span className="bubble"></span>
                                        </div>
                                    </div>
                                    <div className="timeline-row">
                                        <span className="time-lbl">PM</span>
                                        <div className="check-bubbles">
                                            <span className="bubble checked">✓</span>
                                            <span className="bubble"></span>
                                            <span className="bubble"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* === CENTER COLUMN: THE MAIN PROFILE & WALLET === */}
                        <div className="grid-column column-center">
                            <div className="dash-card main-profile-card">
                                <div className="brand-header-banner"></div>
                                <div className="avatar-positioner">
                                    <div className="avatar-circle">
                                        {profileData.full_name.charAt(0).toUpperCase()}
                                    </div>
                                </div>

                                <div className="profile-identity-info">
                                    <h2 className="user-title-name">{profileData.full_name}</h2>
                                    <p className="user-sub-role">{profileData.bio}</p>
                                </div>

                                {/* Dreama Wallet Top-Up Display */}
                                <div className="dreama-wallet-box">
                                    <span className="wallet-box-title">Dreama Wallet Balance</span>
                                    <h2 className="wallet-main-balance">₹ {profileData.balance}</h2>
                                    
                                    <div className="wallet-input-flex">
                                        <div className="counter-input-group">
                                            <button onClick={() => setAddAmount(Math.max(0, parseInt(addAmount) - 50).toString())}>-</button>
                                            <input 
                                                type="number" 
                                                value={addAmount} 
                                                onChange={(e) => setAddAmount(e.target.value)} 
                                            />
                                            <button onClick={() => setAddAmount((parseInt(addAmount) + 50).toString())}>+</button>
                                        </div>
                                        <button className="confirm-topup-btn" onClick={handleAddMoney}>
                                            Confirm Top-Up →
                                        </button>
                                    </div>

                                    <div className="topup-history-sheet">
                                        <div className="history-header">Recent Top-Up History</div>
                                        <div className="history-item"><span>+₹200</span> <small>(15 May)</small></div>
                                        <div className="history-item"><span>+₹100</span> <small>(14 May)</small></div>
                                    </div>
                                </div>

                                <div className="account-meta-details">
                                    <div className="meta-block">
                                        <label>EMAIL ADDRESS</label>
                                        <p>{profileData.email}</p>
                                    </div>
                                    <div className="meta-block">
                                        <label>LOCATION</label>
                                        <p>{profileData.location}</p>
                                    </div>
                                </div>

                                <div className="profile-footer-actions">
                                    <button className="btn-action-edit">Edit Profile</button>
                                    <button className="btn-action-logout" onClick={() => {
                                        localStorage.clear();
                                        window.location.href = "/login";
                                    }}>Logout</button>
                                </div>
                            </div>
                        </div>

                        {/* === RIGHT COLUMN: UNFILTERED FEED & STORE === */}
                        <div className="grid-column column-right">
                            {/* Card 1: Feed */}
                            <div className="dash-card unfiltered-feed-card">
                                <div className="card-header-flex">
                                    <h3>Dreama unfiltered Feed</h3>
                                    <span className="view-all-link">View all</span>
                                </div>
                                <div className="feed-post-preview">
                                    <div className="post-user-bar">
                                        <div className="mini-avatar">A</div>
                                        <strong>{profileData.full_name}</strong>
                                        <span className="rating-stars">★★★★★</span>
                                    </div>
                                    <p className="post-text-snippet">Cleanser recent eastss her the reviews in custombant avoator too letost ahead...</p>
                                </div>
                            </div>

                            {/* Card 2: Interactive Store Section with Live Filter */}
                            <div className="dash-card integrated-store-card">
                                <div className="card-header-flex">
                                    <h3>Integrated Store Section</h3>
                                    <div className="cart-badge-indicator">🛒 <span>{cartCount}</span></div>
                                </div>
                                <input 
                                    type="text" 
                                    className="store-search-bar"
                                    placeholder="🔍 Search products (Cleanser, Serum...)" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="mini-products-row-container">
                                    {filteredProducts.map(product => (
                                        <div className="mini-product-thumb" key={product.id}>
                                            <div className="product-placeholder-img">{product.icon}</div>
                                            <span>{product.name}</span>
                                            <button className="btn-mini-add" onClick={() => setCartCount(cartCount + 1)}>Add</button>
                                        </div>
                                    ))}
                                    {filteredProducts.length === 0 && <p className="no-products-msg">No products matches search.</p>}
                                </div>
                            </div>

                            {/* Card 3: Vouchers */}
                            <div className="dash-card member-offers-card">
                                <h3>Member Offers</h3>
                                <span className="offers-subtext">Exclusive Vouchers</span>
                                <div className="voucher-ticket-box">
                                    <div className="voucher-left">
                                        <strong>15% Off Your Next Haul!</strong>
                                        <p>Exclusive voucher</p>
                                    </div>
                                    <div className="voucher-code-rotate">VOUCH96</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* === BOTTOM FLOATING NAVIGATION BAR === */}
            <div className="floating-bottom-nav">
                {/* Home પર ક્લિક કરવાથી activeTab 'home' સેટ થશે */}
                <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                    <span>🏠</span> <label>Home</label>
                </div>
                <div className={`nav-item ${activeTab === 'store' ? 'active' : ''}`} onClick={() => setActiveTab('store')}>
                    <span>🛒</span> <label>Store</label>
                </div>
                <div className={`nav-item ${activeTab === 'routine' ? 'active' : ''}`} onClick={() => setActiveTab('routine')}>
                    <span>📅</span> <label>Routine</label>
                </div>
                {/* AI Lab પર ક્લિક કરવાથી activeTab 'ailab' સેટ થશે */}
                <div className={`nav-item ${activeTab === 'ailab' ? 'active' : ''}`} onClick={() => setActiveTab('ailab')}>
                    <span>🧬</span> <label>AI Lab</label>
                </div>
                <div className={`nav-item ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => setActiveTab('offers')}>
                    <span>🎁</span> <label>Offers</label>
                </div>
                <div className="nav-item" onClick={() => { localStorage.clear(); window.location.href="/login"; }}>
                    <span>🚪</span> <label>Logout</label>
                </div>
            </div>
        </div>
    );
};

export default Profile;