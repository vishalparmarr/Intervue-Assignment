import React, { useState, useEffect } from 'react';
import { Clock, Users, BarChart3, Calendar, X } from 'lucide-react';
import PollResults from './PollResults';

const PastPolls = ({ onClose, socket }) => {
  const [pastPolls, setPastPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastPolls = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // For now, let's check localStorage for any past polls
        // In a real app, this would come from the server
        const storedPolls = localStorage.getItem('pastPolls');
        if (storedPolls) {
          const parsedPolls = JSON.parse(storedPolls);
          setPastPolls(parsedPolls);
        } else {
          // Demo data for testing - remove this in production
          const demoPolls = [
            {
              id: 'demo-1',
              question: 'Which planet is known as the Red Planet?',
              startTime: Date.now() - 3600000, // 1 hour ago
              endTime: Date.now() - 3300000,   // 55 minutes ago
              totalParticipants: 5,
              results: [
                { option: 'Mars', count: 3, percentage: 60 },
                { option: 'Venus', count: 1, percentage: 20 },
                { option: 'Jupiter', count: 1, percentage: 20 },
                { option: 'Saturn', count: 0, percentage: 0 }
              ]
            },
            {
              id: 'demo-2',
              question: 'What is the capital of France?',
              startTime: Date.now() - 7200000, // 2 hours ago
              endTime: Date.now() - 6900000,   // 1 hour 55 minutes ago
              totalParticipants: 8,
              results: [
                { option: 'Paris', count: 6, percentage: 75 },
                { option: 'London', count: 1, percentage: 12.5 },
                { option: 'Berlin', count: 1, percentage: 12.5 },
                { option: 'Madrid', count: 0, percentage: 0 }
              ]
            }
          ];
          setPastPolls(demoPolls);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching past polls:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPastPolls();
  }, []);

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    
    try {
      const storedPolls = localStorage.getItem('pastPolls');
      if (storedPolls) {
        const parsedPolls = JSON.parse(storedPolls);
        setPastPolls(parsedPolls);
      } else {
        setPastPolls([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading past polls:', err);
      setError('Failed to load past polls');
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (startTime, endTime) => {
    const duration = endTime - startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3>Past Poll Results</h3>
            <button className="modal-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <div className="modal-content">
            <p>Loading past polls...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3>Past Poll Results</h3>
            <button className="modal-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <div className="modal-content">
            <p className="error">Error: {error}</p>
            <button className="btn" onClick={retryFetch}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><BarChart3 size={20} /> Past Poll Results</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-content">
          {pastPolls.length === 0 ? (
            <div className="empty-state">
              <BarChart3 size={48} />
              <h4>No Past Polls</h4>
              <p>No polls have been conducted yet. Create and run polls to see results here.</p>
            </div>
          ) : (
            <div className="past-polls-container">
              <div className="past-polls-list">
                <h4>Poll History ({pastPolls.length})</h4>
                {pastPolls.map((poll) => (
                  <div 
                    key={poll.id} 
                    className={`poll-item ${selectedPoll?.id === poll.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPoll(poll)}
                  >
                    <div className="poll-item-header">
                      <h5>{poll.question}</h5>
                      <span className="poll-date">
                        <Calendar size={14} />
                        {formatDate(poll.startTime)}
                      </span>
                    </div>
                    <div className="poll-item-details">
                      <span className="poll-duration">
                        <Clock size={14} />
                        {formatDuration(poll.startTime, poll.endTime)}
                      </span>
                      <span className="poll-participants">
                        <Users size={14} />
                        {poll.totalParticipants} participants
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedPoll && (
                <div className="poll-details">
                  <h4>Poll Details</h4>
                  <div className="poll-info">
                    <p><strong>Question:</strong> {selectedPoll.question}</p>
                    <p><strong>Started:</strong> {formatDate(selectedPoll.startTime)}</p>
                    <p><strong>Duration:</strong> {formatDuration(selectedPoll.startTime, selectedPoll.endTime)}</p>
                    <p><strong>Participants:</strong> {selectedPoll.totalParticipants}</p>
                  </div>
                  <PollResults results={selectedPoll.results} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PastPolls; 