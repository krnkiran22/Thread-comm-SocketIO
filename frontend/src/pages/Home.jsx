import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const Home = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  if (user.role === 'Admin') {
    return <AdminDashboard user={user} />;
  }
  return <UserDashboard user={user} />;
};

export default Home; 