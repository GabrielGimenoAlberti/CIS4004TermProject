import './UserPage.css'
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function EventCard({ event, showActions, userId, userRsvp, onRsvpChange, categories }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: event.title,
    description: event.description,
    date: event.date ? event.date.slice(0, 10) : '',
    location: event.location,
    category: event.category?._id || event.category || '',
  });
  const [editError, setEditError] = useState("");
  const isRsvped = !!userRsvp;

  const handleRsvp = async (status) => {
    if (!userId) return;
    setLoading(true);
    try {
      if (status === 'going') {
        await axios.post('/api/rsvps', { user: userId, event: event._id, status: 'going' });
      } else if (userRsvp) {
        await axios.delete(`/api/rsvps/${userRsvp._id}`);
      }
      onRsvpChange && onRsvpChange();
    } catch (err) {
      // Optionally show error
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = e => {
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    setEditError("");
    setLoading(true);
    try {
      await axios.put(`/api/events/${event._id}`, { ...editForm, userId });
      setEditing(false);
      onRsvpChange && onRsvpChange();
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/events/${event._id}?userId=${userId}`);
      onRsvpChange && onRsvpChange();
    } catch (err) {
      // Optionally show error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`event-card ${expanded ? 'expanded' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="event-card-top">
        <span className="event-card-category">Event</span>
        <h3>{event.title}</h3>
        <div className="event-card-meta">
          <span>📅 {event.date ? event.date.slice(0, 10) : ''}</span>
          <span>📍 {event.location || 'Location TBD'}</span>
        </div>
      </div>

      {editing ? (
        <form className="event-card-description" onSubmit={handleEditSubmit} style={{ background: '#f9f9f9', borderRadius: 8, padding: 12 }} onClick={e => e.stopPropagation()}>
          <div className="form-group"><label>Title</label><input name="title" value={editForm.title} onChange={handleEditChange} required /></div>
          <div className="form-group"><label>Description</label><textarea name="description" value={editForm.description} onChange={handleEditChange} required /></div>
          <div className="form-group"><label>Date</label><input type="date" name="date" value={editForm.date} onChange={handleEditChange} required /></div>
          <div className="form-group"><label>Location</label><input name="location" value={editForm.location} onChange={handleEditChange} required /></div>
          <div className="form-group"><label>Category</label><select name="category" value={editForm.category} onChange={handleEditChange} required><option value="">Select category</option>{categories && categories.map(cat => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}</select></div>
          {editError && <div className="auth-error">{editError}</div>}
          <button className="btn-edit" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          <button className="btn-delete" type="button" onClick={e => { e.preventDefault(); setEditing(false); }}>Cancel</button>
        </form>
      ) : (
        <div className="event-card-description">
          <p>{event.description}</p>
          <p style={{ marginTop: '0.4rem', fontSize: '0.78rem' }}>
            RSVPs: {(Array.isArray(event.rsvps) ? event.rsvps.join(", ") : "None yet") || "None yet"}
          </p>
        </div>
      )}

      <div className="event-card-actions" onClick={e => e.stopPropagation()}>
        <button
          className={`btn-rsvp${isRsvped ? ' active' : ''}`}
          disabled={loading}
          onClick={e => { e.preventDefault(); e.stopPropagation(); handleRsvp('going'); }}
        >Yes</button>
        <button
          className="btn-rsvp"
          disabled={loading || !isRsvped}
          onClick={e => { e.preventDefault(); e.stopPropagation(); handleRsvp('remove'); }}
        >No</button>
        {showActions && !editing && (
          <>
            <button className="btn-edit" onClick={e => { e.preventDefault(); e.stopPropagation(); setEditing(true); setExpanded(true); }}>Edit</button>
            <button className="btn-delete" onClick={e => { e.preventDefault(); e.stopPropagation(); handleDelete(); }}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}


function UserPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [categories, setCategories] = useState([]);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
  });
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [userRsvps, setUserRsvps] = useState([]);

  // Use actual user ID and name from localStorage
  const userId = window.localStorage.getItem('userId');
  const userName = window.localStorage.getItem('userName') || 'User';

  // Fetch events and RSVPs
  const fetchEventsAndRsvps = async () => {
    setLoading(true);
    setError("");
    try {
      const [eventsRes, rsvpsRes] = await Promise.all([
        axios.get("/api/events"),
        userId ? axios.get(`/api/rsvps/user/${userId}`) : Promise.resolve({ data: [] })
      ]);
      setEvents(eventsRes.data);
      setUserRsvps(rsvpsRes.data);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsAndRsvps();
    // eslint-disable-next-line
  }, []);

  // Always fetch categories on mount if not loaded
  useEffect(() => {
    if (categories.length === 0) {
      axios.get('/api/categories').then(res => setCategories(res.data)).catch(() => setCategories([]));
    }
  }, [categories.length]);

  const handleCreateChange = e => {
    setCreateForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleCreateSubmit = async e => {
    e.preventDefault();
    setCreateError("");
    setCreateLoading(true);
    try {
      const payload = {
        ...createForm,
        createdBy: userId,
      };
      const res = await axios.post('/api/events', payload);
      setShowCreate(false);
      setCreateForm({ title: '', description: '', date: '', location: '', category: '' });
      // Refresh events
      const refreshed = await axios.get("/api/events");
      setEvents(refreshed.data);
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create event");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <header className="site-header">
        <span className="logo">Event Board</span>
        <div className="header-right">
          <span className="header-username">Welcome, {userName}</span>
          <Link className="btn-logout" to="/">Logout</Link>
        </div>
      </header>

      <nav className="tabs">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >All Events</button>
        <button
          className={`tab-btn ${activeTab === 'mine' ? 'active' : ''}`}
          onClick={() => setActiveTab('mine')}
        >My Events</button>
        <button
          className={`tab-btn ${activeTab === 'rsvps' ? 'active' : ''}`}
          onClick={() => setActiveTab('rsvps')}
        >My RSVPs</button>
      </nav>

      <main className="page-content">
        {loading ? (
          <div className="loading">Loading events...</div>
        ) : error ? (
          <div className="auth-error">{error}</div>
        ) : (
          <>
            {activeTab === 'all' && (
              <>
                <div className="content-header">
                  <h2>All Events</h2>
                </div>
                <div className="events-grid">
                  {events.map((event, index) => {
                    const userRsvp = userRsvps.find(r => r.event && r.event._id === event._id);
                    return (
                      <EventCard
                        key={index}
                        event={event}
                        showActions={false}
                        userId={userId}
                        userRsvp={userRsvp}
                        onRsvpChange={fetchEventsAndRsvps}
                      />
                    );
                  })}
                </div>
              </>
            )}

            {activeTab === 'mine' && (
              <>
                <div className="content-header">
                  <h2>My Events</h2>
                  <button className="btn-create" onClick={() => setShowCreate(v => !v)}>
                    {showCreate ? 'Cancel' : '+ Create Event'}
                  </button>
                </div>
                {showCreate && (
                  <form className="create-event-form" onSubmit={handleCreateSubmit} style={{marginBottom: '2rem', background: '#fff', padding: '1.2rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
                    <div className="form-group">
                      <label>Title</label>
                      <input name="title" value={createForm.title} onChange={handleCreateChange} required />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea name="description" value={createForm.description} onChange={handleCreateChange} required />
                    </div>
                    <div className="form-group">
                      <label>Date</label>
                      <input type="date" name="date" value={createForm.date} onChange={handleCreateChange} required />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input name="location" value={createForm.location} onChange={handleCreateChange} required />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select name="category" value={createForm.category} onChange={handleCreateChange} required>
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    {createError && <div className="auth-error">{createError}</div>}
                    <button className="btn-create" type="submit" disabled={createLoading}>{createLoading ? 'Creating...' : 'Create Event'}</button>
                  </form>
                )}
                <div className="events-grid">
                  {events.filter(event => {
                    // event.createdBy can be an object or string
                    const createdById = event.createdBy && event.createdBy._id ? event.createdBy._id : event.createdBy;
                    return createdById === userId;
                  }).map((event, index) => {
                    const userRsvp = userRsvps.find(r => r.event && r.event._id === event._id);
                    return (
                      <EventCard
                        key={index}
                        event={event}
                        showActions={true}
                        userId={userId}
                        userRsvp={userRsvp}
                        onRsvpChange={fetchEventsAndRsvps}
                        categories={categories}
                      />
                    );
                  })}
                </div>
              </>
            )}

            {activeTab === 'rsvps' && (
              <>
                <div className="content-header">
                  <h2>My RSVPs</h2>
                </div>
                {userRsvps.length === 0 ? (
                  <div className="empty-state">
                    <p>No RSVPs yet</p>
                    <span style={{ fontSize: '0.85rem' }}>Go to All Events and hit Yes on events you want to attend</span>
                  </div>
                ) : (
                  <div className="events-grid">
                    {userRsvps.map((rsvp, index) => (
                      rsvp.event && (
                        <EventCard
                          key={rsvp.event._id || index}
                          event={rsvp.event}
                          showActions={false}
                          userId={userId}
                          userRsvp={rsvp}
                          onRsvpChange={fetchEventsAndRsvps}
                        />
                      )
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
      
      {/* Dev link — remove before submission
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <Link to="/admin" style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>→ Admin Page (dev)</Link>
      </div>
      */}
    </div>
  );
}

export default UserPage