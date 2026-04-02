import './UserPage.css'
import './AdminPage.css'
import { Link } from "react-router-dom";
import { events } from "./events";
import { useState } from "react";

const mockUsers = [
  { id: 1, username: "alice", role: "user" },
  { id: 2, username: "bob", role: "user" },
  { id: 3, username: "admin", role: "admin" },
];

function EventCard({ event }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`event-card ${expanded ? 'expanded' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="event-card-top">
        <span className="event-card-category">Event</span>
        <h3>{event.title}</h3>
        <div className="event-card-meta">
          <span>📅 {event.date}</span>
        </div>
      </div>
      <div className="event-card-description">
        <p>{event.description}</p>
      </div>
      <div className="event-card-actions" onClick={e => e.stopPropagation()}>
        <button className="btn-edit">Edit</button>
        <button className="btn-delete">Delete</button>
      </div>
    </div>
  );
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="page-wrapper">
      <header className="site-header">
        <span className="logo">Event Board</span>
        <div className="header-right">
          <span className="header-username">
            Admin <span className="admin-badge">Admin</span>
          </span>
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
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >Admin Dashboard</button>
      </nav>

      <main className="page-content">
        {activeTab === 'all' && (
          <>
            <div className="content-header">
              <h2>All Events</h2>
            </div>
            <div className="events-grid">
              {events.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          </>
        )}

        {activeTab === 'mine' && (
          <>
            <div className="content-header">
              <h2>My Events</h2>
              <button className="btn-create">+ Create Event</button>
            </div>
            <div className="events-grid">
              {events.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          </>
        )}

        {activeTab === 'rsvps' && (
          <>
            <div className="content-header">
              <h2>My RSVPs</h2>
            </div>
            <div className="empty-state">
              <p>No RSVPs yet</p>
            </div>
          </>
        )}

        {activeTab === 'dashboard' && (
          <>
            <div className="content-header">
              <h2>Admin Dashboard</h2>
            </div>

            <div className="admin-section">
              <div className="admin-section-title">All Users</div>
              {mockUsers.map(user => (
                <div key={user.id} className="user-card">
                  <div className="user-card-info">
                    <span className="user-card-name">{user.username}</span>
                    <span className="user-card-role">{user.role}</span>
                  </div>
                  <div className="user-card-actions">
                    <button className="btn-edit">Edit</button>
                    <button className="btn-delete">Delete</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-section">
              <div className="admin-section-title">All Events</div>
              <div className="events-grid">
                {events.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Dev link — remove before submission */}
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <Link to="/user" style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>→ User Page (dev)</Link>
      </div>
    </div>
  );
}

export default AdminPage