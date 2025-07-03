import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Investor');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post('/auth/register', { email, password, role });
      setSuccess('Registration successful! You can now log in.');
      setError('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 border rounded">
            <option value="Investor">Investor</option>
            <option value="Issuer">Issuer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button onClick={handleSignup} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Sign Up</button>
        <div className="mt-4 text-center">
          <span>Already have an account? </span>
          <button className="text-blue-600 underline" onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Signup; 