import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderHistory.css'; // CSS ઈમ્પોર્ટ કરી

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/order-history/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching orders", err);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="orders-container">
            <h2 className="orders-title">My Order History</h2>
            
            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-info">
                                <h3>Order #{order.id}</h3>
                                <p>Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                                <span className="order-status">Confirmed</span>
                            </div>
                            
                            <div style={{ textAlign: 'right' }}>
                                <div className="order-price">£{order.total_amount}</div>
                                <a 
                                    href={`http://127.0.0.1:8000/api/download-invoice/${order.id}/`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="download-btn"
                                    style={{ marginTop: '10px' }}
                                >
                                    PDF Invoice
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;