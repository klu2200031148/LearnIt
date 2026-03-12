import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './VerifyOtp.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VerifyOtp = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const email = query.get('email') || '';
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      alert('Please enter OTP');
      return;
    }
    try {
      console.log('Verifying OTP for email:', email, 'OTP:', otp);
      await axios.post(`/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp.trim())}`);
      alert('OTP verified successfully. Please log in.');
      navigate('/login');
    } catch (err) {
      console.error('OTP verification error:', err.message);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      const errorMsg = err.response?.data?.message || err.response?.data || 'OTP verification failed';
      alert(`Error: ${errorMsg}`);
    }
  };

  return (
    <div className="otp-container">
      <h2>OTP Verification</h2>
      <p>An OTP has been sent to {email}. Enter it below:</p>
      <form onSubmit={handleSubmit} className="otp-form">
        <label>
          OTP:
          <input value={otp} onChange={(e) => setOtp(e.target.value)} required />
        </label>
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default VerifyOtp;