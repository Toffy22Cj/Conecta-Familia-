import React from 'react';
import { Link } from 'react-router-dom';

const AuthPage = () => {
  return (
    <div className="auth-page">
      <h2>Inicia Sesión o Regístrate</h2>
      {/* Formulario temporal */}
      <form>
        <input type="email" placeholder="Correo electrónico" />
        <input type="password" placeholder="Contraseña" />
        <button type="button">Ingresar</button>
      </form>
      <br/>
      <Link to="/diagnostic">Ir al Diagnóstico (Prueba temporal)</Link>
    </div>
  );
};

export default AuthPage;
