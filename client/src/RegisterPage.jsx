import './RegisterPage.css'
import './LoginPage.css'
import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1>Event <span>Board</span></h1>
        <p>Browse, Create, and Join Events</p>
      </div>

      <div className="auth-card">
        <h2>Register</h2>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" placeholder="Enter username" name="username" required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter password" name="password" required />
        </div>

        <button className="auth-submit" type="submit">Submit</button>
        <Link className="auth-switch" to="/">Login Instead</Link>
      </div>

      {/* Dev links — remove before final submission */}
      <div className="dev-links">
        <Link to="/user">→ User Page</Link>
        <Link to="/admin">→ Admin Page</Link>
      </div>
    </div>
  );
}

export default RegisterPage