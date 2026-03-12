import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.email) return;
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`/auth/profile?email=${encodeURIComponent(user.email)}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile', err);
        setError('Could not load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  if (!profile || profile.error) {
    return <div className="profile-error">{profile?.error || 'Profile not found.'}</div>;
  }

  const renderDetailRow = (label, value) => (
    <div className="profile-row" key={label}>
      <span className="profile-label">{label}</span>
      <span className="profile-value">{value ?? '-'}</span>
    </div>
  );

  const isInstructor = profile.role === 'INSTRUCTOR';
  const isStudent = profile.role === 'STUDENT';

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-card">
        {profile.profilePhoto && (
          <div className="profile-photo">
            <img src={profile.profilePhoto} alt="Profile" />
          </div>
        )}
        <div className="profile-details">
          {renderDetailRow('User ID', profile.userid)}
          {renderDetailRow('Name', profile.username)}
          {renderDetailRow('Email', profile.email)}
          {renderDetailRow('Role', profile.role)}
          {renderDetailRow('Status', profile.status)}
          {renderDetailRow('Gender', profile.gender)}
          {renderDetailRow('Contact', profile.contactNumber)}

          {isStudent && (
            <>
              <h2 className="profile-section">Student details</h2>
              {renderDetailRow('Roll Number', profile.studentDetails?.rollNumber)}
              {renderDetailRow('Course', profile.studentDetails?.course)}
              {renderDetailRow('College', profile.studentDetails?.collegeName)}
              {renderDetailRow('Date of Birth', profile.studentDetails?.dateOfBirth)}
            </>
          )}

          {isInstructor && (
            <>
              <h2 className="profile-section">Instructor details</h2>
              {renderDetailRow('Employee ID', profile.instructorDetails?.employeeId)}
              {renderDetailRow('Department', profile.instructorDetails?.department)}
              {renderDetailRow('Qualification', profile.instructorDetails?.qualification)}
              {renderDetailRow('Experience (years)', profile.instructorDetails?.experienceYears)}
              {renderDetailRow('Specialization', profile.instructorDetails?.specialization)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;