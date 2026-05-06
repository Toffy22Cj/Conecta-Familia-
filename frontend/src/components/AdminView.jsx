import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Shield,
  Search,
  ChevronRight,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import SpecialistView from "./SpecialistView";
import { adminService, diagnosticoService } from "../services/api";

function AdminView() {
  const [tab, setTab] = useState("especialista");
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [promotingId, setPromotingId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [usersRes, historyRes] = await Promise.all([
          adminService.getUsers(),
          diagnosticoService.getHistory(),
        ]);
        setUsers(usersRes || []);
        setResults(historyRes || []);
      } catch (e) {
        setError("No se pudieron cargar los datos de administración.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const promoteUser = async (userId) => {
    setPromotingId(userId);
    try {
      await adminService.promoteToSpecialist(userId);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: "ESPECIALISTA" } : user,
        ),
      );
      setMessage("Usuario promovido a especialista correctamente.");
    } catch (e) {
      setError("No se pudo promover al usuario. Intenta nuevamente.");
    } finally {
      setPromotingId(null);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const usersWithResults = useMemo(() => {
    return users.map((user) => {
      const userResults = results
        .filter((result) => String(result.userId) === String(user.id))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return {
        ...user,
        latestResult: userResults[0] || null,
        attempts: userResults.length,
      };
    });
  }, [users, results]);

  const specialistCount = users.filter((u) => u.role === "ESPECIALISTA").length;
  const patientCount = users.filter((u) => u.role === "USUARIO").length;

  return (
    <div className="dashboard-container">
      <div className="section-page-header">
        <div>
          <h1 className="section-page-title">
            <Shield size={28} /> Panel de Administración
          </h1>
          <p>
            Administra usuarios, revisa el panel de especialista y transforma a
            usuarios en especialistas desde un solo lugar.
          </p>
        </div>
        <div className="section-stats">
          <div className="stat-chip">
            <Users size={16} /> <strong>{users.length}</strong> cuentas
          </div>
          <div className="stat-chip">
            <UserPlus size={16} /> <strong>{specialistCount}</strong>{" "}
            especialistas
          </div>
          <div className="stat-chip">
            <CheckCircle size={16} /> <strong>{patientCount}</strong> usuarios
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${tab === "especialista" ? "tab-active" : ""}`}
          onClick={() => setTab("especialista")}
        >
          Panel Especialista
        </button>
        <button
          className={`tab-button ${tab === "usuarios" ? "tab-active" : ""}`}
          onClick={() => setTab("usuarios")}
        >
          Usuarios
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}
      {loading && <p>Cargando datos de administración...</p>}

      {tab === "especialista" ? (
        <SpecialistView />
      ) : (
        <div className="dashboard-container">
          <div className="specialist-table-wrapper glass-panel">
            <div className="specialist-table-header">
              <h2>Usuarios registrados</h2>
              <span>{usersWithResults.length} cuentas encontradas</span>
            </div>
            <div className="admin-user-table-scroll">
              <table className="specialist-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Último puntaje</th>
                    <th>Intentos</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {usersWithResults.map((user) => (
                    <tr key={user.id}>
                      <td>{user.fullName || "Sin nombre"}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.latestResult?.totalScore ?? "—"}</td>
                      <td>{user.attempts}</td>
                      <td>
                        {user.role === "USUARIO" ? (
                          <button
                            className="btn-primary btn-small"
                            type="button"
                            disabled={promotingId === user.id}
                            onClick={() => promoteUser(user.id)}
                          >
                            Promover a especialista
                          </button>
                        ) : (
                          <span className="status-pill status-pill-strong">
                            {user.role}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminView;
