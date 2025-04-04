// src/components/TravelManagement.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TravelManagement.css'; // Ensure this CSS file exists

const TravelManagement = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  return (
    <div className="travel-management">
      <h1>Trave-Mate</h1>
      <h1>Welcome to Our Travel-Mate System</h1>
      <div className="button-container">
        <button onClick={() => navigate('/AdminHome')} className="btn">Packages</button>
        <button onClick={() => navigate('/admin/bookings')} className="btn">Bookings</button>
      </div>
    </div>
  );
};

export default TravelManagement;
