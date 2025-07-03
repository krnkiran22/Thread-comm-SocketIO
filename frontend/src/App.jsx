import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThreadProvider } from './context/ThreadContext';
import Login from './pages/Login';
import Home from './pages/Home';
import LoginPage from './LoginPage';
import ThreadList from './ThreadList';
import ChatWindow from './ChatWindow';
import ThreadForm from './ThreadForm';
import Signup from './pages/Signup';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ThreadProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/*" element={<PrivateRoute><Home /></PrivateRoute>} />
          </Routes>
        </Router>
      </ThreadProvider>
    </AuthProvider>
  );
}

export default App;
