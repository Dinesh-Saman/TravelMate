import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FrontPage.css';

const FrontPage = () => {
  const navigate = useNavigate();

  const handleViewPackages = () => {
    navigate('/packages');
  };

  return (
    <div className="front-body">
      <div className="front-section front-about-us">
        <img
          alt="Beach with palm trees"
          height="600"
          src="https://c1.wallpaperflare.com/preview/784/803/671/srilanka-ella-landscape-hill.jpg"
          width="1200"
        />
        <h1>Travel Lanka</h1>
      </div>
      <div className="front-section front-promotion">
        <h1>We Provide You Best Sri Lanka Tours</h1>
        <div className="front-image-container">
          <img
            alt="Scenic view of Sri Lanka"
            height="200"
            src="https://th.bing.com/th/id/OIP.xV03cIik_fw5PRkb8_X59wHaD5?w=337&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            width="200"
          />
        </div>
        <br />
        <button className="front-button" onClick={handleViewPackages}>
          View Packages
        </button>
      </div>
      <div className="front-section front-sri-lanka">
        <img
          alt="Cityscape of Sri Lanka"
          height="600"
          src="https://images.abercrombiekent.com.au/images/Countries/_1200x630_crop_center-center_82_none/2015-Inida-Beyond-Sri-Lanka-Country-Page-SS-Hero.jpg?mtime=1436063135"
          width="1200"
        />
        <h1>Sri Lanka</h1>
      </div>
    </div>
  );
};

export default FrontPage;