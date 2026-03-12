import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AdminInstructors.css';

const AdminInstructors = () => {
  const { user } = useContext(AuthContext);
  const { list } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState(list === 'pending' ? 'pending' : 'active');
  const [activeInstructors, setActiveInstructors] = useState([]);
  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (list === 'pending' || list === 'active') {
      setView(list);
    } else {
      navigate('/admin/instructors/active', { replace: true });
    }
  }, [list, navigate]);

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'ADMIN') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      setError('');
      try {
        const [activeRes, pendingRes] = await Promise.all([
          axios.get('/auth/instructors/active'),
          axios.get('/auth/instructors/pending'),
        ]);
        setActiveInstructors(Array.isArray(activeRes.data) ? activeRes.data : []);
        setPendingInstructors(Array.isArray(pendingRes.data) ? pendingRes.data : []);
      } catch (err) {
        console.error('Failed to load instructors lists', err);
        setError('Failed to load instructors list. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  const currentList = view === 'pending' ? pendingInstructors : activeInstructors;

  const handleViewChange = (newView) => {
    if (newView === view) return;
    setView(newView);
    setSelected(null);
    navigate(`/admin/instructors/${newView}`);
  };

  const handleApprove = async (instructor) => {
    if (!instructor?.userid) {
      return;
    }
    setActionLoading(true);
    setError('');
    try {
      await axios.put(`/instructors/approve?email=${encodeURIComponent(instructor.email)}`);
      setPendingInstructors((prev) => prev.filter((i) => i.userid !== instructor.userid));
      setActiveInstructors((prev) => [instructor, ...prev]);
      setSelected({ ...instructor, status: 'ACTIVE' });
    } catch (err) {
      console.error('Approve failed', err);
      setError('Unable to approve instructor. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const renderTableRow = (instructor, index) => (
    <tr key={instructor.userid || index}>
      <td>{index + 1}</td>
      <td>{instructor.email || '-'}</td>
      <td>{instructor.username || instructor.name || '-'}</td>
      <td>{instructor.qualification || '-'}</td>
      <td>{instructor.department || '-'}</td>
      <td>
        <button
          className="primary"
          onClick={() => setSelected(instructor)}
        >
          More details
        </button>
      </td>
    </tr>
  );

  return (
    <div className="admin-page">
      <h1>Instructor Management</h1>

      <div className="admin-tabs">
        <button
          className={view === 'active' ? 'active' : ''}
          onClick={() => handleViewChange('active')}
        >
          Active Instructors
        </button>
        <button
          className={view === 'pending' ? 'active' : ''}
          onClick={() => handleViewChange('pending')}
        >
          Pending Instructors
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Loading instructors...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>SNO</th>
                <th>Email</th>
                <th>Name</th>
                <th>Qualification</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    {view === 'pending'
                      ? 'No pending instructors.'
                      : 'No active instructors.'}
                  </td>
                </tr>
              ) : (
                currentList.map(renderTableRow)
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="modal-header">
              <h2>Instructor Details</h2>
              <button className="close-btn" onClick={() => setSelected(null)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">User ID</span>
                <span className="detail-value">{selected.userid || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email</span>
                <span className="detail-value">{selected.email || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Name</span>
                <span className="detail-value">{selected.username || selected.name || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Department</span>
                <span className="detail-value">{selected.department || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Qualification</span>
                <span className="detail-value">{selected.qualification || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Experience (years)</span>
                <span className="detail-value">{selected.experienceYears ?? '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Specialization</span>
                <span className="detail-value">{selected.specialization || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className="detail-value">{selected.status || '-'}</span>
              </div>
            </div>

            {view === 'pending' && (
              <div className="modal-actions">
                <button
                  className="primary"
                  onClick={() => handleApprove(selected)}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Approving…' : 'Approve'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInstructors;
