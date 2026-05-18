import {
  FiActivity,
  FiCheckCircle,
  FiEye,
  FiLogIn,
  FiPlusCircle,
  FiXCircle,
} from "react-icons/fi";
import type { AuditLog } from "../types/types";
import type { IconType } from "react-icons";

type Props = {
  logs: AuditLog[];
};

function parseAccion(accion: string) {
  const idx = accion.indexOf(": ");
  if (idx === -1) return { tipo: accion, detalle: "" };
  return { tipo: accion.slice(0, idx), detalle: accion.slice(idx + 2) };
}

function accionMeta(tipo: string): { className: string; Icon: IconType } {
  if (tipo.includes("Inició")) {
    return { className: "audit-action--login", Icon: FiLogIn };
  }
  if (tipo.includes("Consultó")) {
    return { className: "audit-action--view", Icon: FiEye };
  }
  if (tipo.includes("Creó")) {
    return { className: "audit-action--create", Icon: FiPlusCircle };
  }
  if (tipo.includes("Canceló")) {
    return { className: "audit-action--cancel", Icon: FiXCircle };
  }
  if (tipo.includes("Aprobó")) {
    return { className: "audit-action--approve", Icon: FiCheckCircle };
  }
  return { className: "audit-action--default", Icon: FiActivity };
}

export default function AuditLogTable({ logs }: Props) {
  return (
    <div className="page audit-page">
      <header className="page-header">
        <h1 className="page-title">Historial del sistema</h1>
        <p className="page-subtitle">
          Registro de actividades de usuarios en salas y reservas (solo
          administradores).
        </p>
      </header>

      <section className="card card--static audit-panel">
        <div className="audit-panel-head">
          <div>
            <h2 className="audit-panel-title">Actividad reciente</h2>
            <p className="audit-panel-desc">
              {logs.length} evento{logs.length !== 1 ? "s" : ""} registrados
            </p>
          </div>
          <span className="audit-panel-badge">
            <FiActivity aria-hidden />
            Auditoría
          </span>
        </div>

        {logs.length === 0 ? (
          <p className="audit-empty">No hay acciones registradas.</p>
        ) : (
          <div className="audit-table-wrap">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Fecha y hora</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const { tipo, detalle } = parseAccion(log.accion);
                  const { className, Icon } = accionMeta(tipo);
                  return (
                    <tr key={log.id}>
                      <td>
                        <span className="audit-user">{log.usuario}</span>
                      </td>
                      <td>
                        <div className="audit-action-cell">
                          <span
                            className={`audit-action ${className}`}
                            title={tipo}
                          >
                            <Icon aria-hidden />
                            {tipo}
                          </span>
                          {detalle ? (
                            <span className="audit-action-detail">{detalle}</span>
                          ) : null}
                        </div>
                      </td>
                      <td>
                        <time className="audit-date">{log.fecha}</time>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
