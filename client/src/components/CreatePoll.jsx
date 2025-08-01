import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const CreatePoll = ({ onCreatePoll, onCancel }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    const validOptions = options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please enter at least 2 options');
      return;
    }

    onCreatePoll({
      question: question.trim(),
      options: validOptions,
      timeLimit: parseInt(timeLimit)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Question</label>
        <input
          type="text"
          className="input"
          placeholder="Enter your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Options</label>
        {options.map((option, index) => (
          <div key={index} className="option-input-group">
            <input
              type="text"
              className="input"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              required
            />
            {options.length > 2 && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeOption(index)}
                style={{ marginLeft: '10px', padding: '8px 12px' }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={addOption}
          style={{ marginTop: '10px' }}
        >
          <Plus size={16} />
          Add Option
        </button>
      </div>

      <div className="form-group">
        <label className="form-label">Time Limit (seconds)</label>
        <select
          className="input"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
        >
          <option value={30}>30 seconds</option>
          <option value={60}>60 seconds</option>
          <option value={90}>90 seconds</option>
          <option value={120}>2 minutes</option>
          <option value={300}>5 minutes</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn">
          Create Poll
        </button>
      </div>
    </form>
  );
};

export default CreatePoll; 