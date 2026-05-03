import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Conecta Familia</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/simulator">Simulador</Link></li>
        <li><Link to="/challenges">Retos</Link></li>
        <li><Link to="/forum">Foro</Link></li>
        <li><Link to="/auth" className="btn-login">Ingresar</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
