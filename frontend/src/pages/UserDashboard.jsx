import React, { useContext, useState } from 'react';
import { ThreadContext } from '../context/ThreadContext';
import SidePanel from '../components/SidePanel';
import ChatWindow from '../components/ChatWindow';
import ThreadForm from '../components/ThreadForm';

const UserDashboard = ({ user }) => {
  const {
    threads,
    selectedThread,
    messages,
    selectThread,
    setFilter,
    filter,
    sendMessage,
    createThread,
  } = useContext(ThreadContext);
  const [input, setInput] = useState('');
  const [showThreadForm, setShowThreadForm] = useState(false);

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleCreateThread = async ({ message }) => {
    await createThread({ title: user.email, message });
    setShowThreadForm(false);
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
          onCreateThread={() => setShowThreadForm(true)}
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
          canSend={user.role !== 'Admin'}
        />
      </div>
      {showThreadForm && <ThreadForm onSubmit={handleCreateThread} onClose={() => setShowThreadForm(false)} userEmail={user.email} />}
    </div>
  );
};

export default UserDashboard; 