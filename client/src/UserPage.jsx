import './UserPage.css'
import {Link} from "react-router-dom";
import {events} from "./events";

function UserPage() {
  return (
    <>
    
    <h1>Event Board</h1>

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

      <Link to="/">Go to Login Page</Link>
      <Link to="/admin">Go to Admin Page</Link>
    </>
  );
}

export default UserPage