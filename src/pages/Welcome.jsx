import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import './Welcome.css';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <h1>Welcome to LearnIt</h1>
      <p>Your learning management system for instructors and students.</p>
      <div className="icons-row">
        <FaBook size={48} />
        <FaChalkboardTeacher size={48} />
        <FaUserGraduate size={48} />
      </div>
      <div className="action-buttons">
        <Link to="/signup" className="btn">
          Signup
        </Link>
        <Link to="/login" className="btn">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
