import React from 'react';
import { AlertTriangle, Home } from 'lucide-react';

const KickedOut = ({ onReturnHome }) => {
  return (
    <div className="App">
      <div className="kicked-out-container">
        <div className="kicked-out-card">
          <div className="kicked-out-icon">
            <AlertTriangle size={64} />
          </div>
          <h1>You have been removed</h1>
          <p>The teacher has removed you from the session.</p>
          <div className="kicked-out-actions">
            <button className="btn" onClick={onReturnHome}>
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