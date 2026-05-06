import React from 'react';
import { HeartHandshake } from 'lucide-react';

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
          <h3>Desarrolladores</h3>
          <ul>
            <li><a href="mailto:ronnycaraballo46@gmail.com">ronnycaraballo46@gmail.com</a></li>
            <li><a href="mailto:cjpp12220@gmail.com">cjpp12220@gmail.com</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Especialistas</h3>
          <ul>
            <li>+57 321 4986917 • Lilimar</li>
            <li>+57 321 3032574 • Emely</li>
            <li>+57 301 3715894 • Nellys</li>
            <li>+57 312 4859120 • Rosa</li>
          </ul>
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
