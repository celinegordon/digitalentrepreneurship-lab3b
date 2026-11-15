import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ name, email, onLogout }) {
  // ==========================================
  // MESSAGE BOARD STATE (Part 3)
  // ==========================================
  const [messages, setMessages] = useState([]); // the list shown under the box
  const [newMessage, setNewMessage] = useState(''); // what the user is typing
  const [boardMessage, setBoardMessage] = useState(''); // error/status text

  // Ask the server for the 20 newest messages
  const loadMessages = async () => {
    try {
      const response = await axios.get('/messages');
      setMessages(response.data.messages || []);
    } catch (error) {
      setBoardMessage('Could not load messages: ' + (error.response?.data?.message || error.message));
    }
  };

  // Load the messages once, when the dashboard first appears
  useEffect(() => {
    loadMessages();
  }, []);

  // Send the new message, then reload the list so it shows up
  const handlePost = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      setBoardMessage('Message cannot be empty.');
      return;
    }

    try {
      // The logged-in user's name (passed in from App.js) is the author
      await axios.post('/messages', { name, text: newMessage });
      setNewMessage('');
      setBoardMessage('');
      loadMessages();
    } catch (error) {
      setBoardMessage('Error posting message: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="dashboard">
      <h2>Welcome to Your Dashboard</h2>
      <div className="user-greeting">
        <h3>Hello, {name}! </h3>
        <p>You've successfully logged in with: {email}</p>
      </div>

      {/* ========== MESSAGE BOARD ========== */}
      <div className="message-board">
        <h3>Message Board</h3>
        <form onSubmit={handlePost}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message..."
          />
          <button type="submit">Post</button>
        </form>

        {boardMessage && <p className="board-status">{boardMessage}</p>}

        <ul className="message-list">
          {messages.length === 0 && <li className="empty">No messages yet. Be the first!</li>}
          {messages.map((msg) => (
            <li key={msg.id}>
              <div className="message-meta">
                <strong>{msg.name}</strong>
                <span>{new Date(msg.created_at).toLocaleString()}</span>
              </div>
              <p>{msg.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <button className="logout-btn" onClick={onLogout}>
        Log Out
      </button>
    </div>
  );
}

export default Dashboard;
