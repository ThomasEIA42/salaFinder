import type { AuditLog } from "../types/types";

type Props = {
  logs: AuditLog[];
};

function AuditLogPage({ logs }: Props) {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Historial del sistema</h1>
      <p className="text-sm text-muted-foreground mb-5">
        Registro de eventos recientes de autenticacion y reservas.
      </p>

      {logs.length === 0 ? (
        <div className="card">
          <p className="text-sm text-muted-foreground">No hay acciones registradas.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="app-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Accion</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.usuario}</td>
                  <td>{log.accion}</td>
                  <td>{log.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AuditLogPage;

