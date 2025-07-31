import React, { useState, useEffect } from 'react';
import { Plus, Users, BarChart3, MessageSquare, X, LogOut } from 'lucide-react';
import CreatePoll from './CreatePoll';
import PollResults from './PollResults';
import StudentList from './StudentList';
import Chat from './Chat';

const TeacherDashboard = ({ socket, userData, onReturnHome }) => {
  const [activePoll, setActivePoll] = useState(null);
  const [pollResults, setPollResults] = useState(null);
  const [students, setStudents] = useState([]);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new answers
    socket.on('answer-received', (data) => {
      console.log('Answer received:', data);
    });

    // Listen for poll end
    socket.on('poll-ended', (data) => {
      setActivePoll(null);
      setPollResults(data.results);
    });

    // Listen for student joins
    socket.on('student-joined', (student) => {
      setStudents(prev => [...prev, student]);
    });

    // Listen for student leaves
    socket.on('student-left', (data) => {
      setStudents(prev => prev.filter(s => s.studentName !== data.studentName));
    });

    // Listen for student removal
    socket.on('student-removed', (data) => {
      setStudents(prev => prev.filter(s => s.studentId !== data.studentId));
    });

    // Listen for new messages
    socket.on('new-message', (message) => {
      console.log('New message received:', message);
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('answer-received');
      socket.off('poll-ended');
      socket.off('student-joined');
      socket.off('student-left');
      socket.off('student-removed');
      socket.off('new-message');
    };
  }, [socket]);

  const createPoll = (pollData) => {
    socket.emit('create-poll', pollData);
    setActivePoll({
      id: Date.now(),
      question: pollData.question,
      options: pollData.options,
      timeLimit: pollData.timeLimit,
      startTime: Date.now()
    });
    setShowCreatePoll(false);
    setPollResults(null);
  };

  const removeStudent = (studentId) => {
    socket.emit('remove-student', studentId);
  };

  const sendMessage = (message) => {
    console.log('Sending message:', message);
    socket.emit('send-message', message);
  };

  const canCreatePoll = !activePoll || !activePoll.isActive;

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="logo">Live Polling System</div>
          <div className="user-info">
            Teacher Dashboard
            <button 
              className="btn btn-exit" 
              onClick={onReturnHome}
              title="Exit to Home"
            >
              <LogOut size={16} />
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="dashboard-header">
            <h2>Teacher Dashboard</h2>
            <div className="dashboard-actions">
              <button 
                className="btn" 
                onClick={() => setShowCreatePoll(true)}
                disabled={!canCreatePoll}
              >
                <Plus size={20} />
                Create New Poll
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowChat(!showChat)}
              >
                <MessageSquare size={20} />
                Chat
              </button>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header">
                <h3><Users size={20} /> Connected Students ({students.length})</h3>
              </div>
              <StudentList students={students} onRemoveStudent={removeStudent} />
            </div>

            <div className="card">
              <div className="card-header">
                <h3><BarChart3 size={20} /> Current Poll</h3>
              </div>
              {activePoll ? (
                <div className="active-poll">
                  <h4>{activePoll.question}</h4>
                  <p>Time limit: {activePoll.timeLimit} seconds</p>
                  <p>Started: {new Date(activePoll.startTime).toLocaleTimeString()}</p>
                </div>
              ) : (
                <p>No active poll. Create a new poll to get started.</p>
              )}
            </div>
          </div>

          {pollResults && (
            <div className="card">
              <div className="card-header">
                <h3>Poll Results</h3>
              </div>
              <PollResults results={pollResults} />
            </div>
          )}
        </div>
      </main>

      {showCreatePoll && (
        <div className="modal-overlay" onClick={() => setShowCreatePoll(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Poll</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowCreatePoll(false)}
              >
                <X size={20} />
              </button>
            </div>
            <CreatePoll onCreatePoll={createPoll} onCancel={() => setShowCreatePoll(false)} />
          </div>
        </div>
      )}

      {showChat && (
        <Chat 
          messages={messages} 
          onSendMessage={sendMessage} 
          onClose={() => setShowChat(false)}
          userType="teacher"
        />
      )}
    </div>
  );
};

export default TeacherDashboard; 