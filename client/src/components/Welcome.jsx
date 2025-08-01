import React, { useState } from 'react';
import { MessageSquare, Users, Star } from 'lucide-react';

const Welcome = ({ onJoinAsTeacher, onJoinAsStudent }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [showStudentForm, setShowStudentForm] = useState(false);

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (studentName.trim()) {
      onJoinAsStudent(studentName.trim());
    }
  };

  const handleContinue = () => {
    if (selectedRole === 'teacher') {
      onJoinAsTeacher();
    } else if (selectedRole === 'student') {
      setShowStudentForm(true);
    }
  };

  return (
    <div className="container">
      {/* Intervue Poll Badge */}
      <div className="continue-section">
        <div className="intervue-badge continue-btn">
          <img src="/assets/image.png" alt="Intervue Logo" height={10} width={20} />
          <span className='text-sm'>Intervue Poll</span>
        </div>
      </div>

      <div className="welcome-header">
        <h1>Welcome to the Live Polling System</h1>
        <p>Please select the role that best describes you to begin using the live polling system.</p>
      </div>

      <div className="role-selection">
        <div 
          className={`role-card ${selectedRole === 'student' ? 'selected' : ''}`}
          onClick={() => setSelectedRole('student')}
        >
          <h3>I'm a Student</h3>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        </div>

        <div 
          className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
          onClick={() => setSelectedRole('teacher')}
        >
          <h3>I'm a Teacher</h3>
          <p>Submit answers and view live poll results in real-time.</p>
        </div>
      </div>

      <div className="continue-section">
        <button 
          className="btn continue-btn" 
          onClick={handleContinue}
          disabled={!selectedRole}
        >
          Continue
        </button>
      </div>

      {showStudentForm && (
        <div className="modal-overlay" onClick={() => setShowStudentForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Enter Your Name</h3>
            <form onSubmit={handleStudentSubmit}>
              <input
                type="text"
                className="input"
                placeholder="Enter your name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                autoFocus
                required
              />
              <div className="modal-buttons">
                <button type="button" className="btn btn-secondary" onClick={() => setShowStudentForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Join as Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome; 