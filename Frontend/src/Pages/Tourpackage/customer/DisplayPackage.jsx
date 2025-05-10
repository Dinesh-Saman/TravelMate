// src/components/DisplayPackage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DisplayPackage.css';

const DisplayPackage = () => {
  const [cardData, setCardData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await axios.get('https://travelmatebackend-hshfxofqc-dineshs-projects-1830e570.vercel.app/api/package');
        if (Array.isArray(response.data)) {
          setCardData(response.data);
        } else {
          console.error('API response is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching card data:', error);
      }
    };

    fetchCardData(); // Fetch data initially

    const intervalId = setInterval(fetchCardData, 30000); // Fetch data every 30 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const handleBookClick = (card) => {
    navigate('/packagedetails', { state: { card } });
  };

  const filteredCards = cardData.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="package-body">
      <h1 className="package-h1">Packages</h1>

      <div className="package-search-container">
        <input
          type="text"
          placeholder="Search by package name or location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="package-search-input"
        />
      </div>

      <div className="package-package-list">
        {filteredCards.map((card) => (
          <div key={card._id} className="package-package-card" >
            {card.image && <img src={card.image} alt={card.name} className="package-card-image" />}
            <h2>{card.name}</h2>
            <p className="package-card-price">Price: Rs{card.price}</p>
            <p className="package-card-location">Location: {card.location}</p>
            <p className="package-card-duration">Duration: {card.duration}</p>
            <button className="package-book-button" onClick={() => handleBookClick(card)}>View</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayPackage;