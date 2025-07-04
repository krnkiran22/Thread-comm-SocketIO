import React, { useContext, useState } from 'react';
import { ThreadContext } from '../context/ThreadContext';
import SidePanel from '../components/SidePanel';
import ChatWindow from '../components/ChatWindow';

const AdminDashboard = ({ user }) => {
  const {
    threads,
    selectedThread,
    messages,
    selectThread,
    setFilter,
    filter,
    sendMessage,
    closeThread,
  } = useContext(ThreadContext);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-80 h-full">
        <SidePanel
          threads={threads}
          onSelectThread={selectThread}
          userRole={user?.role}
          onFilterChange={setFilter}
          filter={filter}
          onCreateThread={null} // Admin doesn't create threads
        />
      </div>
      <div className="flex-1 h-full flex flex-col">
      
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          user={user}
          thread={selectedThread}
          input={input}
          setInput={setInput}
          canSend={user.role === 'Admin'}
          closeThread={closeThread}
          onRefreshMessages={() => selectedThread && selectThread(selectedThread)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard; 