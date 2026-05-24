import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';

import './Profile.css';
import Home from './Home';

const Profile = () => {

    // =========================
    // ACTIVE TAB
    // =========================
    const [activeTab, setActiveTab] = useState('ailab');

    // =========================
    // PROFILE DATA
    // =========================
    const [profileData, setProfileData] = useState({
        full_name: localStorage.getItem("user_name") || "Aarti",
        email: localStorage.getItem("user_email") || "test1@gmail.com",
        bio: "SKINCARE ENTHUSIAST",
        location: "Surat, Gujarat",
        balance: "450.00"
    });

    // =========================
    // LOADING
    // =========================
    const [loading, setLoading] = useState(true);

    // =========================
    // WALLET
    // =========================
    const [addAmount, setAddAmount] = useState("200");

    // =========================
    // STORE STATES
    // =========================
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    // =========================
    // AI STATES
    // =========================
    const [skinScore, setSkinScore] = useState(78);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const webcamRef = useRef(null);

    // =========================
    // CLOCK & QUOTES
    // =========================
    const [timeString, setTimeString] = useState("");
    const [currentQuote, setCurrentQuote] = useState(
        "Your skin is an investment, not an expense. ✨"
    );

    // =========================
    // PRODUCTS
    // =========================
    const products = [
        {
            id: 1,
            name: "Hydrating Cleanser",
            icon: "🧴",
            category: "Cleanser"
        },
        {
            id: 2,
            name: "Niacinamide Serum",
            icon: "🧪",
            category: "Serum"
        },
        {
            id: 3,
            name: "Hyaluronic Acid Mask",
            icon: "🎭",
            category: "Mask"
        },
        {
            id: 4,
            name: "Vitamin C Glow Cream",
            icon: "☀️",
            category: "Cream"
        }
    ];

    // =========================
    // FILTER PRODUCTS
    // =========================
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // =========================
    // LIVE CLOCK
    // =========================
    useEffect(() => {

        const timer = setInterval(() => {
            const now = new Date();

            setTimeString(
                now.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            );

        }, 1000);

        const quotes = [
            "Your skin is an investment, not an expense. ✨",
            "Glowing skin is always in style! 🌟",
            "Invest in your skin. It is going to represent you for a long time.",
            "Healthy skin is a reflection of overall wellness."
        ];

        setCurrentQuote(
            quotes[Math.floor(Math.random() * quotes.length)]
        );

        return () => clearInterval(timer);

    }, []);

    // =========================
    // FETCH PROFILE DATA
    // =========================
    useEffect(() => {

        const fetchProfileData = async () => {

            const token = localStorage.getItem("access_token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const response = await axios.get(
                    'http://127.0.0.1:8000/api/profile/',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setProfileData(response.data);

            } catch (error) {

                console.log("Profile Fetch Error:", error);

            } finally {

                setLoading(false);

            }
        };

        fetchProfileData();

    }, []);

    // =========================
    // ADD MONEY
    // =========================
    const handleAddMoney = async () => {

        const token = localStorage.getItem("access_token");

        try {

            const response = await axios.post(
                'http://127.0.0.1:8000/api/add-money/',
                {
                    amount: addAmount
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.status === "success") {

                setProfileData({
                    ...profileData,
                    balance: response.data.balance
                });

                alert("Top-Up Successful ✅");
            }

        } catch (error) {

            console.log(error);

            alert("Top-Up Failed ❌");
        }
    };

    // =========================
    // CAMERA ANALYSIS
    // =========================
    const captureAndAnalyze = () => {

        const imageSrc = webcamRef.current.getScreenshot();

        if (imageSrc) {

            alert("🔍 Skin Analyzing Started...");

            setTimeout(() => {

                const randomScore =
                    Math.floor(Math.random() * (95 - 75 + 1)) + 75;

                setSkinScore(randomScore);

                alert(`✨ Skin Analysis Complete!\nSkin Score: ${randomScore}%`);

                setIsCameraOpen(false);

            }, 2000);
        }
    };

    // =========================
    // LOADING UI
    // =========================
    if (loading) {
        return (
            <div className="loading-spinner">
                ✨ Preparing Dreama AI Lab...
            </div>
        );
    }

    // =========================
    // HOME PAGE
    // =========================
    if (activeTab === 'home') {
        return <Home />;
    }

    return (

        <div className="dashboard-outer-wrapper">

            {/* =========================
                GREETING BAR
            ========================= */}

            <div className="live-greeting-bar">

                <div className="greeting-text">
                    <h2>
                        Hello, {profileData.full_name} 👋
                    </h2>

                    <p className="quote-fade">
                        "{currentQuote}"
                    </p>
                </div>

                <div className="live-clock-badge">
                    ⏰ {timeString || "12:00 PM"}
                </div>

            </div>

            {/* =========================
                GRID CONTAINER
            ========================= */}

            <div className="dashboard-grid-container">

                {/* =========================
                    LEFT COLUMN
                ========================= */}

                <div className="grid-column column-left">

                    {/* AI CARD */}

                    <div className="dash-card ai-intelligence-card">

                        <div className="card-header-flex">

                            <h3 className="card-heading">
                                AI Skin Intelligence
                            </h3>

                            <div className="live-pill-pulse">
                                LIVE SCAN
                            </div>

                        </div>

                        {/* CAMERA */}

                        {isCameraOpen ? (

                            <div className="camera-container">

                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="webcam-view"
                                />

                                <button
                                    className="scan-now-btn"
                                    onClick={captureAndAnalyze}
                                >
                                    🔍 Scan My Skin
                                </button>

                            </div>

                        ) : (

                            <div className="ai-content-layout">

                                <div className="ai-scanner-mock">

                                    <div className="scanner-line"></div>

                                    <span className="face-emoji">
                                        👤
                                    </span>

                                </div>

                                <div className="ai-stats-list">

                                    <div className="stat-item">
                                        <span>Skin Texture:</span>
                                        <strong> Smooth</strong>
                                    </div>

                                    <div className="stat-item">
                                        <span>Hydration:</span>
                                        <strong> Radiant</strong>
                                    </div>

                                    <div className="stat-item">
                                        <span>Pores:</span>
                                        <strong> Refined</strong>
                                    </div>

                                </div>

                            </div>
                        )}

                        {/* CAMERA BUTTON */}

                        <button
                            className="re-scan-btn"
                            style={{ marginTop: '15px' }}
                            onClick={() => setIsCameraOpen(!isCameraOpen)}
                        >
                            {isCameraOpen
                                ? "❌ Close Camera"
                                : "📸 Open Camera"}
                        </button>

                        {/* SCORE */}

                        <div className="skin-health-score-zone">

                            <div className="score-meta-txt">

                                <span>
                                    Overall Skin Health
                                </span>

                                <strong>
                                    {skinScore}%
                                </strong>

                            </div>

                            <div className="progress-bar-bg">

                                <div
                                    className="progress-bar-fill"
                                    style={{
                                        width: `${skinScore}%`
                                    }}
                                ></div>

                            </div>

                        </div>

                    </div>

                    {/* INGREDIENTS */}

                    <div className="dash-card ingredients-card">

                        <h3 className="card-heading">
                            Recommended Ingredients
                        </h3>

                        <div className="ingredients-row">

                            <div className="ing-badge">
                                🧪 Niacinamide
                            </div>

                            <div className="ing-badge">
                                💧 Hyaluronic Acid
                            </div>

                            <div className="ing-badge">
                                ☀️ Vitamin C
                            </div>

                        </div>

                    </div>

                    {/* ROUTINE */}

                    <div className="dash-card routine-tracker-card">

                        <h3 className="card-heading">
                            Daily Routine
                        </h3>

                        <div className="tracker-timeline">

                            <div className="timeline-row">

                                <span className="time-lbl">
                                    AM
                                </span>

                                <div className="check-bubbles">

                                    <span className="bubble checked">
                                        ✓
                                    </span>

                                    <span className="bubble checked">
                                        ✓
                                    </span>

                                    <span className="bubble"></span>

                                </div>

                            </div>

                            <div className="timeline-row">

                                <span className="time-lbl">
                                    PM
                                </span>

                                <div className="check-bubbles">

                                    <span className="bubble checked">
                                        ✓
                                    </span>

                                    <span className="bubble"></span>

                                    <span className="bubble"></span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =========================
                    CENTER COLUMN
                ========================= */}

                <div className="grid-column column-center">

                    <div className="dash-card main-profile-card">

                        <div className="brand-header-banner"></div>

                        <div className="avatar-positioner">

                            <div className="avatar-circle">
                                {profileData.full_name
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                        </div>

                        <div className="profile-identity-info">

                            <h2 className="user-title-name">
                                {profileData.full_name}
                            </h2>

                            <p className="user-sub-role">
                                {profileData.bio}
                            </p>

                        </div>

                        {/* WALLET */}

                        <div className="dreama-wallet-box">

                            <span className="wallet-box-title">
                                Dreama Wallet Balance
                            </span>

                            <h2 className="wallet-main-balance">
                                ₹ {profileData.balance}
                            </h2>

                            <div className="wallet-input-flex">

                                <div className="counter-input-group">

                                    <button
                                        onClick={() =>
                                            setAddAmount(
                                                Math.max(
                                                    0,
                                                    parseInt(addAmount) - 50
                                                ).toString()
                                            )
                                        }
                                    >
                                        -
                                    </button>

                                    <input
                                        type="number"
                                        value={addAmount}
                                        onChange={(e) =>
                                            setAddAmount(e.target.value)
                                        }
                                    />

                                    <button
                                        onClick={() =>
                                            setAddAmount(
                                                (
                                                    parseInt(addAmount) + 50
                                                ).toString()
                                            )
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                                <button
                                    className="confirm-topup-btn"
                                    onClick={handleAddMoney}
                                >
                                    Confirm Top-Up →
                                </button>

                            </div>

                        </div>

                        {/* DETAILS */}

                        <div className="account-meta-details">

                            <div className="meta-block">

                                <label>EMAIL</label>

                                <p>{profileData.email}</p>

                            </div>

                            <div className="meta-block">

                                <label>LOCATION</label>

                                <p>{profileData.location}</p>

                            </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="profile-footer-actions">

                            <button className="btn-action-edit">
                                Edit Profile
                            </button>

                            <button
                                className="btn-action-logout"
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.href = "/login";
                                }}
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </div>

                {/* =========================
                    RIGHT COLUMN
                ========================= */}

                <div className="grid-column column-right">

                    {/* STORE */}

                    <div className="dash-card integrated-store-card">

                        <div className="card-header-flex">

                            <h3 className="card-heading">
                                Dreama Store
                            </h3>

                            <div className="cart-badge-indicator">
                                🛒 {cartCount}
                            </div>

                        </div>

                        <input
                            type="text"
                            placeholder="🔍 Search Products..."
                            className="store-search-bar"
                            value={searchQuery}
                            onChange={(e) =>
                                setSearchQuery(e.target.value)
                            }
                        />

                        <div className="mini-products-row-container">

                            {filteredProducts.map((product) => (

                                <div
                                    className="mini-product-thumb"
                                    key={product.id}
                                >

                                    <div className="product-placeholder-img">
                                        {product.icon}
                                    </div>

                                    <span>
                                        {product.name}
                                    </span>

                                    <button
                                        className="btn-mini-add"
                                        onClick={() =>
                                            setCartCount(cartCount + 1)
                                        }
                                    >
                                        Add
                                    </button>

                                </div>

                            ))}

                            {filteredProducts.length === 0 && (

                                <p className="no-products-msg">
                                    No Products Found
                                </p>

                            )}

                        </div>

                    </div>

                    {/* OFFERS */}

                    <div className="dash-card member-offers-card">

                        <h3 className="card-heading">
                            Member Offers
                        </h3>

                        <div className="voucher-ticket-box">

                            <div>

                                <strong>
                                    15% OFF Your Next Order
                                </strong>

                                <p>
                                    Exclusive Voucher
                                </p>

                            </div>

                            <div className="voucher-code-rotate">
                                VOUCH96
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* =========================
                BOTTOM NAVBAR
            ========================= */}

            <div className="floating-bottom-nav">

                <div
                    className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => setActiveTab('home')}
                >
                    <span>🏠</span>
                    <label>Home</label>
                </div>

                <div
                    className={`nav-item ${activeTab === 'ailab' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ailab')}
                >
                    <span>🧬</span>
                    <label>AI Lab</label>
                </div>

                <div
                    className={`nav-item ${activeTab === 'store' ? 'active' : ''}`}
                    onClick={() => setActiveTab('store')}
                >
                    <span>🛒</span>
                    <label>Store</label>
                </div>

                <div
                    className={`nav-item ${activeTab === 'offers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('offers')}
                >
                    <span>🎁</span>
                    <label>Offers</label>
                </div>

                <div
                    className="nav-item"
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/login";
                    }}
                >
                    <span>🚪</span>
                    <label>Logout</label>
                </div>

            </div>

        </div>
    );
};

export default Profile;