import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyOtp from './pages/VerifyOtp';
import StudentHome from './pages/StudentHome';
import InstructorHome from './pages/InstructorHome';
import Pending from './pages/Pending';
import Profile from './pages/Profile';
import AdminInstructors from './pages/AdminInstructors';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/student" element={<StudentHome />} />
          <Route path="/instructor" element={<InstructorHome />} />
          <Route path="/pending" element={<Pending />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/instructors" element={<Navigate to="/admin/instructors/active" replace />} />
          <Route path="/admin/instructors/:list" element={<AdminInstructors />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
