import React from 'react';
import { ArrowLeft } from 'lucide-react';

const TermsAndConditions = ({ onNavigate }) => {
  return (
    <div className="terms-page">
      <div className="terms-header">
        <button
          className="btn-back"
          onClick={(e) => onNavigate('home', e)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}
        >
          <ArrowLeft size={20} />
          Volver al Inicio
        </button>
        <h1>Términos y Condiciones</h1>
        <p className="terms-date">Última actualización: 4 de mayo de 2026</p>
      </div>

      <div className="terms-content glass-panel">
        <section>
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar la plataforma Conecta Familia, aceptas estar sujeto a estos términos y condiciones.
            Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.
          </p>
        </section>

        <section>
          <h2>2. Descripción del Servicio</h2>
          <p>
            Conecta Familia es una plataforma SaaS diseñada para proporcionar apoyo emocional y herramientas
            interactivas a familias durante procesos de transición. Ofrecemos diagnósticos, retos semanales,
            foros comunitarios y conexiones con especialistas.
          </p>
        </section>

        <section>
          <h2>3. Uso Aceptable</h2>
          <p>
            Te comprometes a utilizar la plataforma de manera responsable y respetuosa. No está permitido:
          </p>
          <ul>
            <li>Publicar contenido ofensivo, discriminatorio o ilegal</li>
            <li>Compartir información personal de terceros sin consentimiento</li>
            <li>Intentar acceder a sistemas no autorizados</li>
            <li>Utilizar la plataforma para fines comerciales sin autorización</li>
          </ul>
        </section>

        <section>
          <h2>4. Privacidad y Protección de Datos</h2>
          <p>
            Tu privacidad es importante para nosotros. Recopilamos y procesamos datos personales de acuerdo
            con nuestra Política de Privacidad. Todos los datos están protegidos y se utilizan únicamente
            para mejorar tu experiencia en la plataforma.
          </p>
        </section>

        <section>
          <h2>5. Propiedad Intelectual</h2>
          <p>
            Todo el contenido de la plataforma, incluyendo textos, gráficos, logos y software, está protegido
            por derechos de autor y otras leyes de propiedad intelectual. No puedes copiar, distribuir o
            modificar este contenido sin autorización expresa.
          </p>
        </section>

        <section>
          <h2>6. Limitación de Responsabilidad</h2>
          <p>
            Conecta Familia proporciona información y herramientas de apoyo, pero no reemplaza el consejo
            profesional de terapeutas o especialistas médicos. No somos responsables por decisiones tomadas
            basadas en el uso de nuestra plataforma.
          </p>
        </section>

        <section>
          <h2>7. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán
            efectivos inmediatamente después de su publicación en la plataforma.
          </p>
        </section>

        <section>
          <h2>8. Contacto</h2>
          <p>
            Si tienes preguntas sobre estos términos, puedes contactarnos a través de:
          </p>
          <ul>
            <li>Email: soporte@conectafamilia.com</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
