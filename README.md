# Live Polling System

A real-time polling system built with React, Express.js, and Socket.io for interactive classroom engagement between teachers and students.

## Features

### Teacher Features
- ✅ Create new polls with custom questions and options
- ✅ View live polling results in real-time
- ✅ Configurable poll time limits (30s to 5 minutes)
- ✅ Manage connected students (view and remove)
- ✅ Real-time chat with students
- ✅ Only create new polls when no active poll exists or all students have answered

### Student Features
- ✅ Enter unique name on first visit
- ✅ Submit answers to active polls
- ✅ View live results after submission
- ✅ 60-second default time limit (configurable by teacher)
- ✅ Real-time chat with teacher
- ✅ Automatic results display when time expires

### Technical Features
- ✅ Real-time communication using Socket.io
- ✅ Modern, responsive UI design
- ✅ Mobile-friendly interface
- ✅ Real-time updates without page refresh
- ✅ Secure user management
- ✅ Cross-platform compatibility

## Technology Stack

- **Frontend**: React 18, Socket.io-client, Lucide React icons
- **Backend**: Express.js, Socket.io, Node.js
- **Styling**: CSS3 with modern design patterns
- **Real-time Communication**: Socket.io

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd live-polling-system
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 3000).

## Live Demo

- **Frontend**: [https://intervue-assignment-coral.vercel.app/](https://intervue-assignment-coral.vercel.app/)
- **Backend**: [https://intervue-assignment-c5gd.onrender.com/](https://intervue-assignment-c5gd.onrender.com/)

### Manual Setup

If you prefer to set up manually:

1. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

4. **Start the frontend server (in a new terminal)**
   ```bash
   cd client
   npm start
   ```

## Usage

### For Teachers

1. Open the application in your browser
2. Click "Join as Teacher"
3. Use the "Create New Poll" button to create polls
4. View live results as students answer
5. Use the chat feature to communicate with students
6. Remove students if needed using the student list

### For Students

1. Open the application in your browser
2. Click "Join as Student"
3. Enter your name (unique per browser tab)
4. Wait for the teacher to create a poll
5. Answer questions within the time limit
6. View results after submission
7. Use the chat feature to communicate with the teacher

## Project Structure

```
live-polling-system/
├── server/                 # Backend Express.js server
│   ├── index.js           # Main server file with Socket.io
│   └── package.json       # Server dependencies
├── client/                # React frontend
│   ├── public/            # Static files
│   ├── src/               # React source code
│   │   ├── components/    # React components
│   │   ├── App.js         # Main App component
│   │   └── index.js       # React entry point
│   └── package.json       # Client dependencies
├── package.json           # Root package.json with scripts
└── README.md             # This file
```

## API Endpoints

- `GET /api/status` - Server status
- `GET /api/current-poll` - Get current active poll

## Socket Events

### Client to Server
- `join-as-teacher` - Join as teacher
- `join-as-student` - Join as student with name
- `create-poll` - Create new poll
- `submit-answer` - Submit poll answer
- `get-results` - Get current poll results
- `remove-student` - Remove student (teacher only)
- `send-message` - Send chat message

### Server to Client
- `teacher-joined` - Teacher joined confirmation
- `student-joined` - Student joined notification
- `new-poll` - New poll created
- `poll-ended` - Poll time expired
- `poll-results` - Poll results update
- `answer-received` - New answer received (teacher)
- `student-left` - Student disconnected
- `student-removed` - Student removed
- `new-message` - New chat message

## Deployment

### Backend Deployment
The backend can be deployed to platforms like:
- Heroku
- Railway
- Render
- DigitalOcean

### Frontend Deployment
The frontend can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

### Environment Variables
For production, set the following environment variables:
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (production/development)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

**Note**: This is a demo application. For production use, consider adding authentication, database persistence, and additional security measures. 