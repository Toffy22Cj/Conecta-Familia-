# Conecta Familia

Este documento detalla la hoja de ruta técnica y operativa para el desarrollo del ecosistema digital **Conecta Familia**.

## 1. Stack Tecnológico Seleccionado

Para garantizar eficiencia y escalabilidad en un entorno universitario:

- **Backend:** Java 21 con Spring Boot (Monolito Modular).
- **Bases de Datos:**
  - **MariaDB:** Usuarios, suscripciones, agenda, seguridad, diagnósticos, simuladores, retos y foro.
- **Frontend:**
  - **Web:** React.js (Landing page comercial y administración).
- **Móvil:** React Native (Interacción diaria, simuladores y retos).(esto para luego)
- **Infraestructura:** Docker & Docker Compose para contenedores locales.
- **Nota:** `docker-compose.yml` incluye solo MariaDB como base de datos local.

## 2. Módulos Críticos del MVP

Basado en los prototipos funcionales:

1.  **Módulo de Autenticación:** Login y registro con roles (Padre, Institución, Admin).
2.  **Ruta de Atención (Web):** Formulario de ingreso y captación de clientes.
3.  **Diagnóstico Familiar (App):** Cuestionario interactivo con lógica de puntaje.
4.  **Simulador de Conflictos (App):** Sistema de "elige tu propia aventura" para práctica de escucha activa.
5.  **Retos Semanales:** Notificaciones y seguimiento de actividades sugeridas.

## 3. Hoja de Ruta (Roadmap)

### Fase 1: Cimiento Técnico (Semanas 1-2)

- Configuración de `docker-compose.yml` (MariaDB).
- Estructura base de Spring Boot con Spring Security (JWT).
- Modelado de tablas de usuarios y roles en MariaDB.

### Fase 2: Interfaz Web y Captación (Semanas 3-4)

- Desarrollo de la Landing Page en React.
- Implementación del Formulario de Ingreso (Ruta de Atención).
- Conexión de formularios con el Backend.

### Fase 3: Interacción Móvil (Semanas 5-8)

- Configuración del entorno React Native.
- Módulo de Diagnóstico inicial (consumiendo datos desde MariaDB).
- Implementación del Simulador de Conflictos con guiones estáticos.
  ¿Cómo probarlo ahora?
  Para ver la app en tu teléfono o emulador:

Abre una terminal y entra en la carpeta: cd mobile.
Inicia el servidor de desarrollo: npx expo start.
Escanea el código QR con la app Expo Go (disponible en Play Store/App Store).
TIP

Para que el móvil se conecte a tu backend local, recuerda que ambos deben estar en la misma red Wi-Fi. He configurado api.js para usar la IP del emulador por defecto, pero si usas un teléfono real, deberás poner la IP de tu PC en ese archivo.

Puedes ver el detalle de todos los archivos creados en el
walkthrough.md
.
