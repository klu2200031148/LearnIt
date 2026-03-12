import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Configure axios to hit backend directly
const API_URL = 'http://localhost:2026';
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('lmsUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('lmsToken');
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('lmsUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('lmsUser');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('lmsToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('lmsToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('Login request - email:', email);
      console.log('API URL:', API_URL);
const res = await axios.post(`/auth/login?email=${email}&password=${password}`);      
      console.log('Login response:', res.data);
      console.log('Response type:', typeof res.data);
      
      let token;
      
      // Handle string response (just token)
      if (typeof res.data === 'string') {
        token = res.data;
        console.log('Token from string response:', token);
        setToken(token);
        // No user info available, just set token
        navigate('/student'); // Default redirect
        return;
      }
      
      // Handle object response
      if (typeof res.data === 'object') {
        let userInfo;
        
        // Try different response structures
        if (res.data.token && res.data.user) {
          token = res.data.token;
          userInfo = res.data.user;
        } else if (res.data.data && res.data.data.token && res.data.data.user) {
          token = res.data.data.token;
          userInfo = res.data.data.user;
        } else if (res.data.token) {
          token = res.data.token;
          userInfo = res.data.user || null;
        } else {
          console.error('Cannot find token in response:', res.data);
          throw new Error('Invalid response from server');
        }
        
        console.log('Token:', token);
        console.log('User Info:', userInfo);
        
        if (!token) {
          throw new Error('No token received from server');
        }
        
        setToken(token);
        if (userInfo) {
          setUser(userInfo);
        }
        
        // Redirect based on role and status if we have user info
        if (userInfo && userInfo.role === 'STUDENT') {
          if (userInfo.status && userInfo.status !== 'ACTIVE') {
            navigate('/pending');
          } else {
            navigate('/student');
          }
        } else if (userInfo && userInfo.role === 'INSTRUCTOR') {
          if (userInfo.status !== 'ACTIVE') {
            navigate('/pending');
          } else {
            navigate('/instructor');
          }
        } else if (userInfo && userInfo.role === 'ADMIN') {
          navigate('/admin/instructors/active');
        } else {
          // Default redirect if no role info
          navigate('/student');
        }
      }
    } catch (err) {
      console.error('Login error:', err.message);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        console.error('Response headers:', err.response.headers);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Request setup error:', err);
      }
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
