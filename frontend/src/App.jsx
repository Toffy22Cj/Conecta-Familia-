import { useState, useEffect } from "react";
import {
  HeartHandshake,
  ArrowRight,
  Menu,
  Users,
  Mail,
  Lock,
  ShieldCheck,
  Heart,
  BrainCircuit,
} from "lucide-react";
import "./App.css";
import heroImg from "./assets/hero_family.png";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import TermsAndConditions from "./components/TermsAndConditions";
import Footer from "./components/Footer";
import { authService } from "./services/api";

function App() {
  const [currentView, setCurrentView] = useState("loading"); // Start with loading

  const handleNavigate = (view, e) => {
    if (e) e.preventDefault();
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuth = () => {
    setCurrentView("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await authService.getMe();
          setCurrentView("dashboard");
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setCurrentView("home");
        }
      } else {
        setCurrentView("home");
      }
    };
    checkAuth();
  }, []);

  // Renderizar el contenido principal según la vista actual
  const renderContent = () => {
    switch (currentView) {
      case "loading":
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <div>Cargando...</div>
          </div>
        );
      case "login":
        return <Login onNavigate={handleNavigate} onAuth={handleAuth} />;

      case "register":
        return <Register onNavigate={handleNavigate} onAuth={handleAuth} />;

      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />;

      case "terms":
        return <TermsAndConditions onNavigate={handleNavigate} />;

      case "home":
      default:
        return (
          <>
            <main id="como-funciona" className="hero-section">
              <div className="hero-content">
                <span className="badge">Plataforma de Apoyo Familiar</span>
                <h1 className="hero-title">
                  Acompañando a tu familia en cada{" "}
                  <span className="text-gradient">paso del camino</span>
                </h1>
                <p className="hero-subtitle">
                  Entendemos que los cambios son difíciles. Conecta Familia te
                  brinda herramientas interactivas, diagnósticos y una comunidad
                  segura para fortalecer los lazos familiares durante los
                  procesos de transición.
                </p>

                <div className="hero-actions">
                  <button
                    className="btn-primary"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                    onClick={(e) => handleNavigate("register", e)}
                  >
                    Comenzar Prueba Gratis <ArrowRight size={20} />
                  </button>
                  <button
                    className="btn-outline"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Users size={20} /> Conoce a la Comunidad
                  </button>
                </div>
              </div>

              <div className="hero-visual">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="hero-image-wrapper">
                  <img
                    src={heroImg}
                    alt="Familia conectada"
                    className="hero-image"
                  />
                </div>
              </div>
            </main>

            {/* Benefits Section */}
            <section id="beneficios" className="benefits-section">
              <div className="benefits-header">
                <span className="badge" style={{ marginBottom: "1rem" }}>
                  Por qué elegirnos
                </span>
                <h2>Todo lo que necesitas para tu bienestar familiar</h2>
                <p>
                  Nuestra plataforma SaaS está diseñada específicamente para
                  darte soporte en cada aspecto de tu proceso.
                </p>
              </div>

              <div className="benefits-grid">
                <div className="benefit-card glass-panel">
                  <div
                    className="icon-wrapper"
                    style={{
                      background: "rgba(79, 70, 229, 0.1)",
                      color: "var(--primary)",
                    }}
                  >
                    <BrainCircuit size={28} />
                  </div>
                  <h3>Diagnóstico Inteligente</h3>
                  <p>
                    Realiza autoevaluaciones periódicas diseñadas por expertos
                    para identificar áreas de atención prioritarias en el núcleo
                    familiar.
                  </p>
                </div>

                <div className="benefit-card glass-panel">
                  <div
                    className="icon-wrapper"
                    style={{
                      background: "rgba(147, 51, 234, 0.1)",
                      color: "var(--secondary)",
                    }}
                  >
                    <Heart size={28} />
                  </div>
                  <h3>Bienestar Emocional</h3>
                  <p>
                    Accede a retos semanales y ejercicios guiados que fomentan
                    la empatía, la comunicación asertiva y el entendimiento
                    mutuo.
                  </p>
                </div>

                <div className="benefit-card glass-panel">
                  <div
                    className="icon-wrapper"
                    style={{
                      background: "rgba(244, 114, 182, 0.1)",
                      color: "var(--accent)",
                    }}
                  >
                    <ShieldCheck size={28} />
                  </div>
                  <h3>Comunidad Segura</h3>
                  <p>
                    Conecta de forma estructurada con otras familias que
                    atraviesan procesos similares en un entorno completamente
                    privado y moderado.
                  </p>
                </div>
              </div>
            </section>

            {/* Community Section */}
            <section id="comunidad" className="community-section">
              <div className="community-content glass-panel">
                <div className="community-text">
                  <span className="badge">Foro Confidencial</span>
                  <h2>No estás solo en este proceso</h2>
                  <p>
                    Nuestra comunidad te permite interactuar y aprender de otras
                    familias. Participa en debates diarios, comparte tus logros
                    y recibe ánimos de personas que realmente te entienden.
                  </p>
                  <button
                    className="btn-primary"
                    style={{ marginTop: "1.5rem" }}
                  >
                    Únete al Foro Público
                  </button>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  // Solo mostrar navbar en home (Login y Register tienen su propio botón "Volver")
  const showNavbar = currentView === "home";

  // Dashboard, Login, Register y Terms se renderizan fuera del container para ocupar todo el ancho
  if (
    currentView === "dashboard" ||
    currentView === "login" ||
    currentView === "register" ||
    currentView === "terms" ||
    currentView === "loading"
  ) {
    return renderContent();
  }

  const scrollToSection = (sectionId, e) => {
    if (e) e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Navigation — full width, fija arriba */}
      {showNavbar && (
        <nav className="navbar-fixed glass-panel">
          <div className="navbar-inner">
            <div
              className="nav-brand"
              style={{ cursor: "pointer" }}
              onClick={(e) => handleNavigate("home", e)}
            >
              <HeartHandshake className="nav-logo-icon" size={33} />
              <span>Conecta Familia</span>
            </div>

            <div className="nav-links">
              <a
                href="#como-funciona"
                className="nav-item"
                onClick={(e) => scrollToSection("como-funciona", e)}
              >
                Cómo Funciona
              </a>
              <a
                href="#beneficios"
                className="nav-item"
                onClick={(e) => scrollToSection("beneficios", e)}
              >
                Beneficios
              </a>
              <a
                href="#comunidad"
                className="nav-item"
                onClick={(e) => scrollToSection("comunidad", e)}
              >
                Comunidad
              </a>
            </div>

            <div className="nav-actions">
              <button
                className="btn-primary"
                onClick={(e) => handleNavigate("login", e)}
              >
                Iniciar Sesión
              </button>
              <button className="btn-menu" style={{ display: "none" }}>
                <Menu size={24} />
              </button>
            </div>
          </div>
        </nav>
      )}

      <div className="container" style={{ paddingTop: "5rem" }}>
        {/* Main Content Area */}
        {renderContent()}
      </div>

      {showNavbar && <Footer onNavigate={handleNavigate} />}
    </>
  );
}

export default App;
