import React, { useState } from 'react';
import { MessageSquare, Users } from 'lucide-react';

const Welcome = ({ onJoinAsTeacher, onJoinAsStudent }) => {
  const [studentName, setStudentName] = useState('');
  const [showStudentForm, setShowStudentForm] = useState(false);

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (studentName.trim()) {
      onJoinAsStudent(studentName.trim());
    }
  };

  return (
    <div className="container">
      <div className="welcome-header">
        <h1>Live Polling System</h1>
        <p>Choose your role to get started</p>
      </div>

      <div className="role-selection">
        <div className="role-card" onClick={onJoinAsTeacher}>
          <div className="role-icon">
            <MessageSquare size={48} />
          </div>
          <h3>Join as Teacher</h3>
          <p>Create polls and view live results</p>
          <ul>
            <li>Create new polls</li>
            <li>View live results</li>
            <li>Manage students</li>
            <li>Chat with students</li>
          </ul>
        </div>

        <div className="role-card" onClick={() => setShowStudentForm(true)}>
          <div className="role-icon">
            <Users size={48} />
          </div>
          <h3>Join as Student</h3>
          <p>Answer polls and see results</p>
          <ul>
            <li>Answer questions</li>
            <li>View live results</li>
            <li>60-second time limit</li>
            <li>Chat with teacher</li>
          </ul>
        </div>
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