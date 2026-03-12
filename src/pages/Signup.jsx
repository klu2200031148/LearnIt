import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    gender: '',
    role: '',
    status: '',
    contactNumber: '',
    profilePhoto: '',
    // instructor
    employeeId: '',
    department: '',
    qualification: '',
    experienceYears: '',
    specialization: '',
    // student
    rollNumber: '',
    course: '',
    dateOfBirth: '',
    collegeName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic validation
    if (!form.email || !form.password || !form.role) {
      alert('Please fill required fields');
      return;
    }
    try {
      console.log('Signup request with form:', form);
      const response = await axios.post('/auth/register', form);
      
      console.log('Signup response:', response.data);
      console.log('Response type:', typeof response.data);
      
      // Check user status to handle different scenarios
      try {
        const statusResponse = await axios.get(`/auth/status?email=${encodeURIComponent(form.email)}`);
        const userStatus = statusResponse.data?.status || 'PENDING';
        const userRole = form.role;
        
        console.log('User status:', userStatus, 'Role:', userRole);
        
        // Handle pending/incomplete registration
        if (userStatus === 'PENDING') {
          alert('Registration completed but OTP verification not completed.');
          navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
          return;
        }
        
        // Handle instructor verification pending
        if (userRole === 'INSTRUCTOR') {
          alert('Registration completed successfully. Now credentials are being verified by admin. Please wait.');
          navigate('/pending');
          return;
        }
        
        // Handle student active registration
        alert('Registration successful! OTP sent to your email.');
        navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
      } catch (statusErr) {
        console.log('Status check failed, proceeding with default flow:', statusErr.message);
        alert('Registration successful! OTP sent to your email.');
        navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
      }
    } catch (err) {
      console.error('Signup error:', err.message);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Registration failed';
      
      // If email already exists (403, 409, or message contains "already exists"), check status
      if (err.response?.status === 403 ||
          err.response?.status === 409 || 
          (typeof errorMsg === 'string' && (errorMsg.toLowerCase().includes('already exists') || errorMsg.toLowerCase().includes('email already')))) {
        try {
          console.log('Email exists, checking user status...');
          const statusResponse = await axios.get(`/auth/status?email=${encodeURIComponent(form.email)}`);
          const userStatus = statusResponse.data?.status || 'PENDING';
          
          console.log('User status:', userStatus);
          
          if (userStatus === 'PENDING') {
            alert('Registration completed and now OTP verification is pending.');
            navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
            return;
          } else if (userStatus === 'ACTIVE') {
            alert('This email is already registered and active. Please login.');
            navigate('/login');
            return;
          } else {
            alert(`This email is already registered with status: ${userStatus}`);
            return;
          }
        } catch (statusErr) {
          console.error('Status check error:', statusErr.message);
          // If status check fails, offer to verify
          if (err.response?.status === 403 || err.response?.status === 409) {
            const confirmVerify = window.confirm(
              'This email is already registered. Would you like to verify OTP now?'
            );
            if (confirmVerify) {
              navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
            }
            return;
          }
        }
      }
      
      alert(`Error: ${errorMsg}`);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          Email*:
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Username:
          <input type="text" name="username" value={form.username} onChange={handleChange} />
        </label>
        <label>
          Password*:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <small>At least 8 characters, mix letters & numbers.</small>
        </label>
        <label>
          Gender:
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>
          Role*:
          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="INSTRUCTOR">Instructor</option>
            <option value="STUDENT">Student</option>
          </select>
        </label>
        <label>
          Contact Number:
          <input
            type="text"
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
          />
        </label>
        <label>
          Profile Photo URL:
          <input
            type="text"
            name="profilePhoto"
            value={form.profilePhoto}
            onChange={handleChange}
          />
        </label>
        {form.role === 'INSTRUCTOR' && (
          <div className="role-fields">
            <h4>Instructor details</h4>
            <label>
              Employee ID:
              <input type="text" name="employeeId" value={form.employeeId} onChange={handleChange} />
            </label>
            <label>
              Department:
              <input type="text" name="department" value={form.department} onChange={handleChange} />
            </label>
            <label>
              Qualification:
              <input type="text" name="qualification" value={form.qualification} onChange={handleChange} />
            </label>
            <label>
              Experience Years:
              <input type="number" name="experienceYears" value={form.experienceYears} onChange={handleChange} />
            </label>
            <label>
              Specialization:
              <input type="text" name="specialization" value={form.specialization} onChange={handleChange} />
            </label>
          </div>
        )}
        {form.role === 'STUDENT' && (
          <div className="role-fields">
            <h4>Student details</h4>
            <label>
              Roll Number:
              <input type="text" name="rollNumber" value={form.rollNumber} onChange={handleChange} />
            </label>
            <label>
              Course:
              <input type="text" name="course" value={form.course} onChange={handleChange} />
            </label>
            <label>
              Date of Birth:
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
            </label>
            <label>
              College Name:
              <input type="text" name="collegeName" value={form.collegeName} onChange={handleChange} />
            </label>
          </div>
        )}
        <button type="submit">Register / Next</button>
      </form>
    </div>
  );
};

export default Signup;
