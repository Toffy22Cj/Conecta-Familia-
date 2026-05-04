# Conecta Familia

Este documento detalla la hoja de ruta técnica y operativa para el desarrollo del ecosistema digital **Conecta Familia**.

## 1. Stack Tecnológico Seleccionado

Para garantizar eficiencia y escalabilidad en un entorno universitario:

- **Backend:** Java 21 con Spring Boot (Monolito Modular).
- **Bases de Datos:**
  - **MariaDB:** Usuarios, suscripciones, agenda y seguridad.
  - **MongoDB:** Resultados de diagnósticos, logs de simuladores y retos.
- **Frontend:**
  - **Web:** React.js (Landing page comercial y administración).
  - **Móvil:** React Native (Interacción diaria, simuladores y retos).(esto para luego)
- **Infraestructura:** Docker & Docker Compose para contenedores locales.
- **Nota:** `docker-compose.yml` incluye servicios de MongoDB y MariaDB para alinear la infraestructura con la arquitectura descrita.

## 2. Módulos Críticos del MVP

Basado en los prototipos funcionales:

1.  **Módulo de Autenticación:** Login y registro con roles (Padre, Institución, Admin).
2.  **Ruta de Atención (Web):** Formulario de ingreso y captación de clientes.
3.  **Diagnóstico Familiar (App):** Cuestionario interactivo con lógica de puntaje.
4.  **Simulador de Conflictos (App):** Sistema de "elige tu propia aventura" para práctica de escucha activa.
5.  **Retos Semanales:** Notificaciones y seguimiento de actividades sugeridas.

## 3. Hoja de Ruta (Roadmap)

### Fase 1: Cimiento Técnico (Semanas 1-2)

- Configuración de `docker-compose.yml` (MariaDB, MongoDB).
- Estructura base de Spring Boot con Spring Security (JWT).
- Modelado de tablas de usuarios y roles en MariaDB.

### Fase 2: Interfaz Web y Captación (Semanas 3-4)

- Desarrollo de la Landing Page en React.
- Implementación del Formulario de Ingreso (Ruta de Atención).
- Conexión de formularios con el Backend.

### Fase 3: Interacción Móvil (Semanas 5-8)

- Configuración del entorno React Native.
- Módulo de Diagnóstico inicial (consumiendo datos de MongoDB).
- Implementación del Simulador de Conflictos con guiones estáticos.
