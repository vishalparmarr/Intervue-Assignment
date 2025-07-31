const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://intervue-assignment-coral.vercel.app"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store active polls and users
const polls = new Map();
const users = new Map();
const activePoll = {
  id: null,
  question: '',
  options: [],
  timeLimit: 60,
  startTime: null,
  answers: new Map(),
  isActive: false
};

// Socket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join teacher room
  socket.on('join-as-teacher', () => {
    socket.join('teacher');
    socket.emit('teacher-joined');
    console.log('Teacher joined');
  });

  // Join student room
  socket.on('join-as-student', (studentName) => {
    const studentId = uuidv4();
    users.set(socket.id, {
      id: studentId,
      name: studentName,
      type: 'student'
    });
    socket.join('students');
    socket.emit('student-joined', { studentId, studentName });
    io.to('teacher').emit('student-joined', { studentId, studentName });
    console.log(`Student joined: ${studentName}`);
  });

  // Create new poll
  socket.on('create-poll', (pollData) => {
    const pollId = uuidv4();
    activePoll.id = pollId;
    activePoll.question = pollData.question;
    activePoll.options = pollData.options;
    activePoll.timeLimit = pollData.timeLimit || 60;
    activePoll.startTime = Date.now();
    activePoll.answers.clear();
    activePoll.isActive = true;

    // Send poll to all students
    io.to('students').emit('new-poll', {
      id: pollId,
      question: pollData.question,
      options: pollData.options,
      timeLimit: activePoll.timeLimit
    });

    // Start timer
    setTimeout(() => {
      if (activePoll.isActive) {
        activePoll.isActive = false;
        io.to('students').emit('poll-ended');
        io.to('teacher').emit('poll-ended', {
          results: getPollResults()
        });
      }
    }, activePoll.timeLimit * 1000);

    console.log('New poll created:', pollData.question);
  });

  // Submit answer
  socket.on('submit-answer', (answer) => {
    const user = users.get(socket.id);
    if (user && activePoll.isActive) {
      activePoll.answers.set(user.id, {
        studentName: user.name,
        answer: answer
      });

      // Notify teacher of new answer
      io.to('teacher').emit('answer-received', {
        studentName: user.name,
        answer: answer,
        totalAnswers: activePoll.answers.size
      });

      // Send results to student
      socket.emit('poll-results', {
        results: getPollResults(),
        yourAnswer: answer
      });

      console.log(`Answer received from ${user.name}: ${answer}`);
    }
  });

  // Get current poll results
  socket.on('get-results', () => {
    socket.emit('poll-results', {
      results: getPollResults()
    });
  });

  // Remove student (teacher only)
  socket.on('remove-student', (studentId) => {
    const userToRemove = Array.from(users.entries()).find(([_, user]) => user.id === studentId);
    if (userToRemove) {
      const [socketId, user] = userToRemove;
      users.delete(socketId);
      
      // Send removal notification to the specific student
      io.to(socketId).emit('student-removed', { studentId, studentName: user.name });
      
      // Notify teacher
      io.to('teacher').emit('student-removed', { studentId, studentName: user.name });
      
      // Disconnect the student after a short delay to ensure they receive the message
      setTimeout(() => {
        io.sockets.sockets.get(socketId)?.disconnect();
      }, 100);
      
      console.log(`Student removed: ${user.name}`);
    }
  });

  // Chat functionality
  socket.on('send-message', (message) => {
    const user = users.get(socket.id);
    const messageData = {
      id: uuidv4(),
      sender: user ? user.name : 'Teacher',
      message: message,
      timestamp: new Date().toISOString()
    };
    
    console.log('Chat message sent:', messageData);
    io.emit('new-message', messageData);
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      io.to('teacher').emit('student-left', { studentName: user.name });
      console.log(`Student disconnected: ${user.name}`);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Helper function to get poll results
function getPollResults() {
  const results = {};
  activePoll.options.forEach(option => {
    results[option] = 0;
  });

  activePoll.answers.forEach(answer => {
    if (results[answer.answer] !== undefined) {
      results[answer.answer]++;
    }
  });

  return {
    question: activePoll.question,
    options: activePoll.options,
    results: results,
    totalAnswers: activePoll.answers.size,
    answers: Array.from(activePoll.answers.values())
  };
}

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'Server is running',
    activePoll: activePoll.isActive,
    connectedUsers: users.size
  });
});

app.get('/api/current-poll', (req, res) => {
  if (activePoll.isActive) {
    res.json({
      id: activePoll.id,
      question: activePoll.question,
      options: activePoll.options,
      timeLimit: activePoll.timeLimit,
      startTime: activePoll.startTime
    });
  } else {
    res.json({ isActive: false });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 