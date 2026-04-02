import './UserPage.css'
import { Link } from "react-router-dom";
import { events } from "./events";
import { useState } from "react";

function EventCard({ event, showActions }) {
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
          <span>📍 Location TBD</span>
        </div>
      </div>

      <div className="event-card-description">
        <p>{event.description}</p>
        <p style={{ marginTop: '0.4rem', fontSize: '0.78rem' }}>
          RSVPs: {event.rsvps.join(", ") || "None yet"}
        </p>
      </div>

      <div className="event-card-actions" onClick={e => e.stopPropagation()}>
        <button className="btn-rsvp">Yes</button>
        <button className="btn-rsvp">No</button>
        {showActions && (
          <>
            <button className="btn-edit">Edit</button>
            <button className="btn-delete">Delete</button>
          </>
        )}
      </div>
    </div>
  );
}

function UserPage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="page-wrapper">
      <header className="site-header">
        <span className="logo">Event Board</span>
        <div className="header-right">
          <span className="header-username">Welcome, User</span>
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
        {activeTab === 'all' && (
          <>
            <div className="content-header">
              <h2>All Events</h2>
            </div>
            <div className="events-grid">
              {events.map((event, index) => (
                <EventCard key={index} event={event} showActions={false} />
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
                <EventCard key={index} event={event} showActions={true} />
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
              <span style={{ fontSize: '0.85rem' }}>Go to All Events and hit Yes on events you want to attend</span>
            </div>
          </>
        )}
      </main>

      {/* Dev link — remove before submission */}
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <Link to="/admin" style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>→ Admin Page (dev)</Link>
      </div>
    </div>
  );
}

export default UserPage