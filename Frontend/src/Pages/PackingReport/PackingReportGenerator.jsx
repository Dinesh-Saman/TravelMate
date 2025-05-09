import React, { useState } from 'react';
import './PackingReportGenerator.css';

const PackingReportGenerator = () => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [weather, setWeather] = useState('');
  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = () => {
    if (!destination || !duration || !weather) {
      setError('Please complete all fields to generate your packing list');
      setReport('');
      return;
    }
    setError('');
    setIsGenerating(true);

    setTimeout(() => {
      let items = [];

      // Essentials with emojis
      items.push('🛂 Passport / ID');
      items.push('🎫 Travel tickets (plane/train/bus)');
      items.push('🏨 Accommodation confirmations');
      items.push('💳 Wallet with cash & cards');
      items.push('📱 Phone + charger');
      items.push('🔋 Power bank');
      items.push('🔌 Travel adapter');
      items.push('🎧 Headphones/earbuds');
      items.push('📷 Camera');
      items.push('🧴 Toiletries (toothbrush, toothpaste, deodorant)');
      items.push('☀️ Sunscreen & bug spray');
      items.push('💊 Medications & first-aid kit');
      items.push('💧 Reusable water bottle');
      items.push('🍫 Snacks');
      items.push('📓 Notebook & pen');
      items.push('😷 Face masks & hand sanitizer');

      // Destination-based
      if (destination === 'Beach') {
        items.push('👙 Swimsuit', '🏖️ Beach towel', '🧴 Sunscreen', '🩴 Flip-flops');
      } else if (destination === 'Mountain') {
        items.push('🥾 Hiking boots', '🧥 Warm layers', '🎒 Backpack', '🔦 Flashlight');
      } else if (destination === 'City') {
        items.push('👟 Comfortable walking shoes', '🗺️ City map or guidebook');
      }

      // Weather-based
      if (weather === 'Rainy') {
        items.push('☔ Umbrella', '🧥 Raincoat', '👢 Waterproof shoes');
      } else if (weather === 'Cold') {
        items.push('🧥 Warm jacket', '🧤 Gloves', '🧣 Scarf', '🧢 Beanie');
      } else if (weather === 'Hot') {
        items.push('🧢 Hat', '🕶️ Sunglasses', '👕 Light clothing');
      }

      // Duration-based
      const days = parseInt(duration, 10);
      if (!isNaN(days)) {
        if (days >= 3) items.push('👚 Extra clothes', '🧴 Additional toiletries');
        if (days >= 7) items.push('🧺 Laundry bag', '🧼 Travel detergent', '🍿 Extra snacks');
      }

      setReport(items.join('\n'));
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="background-wrapper">
      <div className="packing-container">
        <div className="header-section">
          <h1>Adventure Packing List</h1>
          <p className="subtitle">Create your perfect travel checklist</p>
        </div>

        <div className="form-section">
          <div className="input-group">
            <label>Destination</label>
            <select 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)}
              className={destination ? 'has-value' : ''}
            >
              <option value="">Where are you going?</option>
              <option value="Beach">🏖️ Beach</option>
              <option value="Mountain">⛰️ Mountain</option>
              <option value="City">🏙️ City</option>
            </select>
          </div>

          <div className="input-group" style={{width: '95%'}}>
            <label>Duration (days)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow numbers between 1 and 100
                if (value === '' || (Number(value) > 0 && Number(value) <= 100)) {
                  setDuration(value);
                }
              }}
              onKeyDown={(e) => {
                // Prevent minus sign, 'e' (exponent), and decimal point
                if (['-', 'e', '.'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="How many days?"
              className={duration ? 'has-value' : ''}
              min="1"
              max="100"
            />
          </div>

          <div className="input-group">
            <label>Weather</label>
            <select 
              value={weather} 
              onChange={(e) => setWeather(e.target.value)}
              className={weather ? 'has-value' : ''}
            >
              <option value="">What's the forecast?</option>
              <option value="Hot">☀️ Hot</option>
              <option value="Cold">❄️ Cold</option>
              <option value="Rainy">🌧️ Rainy</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            onClick={generateReport} 
            className={`generate-btn ${isGenerating ? 'generating' : ''}`}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                <span>Creating Your List...</span>
              </>
            ) : (
              'Generate Packing List'
            )}
          </button>
        </div>

        {report && (
          <div className="report-box">
            <h2>Packing List:</h2>
            <ul className="beautiful-list">
              {report.split('\n').map((item, index) => (
                <li key={index}>
                  <span className="bullet">•</span>
                  <span className="item-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackingReportGenerator;