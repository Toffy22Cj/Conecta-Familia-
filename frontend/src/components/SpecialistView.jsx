import { useEffect, useMemo, useState } from "react";
import { Users, Trophy, Search, Activity, Clock, ChevronRight } from "lucide-react";
import { diagnosticoService, specialistService } from "../services/api";

const profileLabelClass = (profile) => {
  if (profile === "Fortalecido") return "status-pill status-pill-strong";
  if (profile === "Moderado") return "status-pill status-pill-moderate";
  if (profile === "Riesgo Alto") return "status-pill status-pill-risk";
  return "status-pill status-pill-muted";
};

function SpecialistView() {
  const [patients, setPatients] = useState([]);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [profileFilter, setProfileFilter] = useState("Todos");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [users, history] = await Promise.all([
          specialistService.getPatients(),
          diagnosticoService.getHistory(),
        ]);
        setPatients(users || []);
        setResults(history || []);
      } catch (e) {
        console.error("Error al cargar datos de especialistas", e);
        setError("No se pudo cargar la lista de usuarios o resultados en este momento.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const combinedPatients = useMemo(() => {
    return patients.map((user) => {
      const userResults = results
        .filter((result) => String(result.userId) === String(user.id))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return {
        ...user,
        latestResult: userResults[0] || null,
        attempts: userResults.length,
      };
    });
  }, [patients, results]);

  const filteredPatients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return combinedPatients.filter((patient) => {
      const name = (patient.fullName || "").toLowerCase();
      const email = (patient.email || "").toLowerCase();
      const matchesQuery =
        name.includes(normalizedQuery) || email.includes(normalizedQuery);
      const matchesProfile =
        profileFilter === "Todos" ||
        patient.latestResult?.profile === profileFilter;
      return matchesQuery && matchesProfile;
    });
  }, [combinedPatients, query, profileFilter]);

  const completedCount = combinedPatients.filter((patient) => patient.latestResult).length;
  const averageScore = completedCount
    ? Math.round(
        combinedPatients
          .filter((patient) => patient.latestResult)
          .reduce((sum, patient) => sum + (patient.latestResult.totalScore || 0), 0) /
          completedCount,
      )
    : 0;
  const riskCount = combinedPatients.filter(
    (patient) => patient.latestResult?.profile === "Riesgo Alto",
  ).length;
  const lastUpdated = results
    .map((item) => new Date(item.timestamp))
    .sort((a, b) => b - a)[0];

  return (
    <div className="dashboard-container">
      <div className="section-page-header">
        <div>
          <h1 className="section-page-title">
            <Users size={28} /> Panel de Especialista
          </h1>
          <p>
            Visualiza el avance de familias, sus puntajes de diagnóstico y el
            historial de resultados para tomar decisiones más rápidas.
          </p>
        </div>
        <div className="section-stats">
          <div className="stat-chip">
            <Users size={16} /> <strong>{combinedPatients.length}</strong> pacientes
          </div>
          <div className="stat-chip">
            <Trophy size={16} /> <strong>{averageScore}</strong> puntaje promedio
          </div>
          <div className="stat-chip">
            <Activity size={16} /> <strong>{riskCount}</strong> casos en riesgo
          </div>
        </div>
      </div>

      <div className="specialist-actions">
        <label className="specialist-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar familia o correo"
          />
        </label>
        <div className="specialist-filter">
          <select
            value={profileFilter}
            onChange={(e) => setProfileFilter(e.target.value)}
            className="form-control"
          >
            <option value="Todos">Todos los perfiles</option>
            <option value="Fortalecido">Fortalecido</option>
            <option value="Moderado">Moderado</option>
            <option value="Riesgo Alto">Riesgo Alto</option>
          </select>
        </div>
      </div>

      <div className="specialist-summary-grid">
        <div className="specialist-stat-card glass-panel">
          <p>Última actualización</p>
          <strong>
            {lastUpdated ? lastUpdated.toLocaleDateString() : "Sin datos"}
          </strong>
        </div>
        <div className="specialist-stat-card glass-panel">
          <p>Pacientes con diagnóstico</p>
          <strong>{completedCount}</strong>
        </div>
        <div className="specialist-stat-card glass-panel">
          <p>Pacientes sin resultados</p>
          <strong>{combinedPatients.length - completedCount}</strong>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading && <p>Cargando resultados...</p>}

      <div className="specialist-table-wrapper glass-panel">
        <div className="specialist-table-header">
          <h2>Lista de usuarios</h2>
          <span>{filteredPatients.length} familias encontradas</span>
        </div>
        <table className="specialist-table">
          <thead>
            <tr>
              <th>Familia</th>
              <th>Email</th>
              <th>Último puntaje</th>
              <th>Perfil</th>
              <th>Intentos</th>
              <th>Última evaluación</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.fullName || "Sin nombre"}</td>
                <td>{patient.email}</td>
                <td>
                  {patient.latestResult?.totalScore ?? "—"}
                  {patient.latestResult ? " / 100" : ""}
                </td>
                <td>
                  <span className={profileLabelClass(patient.latestResult?.profile)}>
                    {patient.latestResult?.profile || "Sin diagnóstico"}
                  </span>
                </td>
                <td>{patient.attempts}</td>
                <td>
                  {patient.latestResult?.timestamp
                    ? new Date(patient.latestResult.timestamp).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="specialist-followup glass-panel">
        <div>
          <h3>Acciones recomendadas</h3>
          <p>
            Revisa las familias con puntajes bajos y envíales recomendaciones personalizadas.
          </p>
        </div>
        <button className="btn-primary" type="button">
          Ver casos críticos <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default SpecialistView;
