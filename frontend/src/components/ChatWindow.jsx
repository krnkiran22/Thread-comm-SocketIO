import React, { useRef, useEffect, useState } from 'react';

const getAvatar = (role) => {
  if (role === 'Admin') return '🛡️';
  if (role === 'Investor') return '💼';
  if (role === 'Issuer') return '🏢';
  return '👤';
};

const ChatWindow = ({ messages, onSendMessage, user, thread, input, setInput, canSend, closeThread }) => {
  const bottomRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper to determine if a message is from the current user
  const isOwn = (msg) => msg.sender._id === user.id || msg.sender === user.id;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-blue-50 flex-1 rounded-lg shadow-lg">
      <div className="p-4 border-b bg-white flex items-center justify-between rounded-t-lg relative shadow-sm">
        <div>
          <h2 className="font-bold text-lg text-blue-800 flex items-center gap-2">
            <span className="text-2xl">💬</span>
            {thread?.metadata?.title || 'Select a thread'}
          </h2>
          {thread?.status && <span className={`ml-2 px-2 py-1 rounded text-xs ${thread.status === 'closed' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{thread.status}</span>}
          {user?.role !== 'Admin' && thread && (
            <div className="text-xs text-blue-700 mt-1">You are chatting with the Admin.</div>
          )}
        </div>
        {/* 3-dots menu for admin to close thread */}
        {user?.role === 'Admin' && thread && thread.status !== 'closed' && (
          <div className="relative">
            <button
              className="text-gray-500 hover:text-blue-700 text-2xl px-2 transition-colors duration-150"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Thread options"
            >
              &#8942;
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10 animate-fade-in">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 rounded"
                  onClick={() => { closeThread(thread._id); setMenuOpen(false); }}
                >
                  Close Thread
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-transparent">
        {messages.map((msg, idx) => {
          // For admin: admin's messages right, user's left. For user: user's right, admin's left.
          const alignRight = (user.role === 'Admin' && isOwn(msg)) || (user.role !== 'Admin' && isOwn(msg));
          return (
            <div key={msg._id || idx} className={`flex items-end gap-2 ${alignRight ? 'justify-end' : 'justify-start'}`}>
              {!alignRight && (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 text-lg shadow-sm">
                  {getAvatar(msg.sender.role)}
                </div>
              )}
              <div className={`px-4 py-2 rounded-2xl max-w-xs shadow ${alignRight ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none'}`}>
                <div className="text-xs font-semibold mb-1 text-blue-700">{msg.sender.role}</div>
                <div className="break-words whitespace-pre-line">{msg.content}</div>
                <div className="text-xs text-gray-400 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
              {alignRight && (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-400 text-white text-lg shadow-sm">
                  {getAvatar(msg.sender.role)}
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      {canSend && thread && thread.status !== 'closed' && (
        <div className="p-4 bg-white border-t flex gap-2 rounded-b-lg shadow-sm">
          <input
            className="flex-1 border rounded px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={e => e.key === 'Enter' && onSendMessage()}
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors" onClick={onSendMessage}>
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow; 