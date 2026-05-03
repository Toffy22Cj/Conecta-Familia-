import React from 'react';

const Dashboard = () => {
  return (
    <div className="page-container">
      <h1>Panel de Control</h1>
      <p>Bienvenido a tu espacio de crecimiento familiar.</p>
      
      <div className="dashboard-grid">
        <div className="card">
          <h3>Simulador de Conflictos</h3>
          <p>Practica situaciones reales y mejora tu comunicación.</p>
          <button className="btn-primary">Ir al Simulador</button>
        </div>
        
        <div className="card">
          <h3>Retos Familiares</h3>
          <p>Completa actividades semanales para fortalecer vínculos.</p>
          <button className="btn-primary">Ver Retos</button>
        </div>
        
        <div className="card">
          <h3>Comunidad / Foro</h3>
          <p>Comparte experiencias y recibe consejos de otros padres.</p>
          <button className="btn-primary">Entrar al Foro</button>
        </div>
        
        <div className="card">
          <h3>Agenda de Citas</h3>
          <p>Coordina sesiones con especialistas psicopedagógicos.</p>
          <button className="btn-primary">Agendar Cita</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
