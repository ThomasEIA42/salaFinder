import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getSpaces,
  getAllReservations,
  formatApiDate,
  formatApiTime,
  type Space,
  type Reservation,
} from "../api/api";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const { user } = useApp();
  const [salas, setSalas] = useState<Space[]>([]);
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [spacesData, resData] = await Promise.all([
          getSpaces(),
          user?.role === "Admin" ? getAllReservations() : Promise.resolve([]),
        ]);
        if (!cancelled) {
          setSalas(spacesData);
          setReservas(resData);
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Error al cargar datos.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const stats = useMemo(
    () => ({
      pending: reservas.filter((r) => r.status === "Pending").length,
      approved: reservas.filter((r) => r.status === "Approved").length,
    }),
    [reservas]
  );

  if (loading) {
    return (
      <div className="page">
        <p className="state-loading" role="status">
          Cargando dashboard…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page" role="alert">
        <div className="alert-error">
          <p>{error}</p>
        </div>
        <Link to="/" className="link-back mt-4 inline-block">
          ← Volver a espacios
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Resumen rápido de salas y reservas.</p>
      </header>

      <div className="dashboard-stats">
        <section className="card stat-card card--static">
          <p className="stat-label">Salas activas</p>
          <p className="stat-value">{salas.length}</p>
        </section>
        <section className="card stat-card card--static">
          <p className="stat-label">Reservas totales</p>
          <p className="stat-value">{reservas.length}</p>
        </section>
        <section className="card stat-card card--static">
          <p className="stat-label">Pendientes</p>
          <p className="stat-value">{stats.pending}</p>
        </section>
        <section className="card stat-card card--static">
          <p className="stat-label">Aprobadas</p>
          <p className="stat-value">{stats.approved}</p>
        </section>
      </div>

      {reservas.length > 0 && (
        <section className="card card--static dashboard-recent">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold">Reservas recientes</h2>
              <p className="text-xs text-muted-foreground">Últimas 5 reservas.</p>
            </div>
            <Link to="/reservations" className="btn-link text-sm">
              Ver todas
            </Link>
          </div>
          <div className="audit-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Espacio</th>
                  <th>Fecha</th>
                  <th>Horario</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservas.slice(0, 5).map((r) => (
                  <tr key={r.id_reservation}>
                    <td>{r.space?.name ?? r.spaceId}</td>
                    <td>{formatApiDate(r.date)}</td>
                    <td>
                      {formatApiTime(r.startTime)} – {formatApiTime(r.endTime)}
                    </td>
                    <td>
                      <span className="badge badge--warning">{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
