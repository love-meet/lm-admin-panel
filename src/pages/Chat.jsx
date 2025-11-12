import React from 'react';
import ChatInterface from '../components/ChatInterface';

const Chat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-purple-300 text-[var(--color-text-primary)]">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Chat</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">Connect with other users</p>
        </div>
        <div className="bg-gray-800 hover:shadow-lg rounded-lg shadow-lg p-6">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Chat;