import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import Welcome from './components/Welcome';
import './App.css';

const SOCKET_URL = 'https://intervue-assignment-c5gd.onrender.com';

function App() {
  const [socket, setSocket] = useState(null);
  const [userType, setUserType] = useState(() => {
    // Load user state from localStorage on initial render
    const savedUserType = localStorage.getItem('userType');
    return savedUserType || null;
  });
  const [userData, setUserData] = useState(() => {
    // Load user data from localStorage on initial render
    const savedUserData = localStorage.getItem('userData');
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // If user was previously logged in, reconnect them
    if (userType && userData) {
      if (userType === 'teacher') {
        newSocket.emit('join-as-teacher');
      } else if (userType === 'student' && userData.name) {
        newSocket.emit('join-as-student', userData.name);
      }
    }

    return () => {
      newSocket.close();
    };
  }, [userType, userData]);

  const joinAsTeacher = () => {
    if (socket) {
      socket.emit('join-as-teacher');
      setUserType('teacher');
      setUserData({ type: 'teacher' });
      // Save to localStorage
      localStorage.setItem('userType', 'teacher');
      localStorage.setItem('userData', JSON.stringify({ type: 'teacher' }));
    }
  };

  const joinAsStudent = (studentName) => {
    if (socket) {
      socket.emit('join-as-student', studentName);
      setUserType('student');
      setUserData({ name: studentName, type: 'student' });
      // Save to localStorage
      localStorage.setItem('userType', 'student');
      localStorage.setItem('userData', JSON.stringify({ name: studentName, type: 'student' }));
    }
  };

  const returnHome = () => {
    setUserType(null);
    setUserData(null);
    // Clear localStorage
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    if (socket) {
      socket.disconnect();
    }
  };

  if (!socket) {
    return <div className="loading">Connecting to server...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              userType ? (
                <Navigate to={`/${userType}`} replace />
              ) : (
                <Welcome onJoinAsTeacher={joinAsTeacher} onJoinAsStudent={joinAsStudent} />
              )
            } 
          />
          <Route 
            path="/teacher" 
            element={
              userType === 'teacher' ? (
                <TeacherDashboard socket={socket} userData={userData} onReturnHome={returnHome} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/student" 
            element={
              userType === 'student' ? (
                <StudentDashboard socket={socket} userData={userData} onReturnHome={returnHome} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 