import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const Login = () => {
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetData, setResetData] = useState({
    email: '',
    securityAnswer: '',
    newPassword: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();


const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  
  try {
    await login(identifier, password);
    // No need to manually handle redirect here - it should be handled in AuthContext
  } catch (error) {
    let errorMessage = 'Login error. Please try again.';
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      errorMessage = 'Cannot connect to server. Check if backend is running.';
    }
    setError(errorMessage);
  }
};

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('/api/users/reset-password', resetData);
      if (response.data.success) {
        alert('Password reset successfully! Please login with your new password.');
        setShowResetForm(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Password reset failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {!showResetForm ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email or Username</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full  border-2 border-black bg-blue-400 text-white py-2 px-4 rounded hover:bg-primary-dark transition"
            >
              Login
            </button>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowResetForm(true)}
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={resetData.email}
                onChange={(e) => setResetData({...resetData, email: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Security Answer</label>
              <input
                type="text"
                name="securityAnswer"
                value={resetData.securityAnswer}
                onChange={(e) => setResetData({...resetData, securityAnswer: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={resetData.newPassword}
                onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                className="w-full p-2 border rounded"
                required
                minLength="6"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-400 border-2  text-white py-2 px-4 rounded hover:bg-primary-dark transition"
            >
              Reset Password
            </button>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowResetForm(false)}
                className="text-sm text-primary hover:underline"
              >
                Back to Login
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;