import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand">
          LearnIt
        </Link>
      </div>
      <div className="navbar-right">
        {!user && (
          <>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </>
        )}
        {user && user.role === 'ADMIN' && (
          <div className="navbar-dropdown">
            <span className="dropdown-title">Instructors ▾</span>
            <div className="dropdown-menu">
              <Link to="/admin/instructors/active">Active</Link>
              <Link to="/admin/instructors/pending">Pending</Link>
            </div>
          </div>
        )}
        {user && (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
