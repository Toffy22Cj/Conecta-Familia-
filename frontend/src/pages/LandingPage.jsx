import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Bienvenido a Conecta Familia</h1>
      <p>Fortalece las habilidades parentales y mejora la convivencia en tu hogar.</p>
      <div className="actions">
        <Link to="/auth" className="btn">Ingresar / Registrarse</Link>
      </div>
    </div>
  );
};

export default LandingPage;
