import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { io } from 'socket.io-client';

export const ThreadContext = createContext();

export const ThreadProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showSocket, setShowSocket] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) fetchThreads();
  }, [user, filter]);

  // Restore last selected thread on mount if available
  useEffect(() => {
    if (user && threads.length > 0) {
      const lastThreadId = localStorage.getItem('lastSelectedThreadId');
      if (lastThreadId) {
        const found = threads.find(t => t._id === lastThreadId);
        if (found) {
          setSelectedThread(found);
          // Join the thread room for real-time updates
          if (socketRef.current) {
            socketRef.current.emit('join-thread', found._id);
          }
        }
      }
    }
  }, [user, threads]);

  useEffect(() => {
    if (selectedThread) {
      // Fetch messages when thread changes
      (async () => {
        const res = await axios.get(`/threads/${selectedThread._id}/messages`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setMessages(res.data);
      })();
    } else {
      setMessages([]);
    }
  }, [selectedThread]);

  useEffect(() => {
    if (user && !socketRef.current) {
      socketRef.current = io('http://localhost:3000', {
        auth: { token: localStorage.getItem('token') },
        transports: ['websocket'],
      });
      socketRef.current.on('receive-message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  const fetchThreads = async () => {
    let url = '/threads';
    if (user?.role === 'Admin' && filter !== 'all') url += `?status=${filter}`;
    const res = await axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    let threadList = res.data;
    if (user?.role !== 'Admin') {
      threadList = threadList.filter(thread => {
        if (!thread.creator) return false;
        if (typeof thread.creator === 'object') {
          return thread.creator._id === user.id;
        }
        return thread.creator === user.id;
      });
    }
    setThreads(threadList);
  };

  const selectThread = async (thread) => {
    setSelectedThread(thread);
    localStorage.setItem('lastSelectedThreadId', thread._id); // Persist selection
    // Join the thread room for real-time updates
    if (socketRef.current) {
      socketRef.current.emit('join-thread', thread._id);
    }
    const res = await axios.get(`/threads/${thread._id}/messages`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setMessages(res.data);
  };

  const updateThreads = (newThread) => {
    setThreads(prev => [newThread, ...prev]);
  };

  const createThread = async ({ title, message }) => {
    const res = await axios.post('/threads', { metadata: { title } }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    const thread = res.data;
    setThreads(prev => [thread, ...prev]);
    setSelectedThread(thread);
    // Send initial message via WebSocket
    if (socketRef.current) {
      socketRef.current.emit('join-thread', thread._id);
      socketRef.current.emit('send-message', { threadId: thread._id, content: message });
    }
  };

  const sendMessage = (content) => {
    if (!selectedThread || !content.trim()) return;
    if (socketRef.current) {
      socketRef.current.emit('send-message', {
        threadId: selectedThread._id,
        content,
      });
    }
  };

  const closeThread = async (threadId) => {
    await axios.patch(`/threads/${threadId}`, { status: 'closed' }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setThreads(prev => prev.map(t => t._id === threadId ? { ...t, status: 'closed' } : t));
    if (selectedThread && selectedThread._id === threadId) {
      setSelectedThread({ ...selectedThread, status: 'closed' });
    }
  };

  return (
    <ThreadContext.Provider value={{ threads, selectedThread, messages, fetchThreads, selectThread, updateThreads, setFilter, filter, createThread, sendMessage, closeThread }}>
      {children}
    </ThreadContext.Provider>
  );
}; 