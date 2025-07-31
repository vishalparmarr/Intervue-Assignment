import React from 'react';
import { BarChart3, Users } from 'lucide-react';

const PollResults = ({ results }) => {
  const { question, options, results: voteResults, totalAnswers, answers } = results;

  const getPercentage = (votes) => {
    if (totalAnswers === 0) return 0;
    return Math.round((votes / totalAnswers) * 100);
  };

  const getMaxVotes = () => {
    return Math.max(...Object.values(voteResults));
  };

  const maxVotes = getMaxVotes();

  return (
    <div className="poll-results">
      <div className="results-header">
        <h4>{question}</h4>
        <div className="results-stats">
          <span>
            <Users size={16} />
            Total votes: {totalAnswers}
          </span>
        </div>
      </div>

      <div className="results-container">
        {options.map((option, index) => {
          const votes = voteResults[option] || 0;
          const percentage = getPercentage(votes);
          const isWinning = votes === maxVotes && votes > 0;
          
          return (
            <div key={index} className="result-item">
              <div className="result-label">
                <span className="option-text">{option}</span>
                <span className="vote-count">
                  {votes} vote{votes !== 1 ? 's' : ''} ({percentage}%)
                </span>
              </div>
              <div className="result-bar">
                <div 
                  className={`result-fill ${isWinning ? 'winning' : ''}`}
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 10 ? `${percentage}%` : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {answers && answers.length > 0 && (
        <div className="individual-answers">
          <h5>Individual Answers</h5>
          <div className="answers-list">
            {answers.map((answer, index) => (
              <div key={index} className="answer-item">
                <span className="student-name">{answer.studentName}</span>
                <span className="student-answer">{answer.answer}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PollResults; 