import './LoginPage.css';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await axios.post("/api/users/login", { email, password });
      setSuccess(res.data.message || "Login successful!");
      // Store user ID, name, and role in localStorage for later use
      if (res.data.user && res.data.user._id) {
        window.localStorage.setItem('userId', res.data.user._id);
        window.localStorage.setItem('userName', res.data.user.name);
        window.localStorage.setItem('userRole', res.data.user.role);
      }
      setTimeout(() => {
        const role = res.data.user?.role;
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1>Event <span>Board</span></h1>
        <p>Browse, Create, and Join Events</p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter email" name="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter password" name="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        <button className="auth-submit" type="submit">Submit</button>
        <Link className="auth-switch" to="/register">Register Instead</Link>
      </form>

    </div>
  );
}

export default LoginPage;