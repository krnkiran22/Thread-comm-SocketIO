import React from 'react';

const MessageItem = ({ message, isOwn }) => (
  <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
    <div className={`px-3 py-2 rounded-lg max-w-xs ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
      <div className="text-xs font-semibold">{message.sender.role}</div>
      <div>{message.content}</div>
      <div className="text-xs text-gray-400">{new Date(message.timestamp).toLocaleTimeString()}</div>
    </div>
  </div>
);

export default MessageItem; 