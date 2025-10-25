import React, { useState, useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';
import { data } from 'react-router-dom';
import { io } from "socket.io-client";


const LiveChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const chatRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
       console.log(socket.id);
       setLoading(false);
    })
    socket.on("lm-messages", (data) => {
      setMessages(data);
      setLoading(false);
    });
    socket.emit("lm-messages");
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const message = {
      id: messages.length + 1,
      user: 'Vany', // In a real app, this would be the current user
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: '#3B82F6', // Blue for current user
    };
    socket.emit("message-chat", message);
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0f11] text-white flex flex-col">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="p-4 border-b border-[#2a2b2f]">
          <h1 className="text-2xl font-semibold">Live Chat</h1>
          <p className="text-gray-400 text-sm">Join the conversation</p>
        </div>

        {/* Chat Messages */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto p-4 space-y-2"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading chat messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-400">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: msg.color }}
                >
                  {msg.user}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium" style={{ color: msg.color }}>
                      {msg.user}
                    </span>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>
                  <p className="text-gray-200 break-words">{msg.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-[#2a2b2f] bg-[#1a1b1e]">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Say something..."
              className="flex-1 px-3 py-2 bg-[#2a2b2f] border border-[#3a3b3e] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 text-sm transition-colors"
            >
              <FiSend className="w-4 h-4" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;