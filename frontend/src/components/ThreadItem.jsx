import React from 'react';

const ThreadItem = ({ thread, onClick, selected }) => (
  <div
    className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${selected ? 'bg-blue-100' : ''}`}
    onClick={onClick}
  >
    <div className="font-semibold">{thread.metadata?.title || 'Untitled'}</div>
    <div className="text-xs text-gray-500">{thread.lastMessage?.content || 'No messages yet'}</div>
    <div className="text-xs text-gray-400">{thread.updatedAt && new Date(thread.updatedAt).toLocaleString()}</div>
  </div>
);

export default ThreadItem; 