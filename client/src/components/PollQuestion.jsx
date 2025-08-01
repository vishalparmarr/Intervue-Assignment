import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const PollQuestion = ({ poll, onSubmit, hasAnswered, timeLeft }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionSelect = (option) => {
    if (!hasAnswered && timeLeft > 0) {
      setSelectedOption(option);
    }
  };

  const handleSubmit = () => {
    if (selectedOption && !hasAnswered && timeLeft > 0) {
      onSubmit(selectedOption);
    }
  };

  const isTimeUp = timeLeft <= 0;

  return (
    <div className="poll-question">
      <h3 className="question-text">{poll.question}</h3>
      
      <div className="options-container">
        {poll.options.map((option, index) => (
          <div
            key={index}
            className={`poll-option ${selectedOption === option ? 'selected' : ''} ${
              hasAnswered || isTimeUp ? 'disabled' : ''
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            <input
              type="radio"
              name="poll-option"
              value={option}
              checked={selectedOption === option}
              onChange={() => handleOptionSelect(option)}
              disabled={hasAnswered || isTimeUp}
            />
            <span className="option-text">{option}</span>
            {selectedOption === option && (
              <CheckCircle size={20} className="check-icon" />
            )}
          </div>
        ))}
      </div>

      <div className="poll-actions">
        {!hasAnswered && !isTimeUp && (
          <button
            className="btn"
            onClick={handleSubmit}
            disabled={!selectedOption}
          >
            Submit Answer
          </button>
        )}
        
        {hasAnswered && (
          <div className="answered-message">
            <CheckCircle size={20} />
            Answer submitted successfully!
          </div>
        )}
        
        {isTimeUp && !hasAnswered && (
          <div className="time-up-message">
            Time's up! You can no longer submit an answer.
          </div>
        )}
      </div>
    </div>
  );
};

export default PollQuestion; 