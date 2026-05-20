import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { AuditLog } from "../types/types";
import { useApp } from "../context/AppContext";
import { fakeApi } from "../fakeapi/FakeApi";
import AuditLogTable from "../Data/AuditLog";

export default function AuditPage() {
  const { user } = useApp();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== "admin") return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fakeApi.getAuditLogs();
        if (!cancelled) setLogs(data);
      } catch (e) {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : "Error al cargar auditoría."
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.role]);

  if (!user) {
    return (
      <div className="page max-w-2xl">
        <div className="empty-state">
          <p className="text-muted-foreground mb-4">
            Inicia sesión para continuar.
          </p>
          <Link to="/login" className="btn-link">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="page max-w-2xl" role="alert">
        <header className="page-header">
          <h1 className="page-title">Acceso restringido</h1>
          <p className="page-subtitle">
            Solo los administradores pueden ver el historial de auditoría.
          </p>
        </header>
        <Link to="/" className="link-back">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page audit-page">
        <p className="state-loading" role="status">
          Cargando historial…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page audit-page" role="alert">
        <div className="alert-error">
          <p>{error}</p>
        </div>
        <button
          type="button"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return <AuditLogTable logs={logs} />;
}
