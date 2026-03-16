import type { AuditLog } from "../types/types";

type Props = {
  logs: AuditLog[];
};

function AuditLogPage({ logs }: Props) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historial del Sistema</h1>

      {logs.length === 0 ? (
        <p>No hay acciones registradas</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Usuario</th>
              <th className="border p-2">Acción</th>
              <th className="border p-2">Fecha</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="border p-2">{log.usuario}</td>
                <td className="border p-2">{log.accion}</td>
                <td className="border p-2">{log.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AuditLogPage;

