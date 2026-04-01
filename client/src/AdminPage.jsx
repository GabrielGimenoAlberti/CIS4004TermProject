import './UserPage.css'
import {Link} from "react-router-dom";
import {events} from "./events";

function AdminPage() {
  return (
    <>
    <h1>Event Board</h1>

    <div id = "adminTools">
        <button>Change an Event Date</button>
        <button>Change an Event Name</button>
        <button>Delete an Event</button>
    </div>

    <div id = "events">
    {events.map((event, index) => (
        <div key={index}>
          <h2>{event.title}</h2>
          <p>{event.date}</p>
          <p>{event.description}</p>
          <p>RSVPs: {event.rsvps.join(", ")}</p>
          <button>RSVP</button>
        </div>
      ))}
    </div>

    <Link to="/user">Go to User Page</Link>
    <Link to="/">Go to Login Page</Link>
    </>
  );
}

export default AdminPage