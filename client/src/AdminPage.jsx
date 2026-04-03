import './UserPage.css'
import './AdminPage.css'
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";



function EventCard({ event, onEdit = () => {}, onDelete = () => {}, onApprove = () => {}, onDeny = () => {} }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`event-card ${expanded ? 'expanded' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="event-card-top">
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button
            className={`btn-approve-toggle${event.approved ? ' filled' : ''}`}
            style={{ background: event.approved ? '#4caf50' : 'transparent', color: event.approved ? 'white' : '#4caf50', borderColor: '#4caf50' }}
            onClick={e => { e.stopPropagation(); if (!event.approved) onApprove(event); }}
          >Approved</button>
          <button
            className={`btn-deny-toggle${!event.approved ? ' filled' : ''}`}
            style={{ background: !event.approved ? '#cc3333' : 'transparent', color: !event.approved ? 'white' : '#cc3333', borderColor: '#cc3333' }}
            onClick={e => { e.stopPropagation(); if (event.approved) onDeny(event); }}
          >Denied</button>
        </div>
        <span className="event-card-category">Event</span>
        <h3>{event.title}</h3>
        <div className="event-card-meta">
          <span>📅 {event.date ? event.date.slice(0, 10) : ''}</span>
        </div>
      </div>
      <div className="event-card-description">
        <p>{event.description}</p>
      </div>
      <div className="event-card-actions" onClick={e => e.stopPropagation()}>
        <button className="btn-edit" onClick={() => onEdit(event)}>Edit</button>
        <button className="btn-delete" onClick={() => onDelete(event)}>Delete</button>
      </div>
    </div>
  );
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState('events');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editType, setEditType] = useState("");
  const [categories, setCategories] = useState([]);
  const adminId = window.localStorage.getItem('userId');
  // Fetch categories on mount
  useEffect(() => {
    axios.get('/api/categories').then(res => setCategories(res.data)).catch(() => setCategories([]));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, eventsRes] = await Promise.all([
        axios.get("/api/users"),
        axios.get("/api/events"),
      ]);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
    } catch (err) {
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // User actions
  const handleEditUser = (user) => {
    setEditUser(user);
    setEditType('user');
    setEditForm({ name: user.name, role: user.role });
  };
  const handleDeleteUser = async (user) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`/api/users/${user._id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };
  const handleUserFormChange = e => setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleUserFormSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${editUser._id}`, editForm);
      setEditUser(null);
      fetchData();
    } catch (err) {
      alert('Failed to update user');
    }
  };

  // Event actions
  const handleEditEvent = (event) => {
    setEditEvent(event);
    setEditType('event');
    setEditForm({
      title: event.title,
      description: event.description,
      date: event.date ? event.date.slice(0, 10) : '',
      location: event.location,
      category: event.category?._id || event.category || '',
      approved: event.approved,
    });
  };
  const handleDeleteEvent = async (event) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await axios.delete(`/api/events/${event._id}?userId=${adminId}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete event');
    }
  };
  const handleApproveEvent = async (event) => {
    try {
      await axios.patch(`/api/events/${event._id}/approve`, { userId: adminId });
      fetchData();
    } catch (err) {
      alert('Failed to approve event');
    }
  };
  const handleEventFormChange = e => setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleEventFormSubmit = async e => {
    e.preventDefault();
    try {
      // Ensure approved is boolean
      const payload = {
        ...editForm,
        approved: editForm.approved === true || editForm.approved === 'true',
        userId: adminId
      };
      await axios.put(`/api/events/${editEvent._id}`, payload);
      setEditEvent(null);
      fetchData();
    } catch (err) {
      console.error('Update event error:', err);
      alert('Failed to update event');
    }
  };

  return (
    <div className="page-wrapper">
      <header className="site-header">
        <span className="logo">Admin Dashboard</span>
        <div className="header-right">
          <span className="header-username">
            Admin <span className="admin-badge">Admin</span>
          </span>
          <Link className="btn-logout" to="/">Logout</Link>
        </div>
      </header>

      <nav className="tabs">
        <button
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >Events</button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >Users</button>
      </nav>


      <main className="page-content">
        {loading ? (
          <div className="loading">Loading admin data...</div>
        ) : error ? (
          <div className="auth-error">{error}</div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="admin-section">
                <div className="admin-section-title">All Users</div>
                {users.filter(user => user.role !== 'admin').map(user => (
                  <div key={user._id} className="user-card">
                    <div className="user-card-info">
                      <span className="user-card-name">{user.name}</span>
                      <span className="user-card-role">{user.role}</span>
                    </div>
                    <div className="user-card-actions">
                      <button className="btn-edit" onClick={() => handleEditUser(user)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteUser(user)}>Delete</button>
                    </div>
                  </div>
                ))}
                {editType === 'user' && editUser && (
                  <form className="admin-edit-form" onSubmit={handleUserFormSubmit} style={{marginTop:8, background:'#f9f9f9',padding:12,borderRadius:8}}>
                    <h4>Edit User</h4>
                    <div className="form-group"><label>Name</label><input name="name" value={editForm.name} onChange={handleUserFormChange} required /></div>
                    <div className="form-group"><label>Role</label><select name="role" value={editForm.role} onChange={handleUserFormChange}><option value="user">User</option><option value="admin">Admin</option></select></div>
                    <button className="btn-edit" type="submit">Save</button>
                    <button className="btn-delete" type="button" onClick={() => setEditUser(null)}>Cancel</button>
                  </form>
                )}
              </div>
            )}
            {activeTab === 'events' && (
              <div className="admin-section">
                <div className="admin-section-title">All Events</div>
                <div className="events-grid">
                  {events.map((event, index) => (
                    <EventCard
                      key={index}
                      event={event}
                      onEdit={handleEditEvent}
                      onDelete={handleDeleteEvent}
                      onApprove={handleApproveEvent}
                      onDeny={async (ev) => {
                        try {
                          await axios.put(`/api/events/${ev._id}`, { ...ev, approved: false, userId: adminId });
                          fetchData();
                        } catch (err) {
                          alert('Failed to deny event');
                        }
                      }}
                    />
                  ))}
                  {editType === 'event' && editEvent && (
                    <form className="admin-edit-form" onSubmit={handleEventFormSubmit} style={{marginTop:8, background:'#f9f9f9',padding:12,borderRadius:8}}>
                      <h4>Edit Event</h4>
                      <div className="form-group"><label>Title</label><input name="title" value={editForm.title} onChange={handleEventFormChange} required /></div>
                      <div className="form-group"><label>Description</label><textarea name="description" value={editForm.description} onChange={handleEventFormChange} required /></div>
                      <div className="form-group"><label>Date</label><input type="date" name="date" value={editForm.date} onChange={handleEventFormChange} required /></div>
                      <div className="form-group"><label>Location</label><input name="location" value={editForm.location} onChange={handleEventFormChange} required /></div>
                      <div className="form-group"><label>Category</label><select name="category" value={editForm.category} onChange={handleEventFormChange} required><option value="">Select category</option>{categories && categories.map(cat => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}</select></div>
                      <div className="form-group"><label>Approved</label><select name="approved" value={editForm.approved} onChange={handleEventFormChange}><option value={true}>Yes</option><option value={false}>No</option></select></div>
                      <button className="btn-edit" type="submit">Save</button>
                      <button className="btn-delete" type="button" onClick={() => setEditEvent(null)}>Cancel</button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Dev link — remove before submission
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <Link to="/user" style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>→ User Page (dev)</Link>
      </div>
      */}
    </div>
  );
}

export default AdminPage;