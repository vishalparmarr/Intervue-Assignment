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
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinAsTeacher = () => {
    if (socket) {
      socket.emit('join-as-teacher');
      setUserType('teacher');
      setUserData({ type: 'teacher' });
    }
  };

  const joinAsStudent = (studentName) => {
    if (socket) {
      socket.emit('join-as-student', studentName);
      setUserType('student');
      setUserData({ name: studentName, type: 'student' });
    }
  };

  const returnHome = () => {
    setUserType(null);
    setUserData(null);
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
                <TeacherDashboard socket={socket} userData={userData} />
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