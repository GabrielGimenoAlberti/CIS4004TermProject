import './RegisterPage.css'
/*if you want to make things easier, you can just link it to the login page. for now i have both -rowan*/
import {Link} from "react-router-dom";

/*temporary link for ease of access during development at line 26 -rowan*/

function RegisterPage() {
  return (
    <>
    <div id = "titles">
      <h1 id = "events">Event Board</h1>
      <h2 id = "subtitle">Browse, Create, and Join Events</h2>
    </div>

    <div id= "Login Credentials">
      <h1>Login</h1>
      <label for="username">Username</label>
      <input type="text" placeholder="Enter Username" name="username" required></input>
      <label for="password">Password</label>
      <input type="text" placeholder="Enter Password" name="password" required></input>
      <br></br><button type="submit">Login</button>

      <br></br><Link to="/">Login Instead</Link><br></br>
    </div>
      
    <Link to="/user">Go to User Page</Link>
    <Link to="/admin">Go to Admin Page</Link>
    </>
  )
}

export default RegisterPage