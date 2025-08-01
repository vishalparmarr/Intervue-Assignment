import React from 'react';
import { Home, Star } from 'lucide-react';

const KickedOut = ({ onReturnHome }) => {
  return (
    <div className="App">
      <div className="kicked-out-container">
        <div className="kicked-out-card">
          {/* Intervue Poll Badge */}
          <div className="continue-section">
            <div className="intervue-badge continue-btn">
              <Star size={16} />
              <span className='text-sm'>Intervue Poll</span>
            </div>
          </div>
          
          <div className="welcome-header">
            <h1 className='text-black'>You've been Kicked out !</h1>
            <p>Looks like the teacher had removed you from the poll system. Please try again sometime.</p>
          </div>
          
          <div className="continue-section">
            <button className="btn continue-btn" onClick={onReturnHome}>
              <Home size={20} />
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KickedOut; 