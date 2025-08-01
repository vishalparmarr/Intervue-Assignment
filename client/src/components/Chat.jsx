import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, Users } from 'lucide-react';

const Chat = ({ messages, onSendMessage, onClose, userType, userName, students, onKickStudent }) => {
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      console.log('Chat: Submitting message:', newMessage.trim());
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-tabs">
          <button 
            className={`chat-tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={16} />
            Chat
          </button>
          <button 
            className={`chat-tab ${activeTab === 'participants' ? 'active' : ''}`}
            onClick={() => setActiveTab('participants')}
          >
            <Users size={16} />
            Participants
          </button>
        </div>
        <button className="chat-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {activeTab === 'chat' ? (
        <>
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.sender === (userType === 'teacher' ? 'Teacher' : userName) 
                      ? 'sent' 
                      : 'received'
                  }`}
                >
                  <div className="message-content">
                    <div className="message-sender">{message.sender}</div>
                    <div className="message-text">{message.message}</div>
                    <div className="message-time">{formatTime(message.timestamp)}</div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" disabled={!newMessage.trim()}>
              <Send size={16} />
            </button>
          </form>
        </>
      ) : (
        <div className="participants-list">
          <div className="participants-header">
            <h3>Participants</h3>
            <span className="participant-count">{students?.length || 0} participants</span>
          </div>
          <div className="participants-content">
            {/* Debug info */}
            {console.log('Chat component - students prop:', students)}
            {console.log('Chat component - userType:', userType)}
            
            {students && students.length > 0 ? (
              <div className="participants-table">
                <div className="table-header">
                  <span>Name</span>
                  {userType === 'teacher' && <span>Action</span>}
                </div>
                {students.map((student) => (
                  <div key={student.studentId || student.name} className="participant-row">
                    <span className="participant-name">{student.studentName || student.name}</span>
                    {userType === 'teacher' && onKickStudent && (
                      <button 
                        className="kick-btn"
                        onClick={() => onKickStudent(student.studentId || student.name)}
                      >
                        Kick out
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-participants">
                <p>No participants yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat; 