import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar bg-dark">
      <h1>
        <Link to="/"><i className="fas fa-code"></i> DevSociety</Link>
      </h1>
      <ul>
      <li><Link to="/profiles">Developers</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
      </ul>
    </div>
  )
}

export default Navbar;
