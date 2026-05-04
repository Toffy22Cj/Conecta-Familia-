import React from 'react';
import { HeartHandshake, Mail, Phone, MapPin } from 'lucide-react';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <HeartHandshake size={32} />
            <span>Conecta Familia</span>
          </div>
          <p>
            Acompañando a tu familia en cada paso del camino. Herramientas interactivas,
            diagnósticos y una comunidad segura para fortalecer los lazos familiares.
          </p>
        </div>

        <div className="footer-section">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><a href="#como-funciona" onClick={(e) => { e.preventDefault(); document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' }); }}>Cómo Funciona</a></li>
            <li><a href="#beneficios" onClick={(e) => { e.preventDefault(); document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' }); }}>Beneficios</a></li>
            <li><a href="#comunidad" onClick={(e) => { e.preventDefault(); document.getElementById('comunidad')?.scrollIntoView({ behavior: 'smooth' }); }}>Comunidad</a></li>
            <li><a href="#" onClick={(e) => onNavigate('terms', e)}>Términos y Condiciones</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contacto</h3>
          <div className="contact-info">
            <div className="contact-item">
              <Mail size={18} />
              <span>soporte@conectafamilia.com</span>
            </div>
            <div className="contact-item">
              <Phone size={18} />
              <span>+57 123 456 7890</span>
            </div>
            <div className="contact-item">
              <MapPin size={18} />
              <span>Bogotá, Colombia</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3>Síguenos</h3>
          <div className="social-links">
            <a href="#" className="social-link">Facebook</a>
            <a href="#" className="social-link">Instagram</a>
            <a href="#" className="social-link">Twitter</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Conecta Familia. Todos los derechos reservados.</p>
        <div className="footer-bottom-links">
          <a href="#" onClick={(e) => onNavigate('terms', e)}>Términos y Condiciones</a>
          <a href="#">Política de Privacidad</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;