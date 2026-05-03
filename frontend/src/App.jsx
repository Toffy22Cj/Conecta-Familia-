import { useState } from 'react';
import { HeartHandshake, ArrowRight, Menu, Users, Mail, Lock, ShieldCheck, Heart, BrainCircuit, MessageCircle, Star } from 'lucide-react';
import './App.css';
import heroImg from './assets/hero_family.png';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const handleNavigate = (view, e) => {
    if (e) e.preventDefault();
    setCurrentView(view);
  };

  return (
    <div className="container">
      {/* Navigation */}
      <nav className="navbar glass-panel" style={{ marginTop: '1rem', padding: '1rem 2rem' }}>
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={(e) => handleNavigate('home', e)}>
          <HeartHandshake className="nav-logo-icon" size={33} />
          <span>Conecta Familia</span>
        </div>

        <div className="nav-links">
          <a href="#como-funciona" className="nav-item" onClick={(e) => handleNavigate('home', e)}>Cómo Funciona</a>
          <a href="#beneficios" className="nav-item" onClick={(e) => handleNavigate('home', e)}>Beneficios</a>
          <a href="#comunidad" className="nav-item" onClick={(e) => handleNavigate('home', e)}>Comunidad</a>

        </div>

        <div className="nav-actions">
          <button className="btn-outline" style={{ display: 'none' }}>Iniciar Sesión</button>
          <button className="btn-primary" style={{ marginLeft: '1rem' }}>Regístrate</button>
          <button className="btn-menu" style={{ display: 'none' }}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      {currentView === 'home' ? (
        <>
          <main className="hero-section">
            <div className="hero-content">
              <span className="badge">Plataforma de Apoyo Familiar</span>
              <h1 className="hero-title">
                Acompañando a tu familia en cada <span className="text-gradient">paso del camino</span>
              </h1>
              <p className="hero-subtitle">
                Entendemos que los cambios son difíciles. Conecta Familia te brinda herramientas interactivas,
                diagnósticos y una comunidad segura para fortalecer los lazos familiares durante los procesos de transición.
              </p>

              <div className="hero-actions">
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Comenzar Prueba Gratis <ArrowRight size={20} />
                </button>
                <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={20} /> Conoce a la Comunidad
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="blob blob-1"></div>
              <div className="blob blob-2"></div>
              <div className="hero-image-wrapper">
                <img src={heroImg} alt="Familia conectada" className="hero-image" />
              </div>
            </div>
          </main>

          {/* Benefits Section */}
          <section id="beneficios" className="benefits-section">
            <div className="benefits-header">
              <span className="badge" style={{ marginBottom: '1rem' }}>Por qué elegirnos</span>
              <h2>Todo lo que necesitas para tu bienestar familiar</h2>
              <p>Nuestra plataforma SaaS está diseñada específicamente para darte soporte en cada aspecto de tu proceso.</p>
            </div>

            <div className="benefits-grid">
              <div className="benefit-card glass-panel">
                <div className="icon-wrapper" style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>
                  <BrainCircuit size={28} />
                </div>
                <h3>Diagnóstico Inteligente</h3>
                <p>Realiza autoevaluaciones periódicas diseñadas por expertos para identificar áreas de atención prioritarias en el núcleo familiar.</p>
              </div>

              <div className="benefit-card glass-panel">
                <div className="icon-wrapper" style={{ background: 'rgba(147, 51, 234, 0.1)', color: 'var(--secondary)' }}>
                  <Heart size={28} />
                </div>
                <h3>Bienestar Emocional</h3>
                <p>Accede a retos semanales y ejercicios guiados que fomentan la empatía, la comunicación asertiva y el entendimiento mutuo.</p>
              </div>

              <div className="benefit-card glass-panel">
                <div className="icon-wrapper" style={{ background: 'rgba(244, 114, 182, 0.1)', color: 'var(--accent)' }}>
                  <ShieldCheck size={28} />
                </div>
                <h3>Comunidad Segura</h3>
                <p>Conecta de forma estructurada con otras familias que atraviesan procesos similares en un entorno completamente privado y moderado.</p>
              </div>
            </div>
          </section>

          {/* Community Section */}
          <section id="comunidad" className="community-section">
            <div className="community-content glass-panel">
              <div className="community-text">
                <span className="badge">Foro Confidencial</span>
                <h2>No estás solo en este proceso</h2>
                <p>Nuestra comunidad te permite interactuar y aprender de otras familias. Participa en debates diarios, comparte tus logros y recibe ánimos de personas que realmente te entienden.</p>
                <div className="community-stats">
                  <div className="stat-item">
                    <MessageCircle className="stat-icon" size={24} />
                    <strong>+2,000</strong>
                    <span>Mensajes</span>
                  </div>
                  <div className="stat-item">
                    <Star className="stat-icon" size={24} />
                    <strong>4.9/5</strong>
                    <span>Valoración</span>
                  </div>
                </div>
                <button className="btn-primary" style={{ marginTop: '1.5rem' }}>Únete al Foro Público</button>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Login Section */
        <main className="auth-section">
          <div className="blob blob-1" style={{ top: '-10%', right: '20%' }}></div>
          <div className="blob blob-2" style={{ bottom: '-10%', left: '20%' }}></div>

          <div className="auth-card glass-panel">
            <div className="auth-header">
              <HeartHandshake className="nav-logo-icon" size={48} />
              <h2>Bienvenido de nuevo</h2>
              <p>Ingresa tus datos para continuar</p>
            </div>

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input type="email" className="form-control" placeholder="tu@correo.com" />
                </div>
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input type="password" className="form-control" placeholder="••••••••" />
                </div>
                <a href="#recuperar" className="auth-link-forgot">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" className="btn-primary auth-submit" onClick={(e) => e.preventDefault()}>
                Ingresar
              </button>
            </form>

            <div className="auth-footer">
              <p>¿No tienes una cuenta? <a href="#registro" className="auth-link">Regístrate aquí</a></p>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
export default App;
