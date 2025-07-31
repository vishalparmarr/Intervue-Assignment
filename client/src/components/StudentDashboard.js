import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, MessageSquare, LogOut } from 'lucide-react';
import PollQuestion from './PollQuestion';
import PollResults from './PollResults';
import Chat from './Chat';
import KickedOut from './KickedOut';

const StudentDashboard = ({ socket, userData, onReturnHome }) => {
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollResults, setPollResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isKickedOut, setIsKickedOut] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Listen for new polls
    socket.on('new-poll', (poll) => {
      setCurrentPoll(poll);
      setPollResults(null);
      setHasAnswered(false);
      setTimeLeft(poll.timeLimit);
    });

    // Listen for poll end
    socket.on('poll-ended', () => {
      setCurrentPoll(null);
      setTimeLeft(0);
    });

    // Listen for poll results
    socket.on('poll-results', (data) => {
      setPollResults(data.results);
      setHasAnswered(true);
    });

    // Listen for new messages
    socket.on('new-message', (message) => {
      console.log('New message received:', message);
      setMessages(prev => [...prev, message]);
    });

    // Listen for student removal
    socket.on('student-removed', (data) => {
      if (data.studentName === userData.name) {
        console.log('Student kicked out:', data.studentName);
        setIsKickedOut(true);
        socket.disconnect();
      }
    });

    return () => {
      socket.off('new-poll');
      socket.off('poll-ended');
      socket.off('poll-results');
      socket.off('new-message');
      socket.off('student-removed');
    };
  }, [socket]);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const submitAnswer = (answer) => {
    if (socket && currentPoll && !hasAnswered) {
      socket.emit('submit-answer', answer);
      setHasAnswered(true);
    }
  };

  const sendMessage = (message) => {
    console.log('Sending message:', message);
    socket.emit('send-message', message);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show kicked out page if student was removed
  if (isKickedOut) {
    return <KickedOut onReturnHome={onReturnHome} />;
  }

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="logo">Live Polling System</div>
          <div className="user-info">
            Student: {userData.name}
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
            <h2>Student Dashboard</h2>
            <div className="dashboard-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowChat(!showChat)}
              >
                <MessageSquare size={20} />
                Chat
              </button>
            </div>
          </div>

          {currentPoll && (
            <div className="card">
              <div className="card-header">
                <h3>Current Question</h3>
                {timeLeft > 0 && (
                  <div className="timer">
                    <Clock size={20} />
                    Time remaining: {formatTime(timeLeft)}
                  </div>
                )}
              </div>
              <PollQuestion 
                poll={currentPoll} 
                onSubmit={submitAnswer}
                hasAnswered={hasAnswered}
                timeLeft={timeLeft}
              />
            </div>
          )}

          {pollResults && (
            <div className="card">
              <div className="card-header">
                <h3>Poll Results</h3>
                {hasAnswered && (
                  <div className="answered-indicator">
                    <CheckCircle size={20} />
                    You have answered
                  </div>
                )}
              </div>
              <PollResults results={pollResults} />
            </div>
          )}

          {!currentPoll && !pollResults && (
            <div className="card">
              <div className="waiting-message">
                <h3>Waiting for a question...</h3>
                <p>The teacher will create a poll soon. Stay tuned!</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {showChat && (
        <Chat 
          messages={messages} 
          onSendMessage={sendMessage} 
          onClose={() => setShowChat(false)}
          userType="student"
          userName={userData.name}
        />
      )}
    </div>
  );
};

export default StudentDashboard; 