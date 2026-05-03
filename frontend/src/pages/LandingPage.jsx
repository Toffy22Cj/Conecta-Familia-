import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="page-container hero-section">
      <div className="hero-content">
        <h1>Conectando Corazones, Fortaleciendo Familias</h1>
        <p className="hero-subtitle">
          La primera plataforma integral de orientación psicopedagógica y resolución de conflictos familiares potenciada por tecnología.
        </p>
        <div className="hero-btns">
          <Link to="/auth" className="btn-primary-large">Comenzar Ahora</Link>
          <Link to="/about" className="btn-secondary-large">Saber Más</Link>
        </div>
      </div>
      
      <div className="hero-visual">
        <div className="abstract-shape"></div>
      </div>
      
      <style>{`
        .hero-section {
          display: flex;
          align-items: center;
          min-height: 80vh;
          gap: 50px;
        }
        .hero-content {
          flex: 1;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--gray);
          margin-bottom: 40px;
          max-width: 600px;
        }
        .hero-btns {
          display: flex;
          gap: 20px;
        }
        .btn-primary-large {
          background: var(--primary);
          color: white;
          padding: 18px 36px;
          border-radius: 16px;
          text-decoration: none;
          font-weight: 700;
          transition: transform 0.3s;
        }
        .btn-secondary-large {
          background: white;
          color: var(--dark);
          padding: 18px 36px;
          border-radius: 16px;
          text-decoration: none;
          font-weight: 700;
          border: 1px solid #e2e8f0;
          transition: background 0.3s;
        }
        .btn-primary-large:hover { transform: scale(1.05); }
        .btn-secondary-large:hover { background: #f1f5f9; }
        
        .hero-visual {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        .abstract-shape {
          width: 400px;
          height: 400px;
          background: linear-gradient(45deg, var(--primary), var(--secondary));
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          filter: blur(40px);
          opacity: 0.2;
          animation: morph 10s infinite alternate;
        }
        
        @keyframes morph {
          0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          100% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
