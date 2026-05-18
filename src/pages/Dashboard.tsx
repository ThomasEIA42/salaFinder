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
      <div className="p-6 max-w-5xl mx-auto">
        <p role="status" className="text-muted-foreground">
          Cargando dashboard…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-5xl mx-auto" role="alert">
        <p className="text-red-400 mb-3">{error}</p>
        <Link to="/" className="text-brand-700 underline">
          Volver a espacios
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Resumen rápido de salas y reservas.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <section className="card">
          <p className="text-xs text-muted-foreground">Salas</p>
          <p className="mt-1 text-2xl font-bold">{salas.length}</p>
        </section>
        <section className="card">
          <p className="text-xs text-muted-foreground">Reservas</p>
          <p className="mt-1 text-2xl font-bold">{reservas.length}</p>
        </section>
        <section className="card">
          <p className="text-xs text-muted-foreground">Pendientes</p>
          <p className="mt-1 text-2xl font-bold">{stats.pendientes}</p>
        </section>
        <section className="card">
          <p className="text-xs text-muted-foreground">Aprobadas</p>
          <p className="mt-1 text-2xl font-bold">{stats.aprobadas}</p>
        </section>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold">Reservas recientes</h2>
            <p className="text-xs text-muted-foreground">
              Últimas 5 reservas guardadas en tu navegador.
            </p>
          </div>
          <Link to="/reservations" className="text-sm text-brand-700 underline">
            Ver todas
          </Link>
        </div>

        {reservas.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no hay reservas.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-surface/60">
                  <th className="p-2 border-b border-border text-left text-xs text-muted-foreground">
                    Sala
                  </th>
                  <th className="p-2 border-b border-border text-left text-xs text-muted-foreground">
                    Fecha
                  </th>
                  <th className="p-2 border-b border-border text-left text-xs text-muted-foreground">
                    Franja
                  </th>
                  <th className="p-2 border-b border-border text-left text-xs text-muted-foreground">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {reservas
                  .slice()
                  .sort((a, b) => b.id - a.id)
                  .slice(0, 5)
                  .map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="p-2 text-sm">{r.sala.nombre}</td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {r.fecha}
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {r.timeSlot}
                      </td>
                      <td className="p-2 text-sm">
                        <span className="rounded px-2 py-0.5 text-xs font-semibold bg-surface border border-border">
                          {r.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}