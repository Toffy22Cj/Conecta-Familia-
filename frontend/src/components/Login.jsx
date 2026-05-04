import { useState } from 'react';
import { HeartHandshake, ArrowLeft, ShieldCheck, Heart, Eye, Loader2 } from 'lucide-react';
import { authService } from '../services/api';

function Login({ onNavigate, onAuth }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validaciones de frontend
    if (!formData.email.includes('@')) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }
    if (formData.password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authService.login(formData);
      onAuth(); 
    } catch (err) {
      console.error(err);
      if (err.response) {
        if (err.response.status === 401) setError('Correo o contraseña incorrectos.');
        else if (err.response.status === 500) setError('Error en el servidor. Inténtalo más tarde.');
        else setError('Error al conectar con el servidor.');
      } else {
        setError('No se pudo establecer conexión con el backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-section-split">
      <div className="auth-split-wrapper">
        <button className="back-button" onClick={(e) => onNavigate('home', e)}>
          <ArrowLeft size={18} /> Volver al inicio
        </button>

        <div className="auth-split-card glass-panel">
          <div className="auth-info-panel">
            <h2>Comienza tu proceso<br/>de cambio con tu<br/>familia</h2>
            <p>Únete a cientos de familias que ya<br/>fortalecen sus vínculos día a día.</p>
            <div className="auth-badges-container">
              <div className="auth-badge badge-green"><ShieldCheck size={16} /> COMUNIDAD SEGURA</div>
              <div className="auth-badge badge-white"><Heart size={16} /> ACOMPAÑAMIENTO PROFESIONAL</div>
            </div>
          </div>

          <div className="auth-form-panel">
            <div className="auth-form-header">
              <div className="auth-brand">
                <HeartHandshake className="nav-logo-icon" size={24} />
                <span>Conecta Familia</span>
              </div>
              <h3>Iniciar Sesión</h3>
              <p>Ingresa a tu panel familiar</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <div className="auth-error-msg" style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>{error}</div>}
              <div className="form-group">
                <label>Correo Electrónico</label>
                <div className="input-wrapper">
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="tu@correo.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <div className="input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-control" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <button type="button" className="icon-btn-right" onClick={() => setShowPassword(!showPassword)}>
                    <Eye size={20} />
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary auth-submit" style={{ marginTop: '1rem' }} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Ingresar al Panel'}
              </button>
            </form>
            <div className="auth-footer-split">
              <p>¿No tienes cuenta? <a href="#registro" className="auth-link" onClick={(e) => onNavigate('register', e)}>Regístrate aquí</a></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
