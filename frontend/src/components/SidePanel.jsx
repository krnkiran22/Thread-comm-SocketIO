import React from 'react';

const SidePanel = ({ threads, onSelectThread, onCreateThread, userRole, onFilterChange, filter }) => {
  return (
    <div className="w-full sm:w-80 bg-white border-r h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">Dispute Threads</h2>
        {['Investor', 'Issuer'].includes(userRole) && (
          <button className="bg-blue-600 text-white px-3 py-1 rounded shadow" onClick={onCreateThread}>
            + New
          </button>
        )}
      </div>
      {/* Admin filters */}
      {userRole === 'Admin' && (
        <div className="p-2 border-b">
          <label className="block text-xs mb-1 font-semibold">Filter by status:</label>
          <select
            className="w-full border rounded p-1"
            value={filter}
            onChange={e => onFilterChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {/* Thread list goes here */}
        {threads.length === 0 && (
          <div className="text-center text-gray-400 mt-8">No threads found.</div>
        )}
        {threads.map(thread => (
          <div key={thread._id} onClick={() => onSelectThread(thread)} className="cursor-pointer hover:bg-gray-100 p-3 border-b flex justify-between items-center">
            <div>
              <div className="font-semibold">{thread.metadata?.title || 'Untitled'}</div>
              <div className="text-xs text-gray-500">{thread.lastMessage?.content || 'No messages yet'}</div>
              <div className="text-xs text-gray-400">{thread.updatedAt && new Date(thread.updatedAt).toLocaleString()}</div>
            </div>
            {/* Placeholder for 3 dots menu, actual menu in ChatWindow */}
          </div>
        ))}
      </div>
      {['Investor', 'Issuer'].includes(userRole) && (
        <div className="p-4 border-t">
          <button className="w-full bg-blue-600 text-white py-2 rounded shadow text-lg" onClick={onCreateThread}>
            + Create New Thread
          </button>
        </div>
      )}
    </div>
  );
};

export default SidePanel; 