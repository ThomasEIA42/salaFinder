import { useEffect, useState } from "react";
import { getAuditLogs, type AuditLog } from "../api/api";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

export default function AuditPage() {
  const { user } = useApp();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== "Admin") return;
    (async () => {
      setLoading(true);
      try {
        const data = await getAuditLogs();
        setLogs(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al cargar logs.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (user?.role !== "Admin") {
    return (
      <div className="p-6">
        <p className="text-red-400">Acceso restringido a administradores.</p>
        <Link to="/" className="text-brand-700 underline">Volver</Link>
      </div>
    );
  }

  if (loading) return <div className="p-6"><p>Cargando logs…</p></div>;
  if (error) return <div className="p-6"><p className="text-red-400">{error}</p></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Audit Log</h1>
      <div className="overflow-x-auto">
        <table className="w-full border border-border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-surface/60">
              <th className="p-2 border-b border-border text-left text-xs text-muted-foreground">Usuario</th>
              <th className="p-2 border-b border-border text-left text-xs text-muted-foreground">Acción</th>
              <th className="p-2 border-b border-border text-left text-xs text-muted-foreground">Entidad</th>
              <th className="p-2 border-b border-border text-left text-xs text-muted-foreground">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id_log} className="border-t border-border">
                <td className="p-2 text-xs text-muted-foreground">{l.userId}</td>
                <td className="p-2 text-sm">{l.action}</td>
                <td className="p-2 text-xs text-muted-foreground">{l.entity}</td>
                <td className="p-2 text-xs text-muted-foreground">
                  {new Date(l.timestamp).toLocaleString("es-CO")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
