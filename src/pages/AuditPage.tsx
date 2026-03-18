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
      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-muted-foreground">Inicia sesión para continuar.</p>
        <Link to="/login" className="text-brand-700 underline">
          Log in
        </Link>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="p-6 max-w-2xl mx-auto" role="alert">
        <h1 className="text-xl font-bold mb-2">Acceso restringido</h1>
        <p className="text-muted-foreground mb-4">
          Solo los administradores pueden ver el historial de auditoría.
        </p>
        <Link to="/" className="text-brand-700 underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <p role="status">Cargando historial</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6" role="alert">
        <p className="text-red-400 mb-2">{error}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  return <AuditLogTable logs={logs} />;
}
