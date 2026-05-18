import { useEffect, useMemo, useState } from "react";
import type { Sala } from "../types/types";
import { fakeApi } from "../fakeapi/FakeApi";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { reservas } = useApp();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fakeApi.obtenerSalas();
        if (!cancelled) setSalas(data);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Error al cargar salas.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const pendientes = reservas.filter((r) => r.estado === "pendiente").length;
    const aprobadas = reservas.filter((r) => r.estado === "aprobada").length;
    const rechazadas = reservas.filter((r) => r.estado === "rechazada").length;
    const canceladas = reservas.filter((r) => r.estado === "cancelada").length;
    return { pendientes, aprobadas, rechazadas, canceladas };
  }, [reservas]);

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
        <p className="page-subtitle">
          Resumen rápido de salas y reservas.
        </p>
      </header>

      <div className="dashboard-stats">
        <section className="card stat-card card--static">
          <p className="stat-label">Salas</p>
          <p className="stat-value">{salas.length}</p>
        </section>
        <section className="card stat-card card--static">
          <p className="stat-label">Reservas</p>
          <p className="stat-value">{reservas.length}</p>
        </section>
        <section className="card stat-card card--static">
          <p className="stat-label">Pendientes</p>
          <p className="stat-value">{stats.pendientes}</p>
        </section>
        <section className="card stat-card card--static">
          <p className="stat-label">Aprobadas</p>
          <p className="stat-value">{stats.aprobadas}</p>
        </section>
      </div>

      <section className="card card--static dashboard-recent">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold">Reservas recientes</h2>
            <p className="text-xs text-muted-foreground">
              Últimas 5 reservas guardadas en tu navegador.
            </p>
          </div>
          <Link to="/reservations" className="text-sm text-brand-700 font-semibold">
            Ver todas →
          </Link>
        </div>

        {reservas.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no hay reservas.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sala</th>
                  <th>Fecha</th>
                  <th>Franja</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservas
                  .slice()
                  .sort((a, b) => b.id - a.id)
                  .slice(0, 5)
                  .map((r) => (
                    <tr key={r.id}>
                      <td>{r.sala.nombre}</td>
                      <td className="text-muted-foreground">{r.fecha}</td>
                      <td className="text-muted-foreground">{r.timeSlot}</td>
                      <td>
                        <span className="badge badge--success">{r.estado}</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
