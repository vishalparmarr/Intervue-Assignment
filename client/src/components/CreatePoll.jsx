import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const CreatePoll = ({ onCreatePoll, onCancel }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);
  const [correctAnswers, setCorrectAnswers] = useState([true, false]);

  const addOption = () => {
    setOptions([...options, '']);
    setCorrectAnswers([...correctAnswers, false]);
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const updateCorrectAnswer = (index, isCorrect) => {
    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers[index] = isCorrect;
    setCorrectAnswers(newCorrectAnswers);
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
      timeLimit: parseInt(timeLimit),
      correctAnswers: correctAnswers
    });
  };

  const handleQuestionChange = (e) => {
    if (e.target.value.length <= 100) {
      setQuestion(e.target.value);
    }
  };

  return (
    <div className="poll-question">
      {/* Intervue Poll Badge */}
      <div className="continue-section items-start">
        <div className="intervue-badge continue-btn items-start place-content-start">
          <img src="/assets/image.png" alt="Intervue Logo" height={10} width={20} />
          <span className='text-sm'>Intervue Poll</span>
        </div>
      </div>

        <h1 className='text-black text-start text-2xl font-bold'>Let's Get Started</h1>
        <p className='text-start text-base'>You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.</p>


      <form onSubmit={handleSubmit} className="poll-creation-form">
        <div className="form-group">
          <div className="question-header">
            <p className='text-start font-bold'>Enter your question</p>
            <div className="time-selector text-end font-bold">
              <select 
                className="time-dropdown bg-[#b4b4b4] "
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
              >
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={90}>90 seconds</option>
                <option value={120}>120 seconds</option>
                <option value={300}>5 minutes</option>
              </select>
            </div>
          </div>
          <div className="question-input-container">
            <textarea
              id="question"
              className="question-input bg-[#b4b4b4] size-50 w-full rounded-md"
              placeholder="Rahul Bajaj"
              value={question}
              onChange={handleQuestionChange}
              maxLength={100}
              required
            />
            <div className="character-counter">{question.length}/100</div>
          </div>
        </div>

        <div className="options-section">
          <div className="options-header">
            <h3 className='flex'>Edit Options</h3>
            <h3>Is it Correct?</h3>
          </div>
          
          {options.map((option, index) => (
            <div key={index} className="option-row">
              <div className="option-input-group">
                <span className="option-number">{index + 1}</span>
                <input
                  type="text"
                  className="option-input bg-[#b4b4b4] rounded-md font-bold h-8 text-black"
                  placeholder="Rahul Bajaj"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  required
                />
              </div>
              
              <div className="correct-answer-group ">
                <label className="radio-option">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={correctAnswers[index] === true}
                    onChange={() => updateCorrectAnswer(index, true)}
                  />
                  <span className="radio-text">Yes</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={correctAnswers[index] === false}
                    onChange={() => updateCorrectAnswer(index, false)}
                  />
                  <span className="radio-text">No</span>
                </label>
              </div>
            </div>
          ))}
          
          {options.length < 6 && (
            <button type="button" className="add-option-btn flex border-1 rounded-xl border-purple-400 text-purple-400 w-45" onClick={addOption}>
              <Plus size={22} />
              Add More option
            </button>
          )}
        </div>

        <div className="continue-section flex justify-end">
          <button type="submit" className="btn continue-btn ">
            Ask Question
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePoll; 