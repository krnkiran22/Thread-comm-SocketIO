import React, { useState } from 'react';

const ThreadForm = ({ onSubmit, onClose, userEmail }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) {
      setError('Message is required');
      return;
    }
    onSubmit({ message });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Create New Thread</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1">Thread Title (Your Email)</label>
          <input type="text" value={userEmail} readOnly className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Initial Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full px-3 py-2 border rounded" rows={3} />
        </div>
        <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create Thread</button>
      </div>
    </div>
  );
};

export default ThreadForm; 