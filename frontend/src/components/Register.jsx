import { useState } from 'react';
import { HeartHandshake, Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import { authService } from '../services/api';

function Register({ onNavigate, onAuth }) {
  const [formData, setFormData] = useState({ nombres: '', apellidos: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validaciones de frontend
    if (!formData.nombres.trim() || !formData.apellidos.trim()) {
      setError('Nombre y apellidos son obligatorios.');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload = {
        nombre: `${formData.nombres.trim()} ${formData.apellidos.trim()}`,
        email: formData.email,
        password: formData.password
      };
      await authService.register(payload);
      // Tras registro exitoso, solemos pedir login o loguear auto
      alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      onNavigate('login');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) setError('Este correo ya está registrado.');
        else setError('Error en el servidor al registrarse.');
      } else {
        setError('Sin conexión con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <button className="back-button" onClick={(e) => onNavigate('home', e)} style={{ alignSelf: 'flex-start', marginLeft: '10%', marginBottom: '1rem', position: 'relative', zIndex: 10 }}>
        <ArrowLeft size={18} /> Volver al inicio
      </button>

      <div className="auth-card glass-panel">
        <div className="auth-header">
          <HeartHandshake className="nav-logo-icon" size={48} />
          <h2>Crea tu cuenta</h2>
          <p>Únete a nuestra comunidad de apoyo familiar</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error-msg" style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>{error}</div>}
          <div className="form-group">
            <label>Nombres</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ej: Juan" 
                value={formData.nombres} 
                onChange={e => setFormData({...formData, nombres: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Apellidos</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ej: Pérez" 
                value={formData.apellidos} 
                onChange={e => setFormData({...formData, apellidos: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                className="form-control" 
                placeholder="tu@correo.com" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Registrarse'}
          </button>
        </form>

        <div className="auth-footer">
          <p>¿Ya tienes una cuenta? <a href="#login" className="auth-link" onClick={(e) => onNavigate('login', e)}>Inicia sesión aquí</a></p>
        </div>
      </div>
    </main>
  );
}

export default Register;
