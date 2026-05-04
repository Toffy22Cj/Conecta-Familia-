import { useState, useEffect } from "react";
import {
  Smile,
  Meh,
  Frown,
  CheckCircle,
  MessageSquare,
  Menu,
  X,
  Home,
  Target,
  MessageCircle,
  Calendar,
  Settings,
  LogOut,
  HeartHandshake,
  Trophy,
  Clock,
  Users,
  Bell,
  User,
  Lock,
  Plus,
  ThumbsUp,
  ChevronRight,
  Activity,
} from "lucide-react";
import {
  retosService,
  foroService,
  citasService,
  authService,
  diagnosticoService,
} from "../services/api";
import SpecialistView from "./SpecialistView";
import AdminView from "./AdminView";

function Dashboard({ onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(false);

  // ── RETOS STATE ──
  const [retos, setRetos] = useState([
    {
      id: 1,
      title: "Cena sin Pantallas",
      category: "Comunicación",
      desc: "Disfruten de una comida juntos sin teléfonos, tablets ni TV. Conversen sobre cómo estuvo su día.",
      duration: "45 min",
      icon: "check",
      completed: false,
    },
    {
      id: 2,
      title: "Escucha Activa",
      category: "Empatía",
      desc: "Dedica 10 minutos a escuchar a tu hijo sin interrumpir. Refleja lo que te dice con tus propias palabras.",
      duration: "10 min",
      icon: "smile",
      completed: false,
    },
    {
      id: 3,
      title: "Noche de Juegos",
      category: "Diversión",
      desc: "Organicen una noche de juegos de mesa en familia. Sin dispositivos electrónicos.",
      duration: "60 min",
      icon: "users",
      completed: true,
    },
    {
      id: 4,
      title: "Carta de Gratitud",
      category: "Expresión",
      desc: "Escribe una carta breve expresando algo que agradeces de cada miembro de tu familia.",
      duration: "20 min",
      icon: "message",
      completed: true,
    },
    {
      id: 5,
      title: "Paseo en Familia",
      category: "Bienestar",
      desc: "Salgan a caminar juntos 30 minutos por el parque sin teléfonos. Observen y comenten lo que ven.",
      duration: "30 min",
      icon: "smile",
      completed: false,
    },
    {
      id: 6,
      title: "Cocinar Juntos",
      category: "Trabajo en equipo",
      desc: "Elijan una receta nueva y cocínenla en familia. Cada miembro tiene una tarea asignada.",
      duration: "60 min",
      icon: "check",
      completed: false,
    },
  ]);

  // ── FORO STATE ──
  const [foroTab, setForoTab] = useState("Todos");
  const [foroThreads, setForoThreads] = useState([
    {
      id: 1,
      avatar: "MA",
      author: "María A.",
      time: "Hace 2 horas",
      category: "Adolescentes",
      title: "¿Cómo manejar los cambios de humor en adolescentes?",
      body: "Mi hijo de 14 años ha estado muy irritable últimamente. ¿Alguien ha pasado por algo similar?",
      replies: 15,
      likes: 23,
      liked: false,
    },
    {
      id: 2,
      avatar: "CP",
      author: "Carlos P.",
      time: "Hace 5 horas",
      category: "Convivencia",
      title: "Tips para la primera noche en la nueva casa",
      body: "Nos mudamos la próxima semana y mis hijos están nerviosos. ¿Qué les funcionó a ustedes?",
      replies: 8,
      likes: 12,
      liked: false,
    },
    {
      id: 3,
      avatar: "LR",
      author: "Laura R.",
      time: "Hace 1 día",
      category: "Comunicación",
      title: "Rutinas de la mañana que cambiaron nuestra dinámica",
      body: "Quiero compartir cómo una simple rutina matutina mejoró la relación con mis hijos antes de ir al colegio.",
      replies: 32,
      likes: 45,
      liked: true,
    },
    {
      id: 4,
      avatar: "JM",
      author: "Juan M.",
      time: "Hace 2 días",
      category: "Emociones",
      title: "¿Cómo hablar de emociones con niños pequeños?",
      body: "Mi hija de 5 años no sabe expresar lo que siente. ¿Qué técnicas usan para ayudar?",
      replies: 19,
      likes: 28,
      liked: false,
    },
  ]);

  // ── CITAS STATE ──
  const [citas, setCitas] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [showNewCita, setShowNewCita] = useState(false);
  const [newCita, setNewCita] = useState({
    specialistId: "",
    name: "",
    especialidad: "",
    fecha: "",
    hora: "",
    tipo: "Sesión virtual (Zoom)",
  });

  // ── AJUSTES STATE ──
  const [perfil, setPerfil] = useState({
    nombre: "Familia González",
    correo: "familia@correo.com",
    telefono: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [notifs, setNotifs] = useState({
    retos: true,
    foro: true,
    citas: true,
  });
  const [passwords, setPasswords] = useState({ actual: "", nueva: "" });
  const [savedMsg, setSavedMsg] = useState("");

  // ── FORO: nuevo tema ──
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThread, setNewThread] = useState({
    title: "",
    body: "",
    category: "Comunicación",
  });

  // ── SIMULADOR (DIAGNÓSTICO) STATE ──
  const [diagnosticoStep, setDiagnosticoStep] = useState(0); // 0: intro, 1-10: questions, 11: results
  const [diagnosticoScore, setDiagnosticoScore] = useState(0);
  const [diagnosticoResponses, setDiagnosticoResponses] = useState([]);
  const questions = [
    {
      q: "¿Con qué frecuencia se presentan gritos durante las discusiones en casa?",
      options: [
        { text: "Nunca", pts: 10 },
        { text: "Rara vez", pts: 7 },
        { text: "Frecuentemente", pts: 3 },
        { text: "Siempre", pts: 0 },
      ],
    },
    {
      q: "¿Qué tan seguido los miembros de la familia se escuchan con atención cuando hablan?",
      options: [
        { text: "Siempre", pts: 10 },
        { text: "Casi siempre", pts: 7 },
        { text: "Algunas veces", pts: 3 },
        { text: "Nunca", pts: 0 },
      ],
    },
    {
      q: "¿Con qué frecuencia comparten tiempo de calidad en familia (comidas, salidas, conversaciones)?",
      options: [
        { text: "Todos los días", pts: 10 },
        { text: "Varias veces a la semana", pts: 7 },
        { text: "Pocas veces al mes", pts: 3 },
        { text: "Nunca", pts: 0 },
      ],
    },
    {
      q: "¿Qué tan seguido se resuelven los conflictos mediante el diálogo?",
      options: [
        { text: "Siempre", pts: 10 },
        { text: "Casi siempre", pts: 7 },
        { text: "Algunas veces", pts: 3 },
        { text: "Nunca", pts: 0 },
      ],
    },
    {
      q: "¿Con qué frecuencia se expresan afecto (abrazos, palabras positivas) entre los miembros de la familia?",
      options: [
        { text: "Siempre", pts: 10 },
        { text: "Frecuentemente", pts: 7 },
        { text: "Rara vez", pts: 3 },
        { text: "Nunca", pts: 0 },
      ],
    },
    {
      q: "¿Qué tan claro están las normas y reglas dentro del hogar?",
      options: [
        { text: "Muy claras y se cumplen", pts: 10 },
        { text: "Claras, pero a veces no se cumplen", pts: 7 },
        { text: "Poco claras", pts: 3 },
        { text: "No existen normas", pts: 0 },
      ],
    },
    {
      q: "¿Con qué frecuencia se presentan faltas de respeto en la familia?",
      options: [
        { text: "Nunca", pts: 10 },
        { text: "Rara vez", pts: 7 },
        { text: "Frecuentemente", pts: 3 },
        { text: "Siempre", pts: 0 },
      ],
    },
    {
      q: "¿Qué tan apoyados se sienten los miembros de la familia entre sí?",
      options: [
        { text: "Muy apoyados", pts: 10 },
        { text: "Apoyo moderado", pts: 7 },
        { text: "Poco apoyo", pts: 3 },
        { text: "Nada de apoyo", pts: 0 },
      ],
    },
    {
      q: "¿Con qué frecuencia se involucran los padres o cuidadores en la vida emocional de los hijos?",
      options: [
        { text: "Siempre", pts: 10 },
        { text: "Frecuentemente", pts: 7 },
        { text: "Rara vez", pts: 3 },
        { text: "Nunca", pts: 0 },
      ],
    },
    {
      q: "¿Qué tan seguido se presentan ambientes de tensión o estrés en el hogar?",
      options: [
        { text: "Nunca", pts: 10 },
        { text: "Rara vez", pts: 7 },
        { text: "Frecuentemente", pts: 3 },
        { text: "Siempre", pts: 0 },
      ],
    },
  ];

  // ── EFFECT: Fetch Data ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      authService.logout();
      onNavigate("login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [retosRes, threadsRes, citasRes, specsRes] =
          await Promise.allSettled([
            retosService.getAll(),
            foroService.getThreads(),
            citasService.getAll(),
            citasService.getSpecialists(),
          ]);

        if (retosRes.status === "fulfilled") setRetos(retosRes.value);
        if (threadsRes.status === "fulfilled") setForoThreads(threadsRes.value);
        if (citasRes.status === "fulfilled") setCitas(citasRes.value);
        if (specsRes.status === "fulfilled") setSpecialists(specsRes.value);

        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          setPerfil({
            nombre: user.fullName || user.nombre || "Usuario",
            correo: user.email || user.correo || "",
            telefono: user.telefono || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showSaved("⚠ Error de conexión con el servidor. Usando datos locales.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── HANDLERS ──
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleReto = async (id) => {
    try {
      await retosService.toggleComplete(id);
    } catch (e) {
      console.warn("API toggleReto failed.");
    }
    setRetos((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)),
    );
  };

  const toggleLike = async (id) => {
    try {
      await foroService.toggleLike(id);
    } catch (e) {
      console.warn("API toggleLike failed.");
    }
    setForoThreads((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              liked: !t.liked,
              likes: t.liked ? t.likes - 1 : t.likes + 1,
            }
          : t,
      ),
    );
  };

  const cancelCita = async (id) => {
    try {
      await citasService.delete(id);
    } catch (e) {
      console.warn("API cancelCita failed.");
    }
    setCitas((prev) => prev.filter((c) => c.id !== id));
  };

  const completarCita = async (id) => {
    try {
      await citasService.updateStatus(id, "completada");
    } catch (e) {
      console.warn("API completarCita failed.");
    }
    setCitas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "completada" } : c)),
    );
  };

  const handleAnswer = (pts) => {
    setDiagnosticoScore((prev) => prev + pts);
    setDiagnosticoResponses((prev) => [
      ...prev,
      { questionId: diagnosticoStep, score: pts },
    ]);
    setDiagnosticoStep((prev) => prev + 1);
  };

  const resetDiagnostico = async () => {
    if (diagnosticoStep === 11 && diagnosticoResponses.length === 10) {
      try {
        await diagnosticoService.saveResult(diagnosticoResponses);
      } catch (e) {
        console.warn("API saveResult failed.");
      }
    }
    setDiagnosticoStep(0);
    setDiagnosticoScore(0);
    setDiagnosticoResponses([]);
  };

  const addThread = async () => {
    if (!newThread.title.trim() || !newThread.body.trim()) return;
    const initials = perfil.nombre
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    const payload = {
      avatar: initials,
      author: perfil.nombre,
      time: "Ahora",
      category: newThread.category,
      title: newThread.title,
      body: newThread.body,
      replies: 0,
      likes: 0,
      liked: false,
    };
    try {
      const created = await foroService.createThread(payload);
      setForoThreads((prev) => [created, ...prev]);
    } catch (e) {
      setForoThreads((prev) => [{ id: Date.now(), ...payload }, ...prev]);
    }
    setNewThread({ title: "", body: "", category: "Comunicación" });
    setShowNewThread(false);
    showSaved("✓ Tema publicado en el foro");
  };

  const addCita = async () => {
    if (!newCita.specialistId || !newCita.fecha.trim() || !newCita.hora.trim())
      return;
    const specialist = specialists.find((s) => s.id == newCita.specialistId);
    const payload = {
      specialistId: Number(newCita.specialistId),
      appointmentDate: `${newCita.fecha}T${newCita.hora}:00`,
      notes: newCita.tipo,
    };
    try {
      const created = await citasService.create(payload);
      // Actualizar localmente con mapeo
      setCitas((prev) => [
        ...prev,
        {
          ...created,
          name:
            specialist?.fullName ||
            created.name ||
            "Especialista",
          fecha: newCita.fecha,
          hora: newCita.hora,
          status: "proxima",
        },
      ]);
      setNewCita({
        specialistId: "",
        name: "",
        especialidad: "",
        fecha: "",
        hora: "",
        tipo: "Sesión virtual (Zoom)",
      });
      setShowNewCita(false);
      showSaved("✓ Cita agendada correctamente");
    } catch (e) {
      console.error("Error creating appointment", e);
      showSaved("⚠ No se pudo agendar la cita. Intenta iniciar sesión de nuevo.");
    }
  };

  const showSaved = (msg) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const retosCompleted = retos.filter((r) => r.completed).length;
  const retosPending = retos.filter((r) => !r.completed).length;

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    authService.logout();
    setSidebarOpen(false);
    onNavigate("home", e);
  };

  const menuItems = [
    { id: "inicio", label: "Inicio", icon: Home },
    { id: "retos", label: "Retos Semanales", icon: Target },
    { id: "diagnostico", label: "Diagnóstico Familiar", icon: HeartHandshake },
    { id: "foro", label: "Foro Comunitario", icon: MessageCircle },
    { id: "citas", label: "Agenda de Citas", icon: Calendar },
    { id: "especialistas", label: "Panel de Especialista", icon: Users },
    ...(currentUser?.role === "ADMIN" ? [{ id: "admin", label: "Administración", icon: Settings }] : []),
    { id: "ajustes", label: "Ajustes", icon: Settings },
  ];

  const foroCategories = [
    "Todos",
    "Comunicación",
    "Adolescentes",
    "Convivencia",
    "Emociones",
  ];

  // ============================
  // VISTA: INICIO
  // ============================
  const renderInicio = () => (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>¡Hola, Familia! 👋</h1>
        <p>Bienvenido de nuevo a tu espacio seguro. ¿Cómo se sienten hoy?</p>
        <div className="mood-tracker">
          {[
            { key: "bien", icon: Smile, label: "Bien" },
            { key: "regular", icon: Meh, label: "Regular" },
            { key: "dificil", icon: Frown, label: "Difícil" },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.key}
                className={`mood-btn ${selectedMood === m.key ? "mood-btn-active" : ""}`}
                onClick={() => setSelectedMood(m.key)}
              >
                <Icon size={32} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
        {selectedMood && (
          <p className="mood-response">
            Has seleccionado:{" "}
            <strong>
              {selectedMood === "bien"
                ? "😊 Bien"
                : selectedMood === "regular"
                  ? "😐 Regular"
                  : "😟 Difícil"}
            </strong>{" "}
            — ¡Gracias por compartir!
          </p>
        )}
      </div>
      <div className="dashboard-grid">
        <section
          className="dashboard-section glass-panel animate-slide-up"
          style={{ cursor: "pointer", animationDelay: "0.1s" }}
          onClick={() => setActiveSection("diagnostico")}
        >
          <div className="section-header">
            <h2>Simulador de Convivencia</h2>
            <span className="badge badge-new">Recomendado</span>
          </div>
          <div className="diagnostico-preview">
            <Activity size={32} className="diagnostico-preview-icon" />
            <p>
              Descubre el estado actual de tu convivencia familiar con nuestro
              simulador.
            </p>
          </div>
          <span className="view-more">
            Empezar test <ChevronRight size={16} />
          </span>
        </section>

        <section
          className="dashboard-section glass-panel animate-slide-up"
          style={{ cursor: "pointer", animationDelay: "0.2s" }}
          onClick={() => setActiveSection("retos")}
        >
          <div className="section-header">
            <h2>Retos Semanales</h2>
            <span className="badge">{retosPending} Pendientes</span>
          </div>
          <div className="challenge-list">
            {retos
              .filter((r) => !r.completed)
              .slice(0, 2)
              .map((r) => (
                <div key={r.id} className="challenge-card">
                  <div className="challenge-icon">
                    <CheckCircle size={24} />
                  </div>
                  <div className="challenge-info">
                    <h3>{r.title}</h3>
                    <p>
                      {r.desc?.substring(0, 60) || ""}
                      {r.desc?.length > 60 ? "..." : ""}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <span className="view-more">
            Ver todos los retos <ChevronRight size={16} />
          </span>
        </section>

        <section
          className="dashboard-section glass-panel animate-slide-up"
          style={{ cursor: "pointer", animationDelay: "0.3s" }}
          onClick={() => setActiveSection("foro")}
        >
          <div className="section-header">
            <h2>Foro Comunitario</h2>
            <span className="badge">{foroThreads.length} temas</span>
          </div>
          <div className="forum-list">
            {foroThreads.slice(0, 2).map((t) => (
              <div key={t.id} className="forum-item">
                <div className="forum-icon">
                  <MessageSquare size={20} />
                </div>
                <div className="forum-info">
                  <h4>{t.title}</h4>
                  <p>
                    {t.body?.substring(0, 50) || ""}
                    {t.body?.length > 50 ? "..." : ""}
                  </p>
                  <span className="forum-meta">
                    {t.time} • {t.replies || 0} respuestas
                  </span>
                </div>
              </div>
            ))}
          </div>
          <span className="view-more">
            Ir al foro <ChevronRight size={16} />
          </span>
        </section>
      </div>
    </div>
  );

  // ============================
  // VISTA: RETOS SEMANALES
  // ============================
  const retoIcons = {
    check: CheckCircle,
    smile: Smile,
    users: Users,
    message: MessageCircle,
  };

  const renderRetos = () => (
    <div className="dashboard-container">
      <div className="section-page-header">
        <div>
          <h1 className="section-page-title">
            <Target size={28} /> Retos Semanales
          </h1>
          <p>Completa actividades para fortalecer los lazos familiares</p>
        </div>
        <div className="section-stats">
          <div className="stat-chip">
            <Trophy size={16} /> <strong>{retosCompleted}</strong> completados
          </div>
          <div className="stat-chip">
            <Clock size={16} /> <strong>{retosPending}</strong> pendientes
          </div>
        </div>
      </div>

      <div className="retos-grid">
        {retos.map((reto) => {
          const IconComp = retoIcons[reto.icon] || CheckCircle;
          return (
            <div
              key={reto.id}
              className={`reto-card glass-panel ${reto.completed ? "reto-done" : ""}`}
            >
              <div
                className={`reto-status ${reto.completed ? "reto-completed" : "reto-pending"}`}
              >
                {reto.completed ? "✓ Completado" : "Pendiente"}
              </div>
              <div className="reto-card-header">
                <div className="reto-icon-big">
                  <IconComp size={28} />
                </div>
                <div>
                  <h3>{reto.title}</h3>
                  <span className="reto-category">{reto.category}</span>
                </div>
              </div>
              <p>{reto.desc || ""}</p>
              <div className="reto-footer">
                <span className="reto-duration">
                  <Clock size={14} /> {reto.duration}
                </span>
                {reto.completed ? (
                  <button
                    className="btn-outline btn-small"
                    onClick={() => toggleReto(reto.id)}
                  >
                    Deshacer
                  </button>
                ) : (
                  <button
                    className="btn-primary btn-small"
                    onClick={() => toggleReto(reto.id)}
                  >
                    Completar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ============================
  // VISTA: FORO COMUNITARIO
  // ============================
  const filteredThreads =
    foroTab === "Todos"
      ? foroThreads
      : foroThreads.filter((t) => t.category === foroTab);

  const renderForo = () => (
    <div className="dashboard-container">
      <div className="section-page-header">
        <div>
          <h1 className="section-page-title">
            <MessageCircle size={28} /> Foro Comunitario
          </h1>
          <p>Comparte experiencias y aprende de otras familias</p>
        </div>
        <button
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          onClick={() => setShowNewThread(!showNewThread)}
        >
          <Plus size={18} /> Nuevo Tema
        </button>
      </div>

      {showNewThread && (
        <div
          className="new-form-card glass-panel"
          style={{ marginBottom: "1.5rem" }}
        >
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>
            Crear nuevo tema
          </h3>
          <div className="ajuste-fields">
            <div className="ajuste-field">
              <label>Título del tema</label>
              <input
                type="text"
                className="form-control"
                placeholder="¿Sobre qué quieres hablar?"
                value={newThread.title}
                onChange={(e) =>
                  setNewThread({ ...newThread, title: e.target.value })
                }
                style={{ paddingLeft: "1rem" }}
              />
            </div>
            <div className="ajuste-field">
              <label>Descripción</label>
              <textarea
                className="form-control"
                placeholder="Comparte tu experiencia o pregunta..."
                rows={3}
                value={newThread.body}
                onChange={(e) =>
                  setNewThread({ ...newThread, body: e.target.value })
                }
                style={{
                  paddingLeft: "1rem",
                  resize: "vertical",
                  minHeight: "80px",
                }}
              />
            </div>
            <div className="ajuste-field">
              <label>Categoría</label>
              <select
                className="form-control"
                value={newThread.category}
                onChange={(e) =>
                  setNewThread({ ...newThread, category: e.target.value })
                }
                style={{ paddingLeft: "1rem" }}
              >
                {foroCategories
                  .filter((c) => c !== "Todos")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
            <button className="btn-primary btn-small" onClick={addThread}>
              Publicar
            </button>
            <button
              className="btn-outline btn-small"
              onClick={() => setShowNewThread(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="foro-categories">
        {foroCategories.map((cat) => (
          <button
            key={cat}
            className={`foro-tab ${foroTab === cat ? "foro-tab-active" : ""}`}
            onClick={() => setForoTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="foro-threads">
        {filteredThreads.length === 0 && (
          <div className="empty-state glass-panel">
            <MessageSquare size={40} />
            <p>No hay temas en esta categoría aún.</p>
          </div>
        )}
        {filteredThreads.map((thread) => (
          <div key={thread.id} className="foro-thread glass-panel">
            <div className="foro-thread-avatar">{thread.avatar}</div>
            <div className="foro-thread-content">
              <h3>{thread.title}</h3>
              <p>{thread.body || ""}</p>
              <div className="foro-thread-meta">
                <span>
                  <User size={14} /> {thread.author}
                </span>
                <span>
                  <Clock size={14} /> {thread.time}
                </span>
                <span>
                  <MessageSquare size={14} /> {thread.replies} respuestas
                </span>
                <button
                  className={`foro-like-btn ${thread.liked ? "foro-liked" : ""}`}
                  onClick={() => toggleLike(thread.id)}
                >
                  <ThumbsUp size={14} /> {thread.likes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ============================
  // VISTA: AGENDA DE CITAS
  // ============================
  const renderCitas = () => (
    <div className="dashboard-container">
      <div className="section-page-header">
        <div>
          <h1 className="section-page-title">
            <Calendar size={28} /> Agenda de Citas
          </h1>
          <p>Coordina sesiones con especialistas psicopedagógicos</p>
        </div>
        <button
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          onClick={() => setShowNewCita(!showNewCita)}
        >
          <Plus size={18} /> Nueva Cita
        </button>
      </div>

      {showNewCita && (
        <div
          className="new-form-card glass-panel"
          style={{ marginBottom: "1.5rem" }}
        >
          <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>
            Agendar nueva cita
          </h3>
          <div className="ajuste-fields">
            <div className="ajuste-field">
              <label>Seleccionar Especialista</label>
              <select
                className="form-control"
                value={newCita.specialistId}
                onChange={(e) => {
                  const spec = specialists.find((s) => s.id == e.target.value);
                  setNewCita({
                    ...newCita,
                    specialistId: e.target.value,
                    name: spec?.fullName || "",
                    especialidad: "Psicología",
                  });
                }}
                style={{ paddingLeft: "1rem" }}
              >
                <option value="">-- Seleccione un especialista --</option>
                {specialists.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} - {s.role}
                  </option>
                ))}
              </select>
            </div>
            <div className="ajuste-field">
              <label>Fecha</label>
              <input
                type="date"
                className="form-control"
                value={newCita.fecha}
                onChange={(e) =>
                  setNewCita({ ...newCita, fecha: e.target.value })
                }
                style={{ paddingLeft: "1rem" }}
              />
            </div>
            <div className="ajuste-field">
              <label>Hora</label>
              <input
                type="time"
                className="form-control"
                value={newCita.hora}
                onChange={(e) =>
                  setNewCita({ ...newCita, hora: e.target.value })
                }
                style={{ paddingLeft: "1rem" }}
              />
            </div>
            <div className="ajuste-field">
              <label>Modalidad</label>
              <select
                className="form-control"
                value={newCita.tipo}
                onChange={(e) =>
                  setNewCita({ ...newCita, tipo: e.target.value })
                }
                style={{ paddingLeft: "1rem" }}
              >
                <option>Sesión virtual (Zoom)</option>
                <option>Presencial</option>
                <option>Llamada telefónica</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
            <button className="btn-primary btn-small" onClick={addCita}>
              Agendar
            </button>
            <button
              className="btn-outline btn-small"
              onClick={() => setShowNewCita(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {citas.length === 0 ? (
        <div className="empty-state glass-panel">
          <Calendar size={40} />
          <p>No tienes citas programadas.</p>
        </div>
      ) : (
        <div className="citas-grid">
          {citas.map((cita) => (
            <div
              key={cita.id}
              className={`cita-card glass-panel ${cita.status === "proxima" ? "cita-proxima" : ""} ${cita.status === "completada" ? "cita-pasada" : ""}`}
            >
              {cita.status === "proxima" && (
                <div className="cita-badge-next">Próxima</div>
              )}
              {cita.status === "completada" && (
                <div className="cita-badge-past">Completada</div>
              )}
              <div className="cita-header">
                <div className="cita-avatar">{cita.avatar}</div>
                <div>
                  <h3>{cita.name}</h3>
                  <span className="cita-especialidad">{cita.especialidad}</span>
                </div>
              </div>
              <div className="cita-detalles">
                <div className="cita-detalle">
                  <Calendar size={16} /> {cita.fecha}
                </div>
                <div className="cita-detalle">
                  <Clock size={16} /> {cita.hora}
                </div>
                {cita.tipo && (
                  <div className="cita-detalle">
                    <MessageCircle size={16} /> {cita.tipo}
                  </div>
                )}
              </div>
              <div className="cita-actions">
                {cita.status === "proxima" && (
                  <>
                    <button
                      className="btn-primary btn-small"
                      onClick={() => completarCita(cita.id)}
                    >
                      Marcar completada
                    </button>
                    <button
                      className="btn-outline btn-small"
                      onClick={() => cancelCita(cita.id)}
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {cita.status === "futura" && (
                  <>
                    <button
                      className="btn-primary btn-small"
                      onClick={() => completarCita(cita.id)}
                    >
                      Marcar completada
                    </button>
                    <button
                      className="btn-outline btn-small"
                      onClick={() => cancelCita(cita.id)}
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {cita.status === "completada" && (
                  <button
                    className="btn-outline btn-small"
                    onClick={() => cancelCita(cita.id)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ============================
  // VISTA: AJUSTES
  // ============================
  const renderAjustes = () => (
    <div className="dashboard-container">
      <div className="section-page-header">
        <div>
          <h1 className="section-page-title">
            <Settings size={28} /> Ajustes
          </h1>
          <p>Personaliza tu experiencia en Conecta Familia</p>
        </div>
      </div>

      {savedMsg && <div className="save-toast">{savedMsg}</div>}

      <div className="ajustes-sections">
        <div className="ajuste-card glass-panel">
          <div className="ajuste-header">
            <User size={22} />
            <h3>Perfil Personal</h3>
          </div>
          <div className="ajuste-fields">
            <div className="ajuste-field">
              <label>Nombre completo</label>
              <input
                type="text"
                className="form-control"
                placeholder="Tu nombre"
                value={perfil.nombre}
                onChange={(e) =>
                  setPerfil({ ...perfil, nombre: e.target.value })
                }
                style={{ paddingLeft: "1rem" }}
              />
            </div>
            <div className="ajuste-field">
              <label>Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                placeholder="tu@correo.com"
                value={perfil.correo}
                onChange={(e) =>
                  setPerfil({ ...perfil, correo: e.target.value })
                }
                style={{ paddingLeft: "1rem" }}
              />
            </div>
            <div className="ajuste-field">
              <label>Teléfono</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+57 300 000 0000"
                value={perfil.telefono}
                onChange={(e) =>
                  setPerfil({ ...perfil, telefono: e.target.value })
                }
                style={{ paddingLeft: "1rem" }}
              />
            </div>
          </div>
          <button
            className="btn-primary btn-small"
            style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
            onClick={() => showSaved("✓ Perfil guardado correctamente")}
          >
            Guardar cambios
          </button>
        </div>

        <div className="ajuste-card glass-panel">
          <div className="ajuste-header">
            <Bell size={22} />
            <h3>Notificaciones</h3>
          </div>
          <div className="ajuste-toggles">
            <div className="ajuste-toggle-item">
              <div>
                <strong>Retos semanales</strong>
                <p>Recibir recordatorio de retos pendientes</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifs.retos}
                  onChange={() => {
                    setNotifs({ ...notifs, retos: !notifs.retos });
                    showSaved("✓ Notificación actualizada");
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="ajuste-toggle-item">
              <div>
                <strong>Foro comunitario</strong>
                <p>Notificar nuevas respuestas en tus temas</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifs.foro}
                  onChange={() => {
                    setNotifs({ ...notifs, foro: !notifs.foro });
                    showSaved("✓ Notificación actualizada");
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="ajuste-toggle-item">
              <div>
                <strong>Recordatorio de citas</strong>
                <p>Avisar 24h antes de cada cita programada</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifs.citas}
                  onChange={() => {
                    setNotifs({ ...notifs, citas: !notifs.citas });
                    showSaved("✓ Notificación actualizada");
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="ajuste-card glass-panel">
          <div className="ajuste-header">
            <Lock size={22} />
            <h3>Seguridad</h3>
          </div>
          <div className="ajuste-fields">
            <div className="ajuste-field">
              <label>Contraseña actual</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={passwords.actual}
                onChange={(e) =>
                  setPasswords({ ...passwords, actual: e.target.value })
                }
                style={{ paddingLeft: "1rem" }}
              />
            </div>
            <div className="ajuste-field">
              <label>Nueva contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={passwords.nueva}
                onChange={(e) =>
                  setPasswords({ ...passwords, nueva: e.target.value })
                }
                style={{ paddingLeft: "1rem" }}
              />
            </div>
          </div>
          <button
            className="btn-outline btn-small"
            style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
            onClick={() => {
              setPasswords({ actual: "", nueva: "" });
              showSaved("✓ Contraseña actualizada");
            }}
          >
            Cambiar contraseña
          </button>
        </div>
      </div>
    </div>
  );

  // ============================
  // VISTA: DIAGNÓSTICO FAMILIAR
  // ============================
  const renderDiagnostico = () => {
    if (diagnosticoStep === 0) {
      return (
        <div className="dashboard-container">
          <div className="section-page-header">
            <div>
              <h1 className="section-page-title">
                <HeartHandshake size={28} /> Diagnóstico Familiar
              </h1>
              <p>
                Evalúa el estado actual de la comunicación y convivencia en tu
                hogar
              </p>
            </div>
          </div>
          <div className="diagnostico-intro glass-panel">
            <div className="diagnostico-intro-icon">
              <Activity size={48} />
            </div>
            <h2>Simulador de Dinámica Familiar</h2>
            <p>
              Este test consta de 10 preguntas que nos ayudarán a entender mejor
              cómo se relaciona tu familia. Sé lo más sincero posible para
              obtener resultados precisos.
            </p>
            <button
              className="btn-primary"
              onClick={() => setDiagnosticoStep(1)}
            >
              Comenzar Diagnóstico
            </button>
          </div>
        </div>
      );
    }

    if (diagnosticoStep <= 10) {
      const qIndex = diagnosticoStep - 1;
      const question = questions[qIndex];
      return (
        <div className="dashboard-container">
          <div className="diagnostico-progress">
            <div className="progress-text">
              Pregunta {diagnosticoStep} de 10
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${(diagnosticoStep / 10) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="question-card glass-panel">
            <h3>{question.q}</h3>
            <div className="options-grid">
              {question.options.map((opt, idx) => (
                <button
                  key={idx}
                  className="option-btn"
                  onClick={() => handleAnswer(opt.pts)}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Results screen
    let interpretation = "";
    let colorClass = "";
    if (diagnosticoScore >= 80) {
      interpretation =
        "¡Excelente dinámica familiar! Sigan cultivando estos hábitos.";
      colorClass = "score-excellent";
    } else if (diagnosticoScore >= 50) {
      interpretation =
        "Buena dinámica, aunque existen áreas que pueden mejorar con diálogo.";
      colorClass = "score-good";
    } else if (diagnosticoScore >= 30) {
      interpretation =
        "Se detectan riesgos en la convivencia. Recomendamos enfocarse en la comunicación.";
      colorClass = "score-warning";
    } else {
      interpretation =
        "Dinámica crítica. Se recomienda buscar apoyo profesional para mejorar el ambiente.";
      colorClass = "score-critical";
    }

    return (
      <div className="dashboard-container">
        <div className="results-card glass-panel">
          <Trophy size={64} className="results-icon" />
          <h2>Resultado del Diagnóstico</h2>
          <div className={`score-display ${colorClass}`}>
            <span className="score-value">{diagnosticoScore}</span>
            <span className="score-label">/ 100 puntos</span>
          </div>
          <p className="interpretation-text">{interpretation}</p>
          <div className="results-actions">
            <button className="btn-primary" onClick={resetDiagnostico}>
              Repetir Test
            </button>
            <button
              className="btn-outline"
              onClick={() => setActiveSection("inicio")}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================
  // RENDER POR SECCIÓN
  // ============================
  const renderSectionContent = () => {
    switch (activeSection) {
      case "retos":
        return renderRetos();
      case "diagnostico":
        return renderDiagnostico();
      case "foro":
        return renderForo();
      case "citas":
        return renderCitas();
      case "especialistas":
        return <SpecialistView />;
      case "admin":
        return <AdminView />;
      case "ajustes":
        return renderAjustes();
      case "inicio":
      default:
        return renderInicio();
    }
  };

  return (
    <div className="dashboard-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <HeartHandshake size={24} className="nav-logo-icon" />
            <span>Conecta Familia</span>
          </div>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${activeSection === item.id ? "sidebar-item-active" : ""}`}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-item sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <h2 className="topbar-title">
            {menuItems.find((i) => i.id === activeSection)?.label || "Inicio"}
          </h2>
          <div
            className="topbar-user"
            onClick={() => setActiveSection("ajustes")}
            style={{ cursor: "pointer" }}
            title="Mi Perfil"
          >
            <div className="user-avatar">
              {perfil?.nombre ? perfil.nombre.charAt(0) : <User size={18} />}
            </div>
          </div>
        </header>

        {renderSectionContent()}
      </div>
    </div>
  );
}

export default Dashboard;
