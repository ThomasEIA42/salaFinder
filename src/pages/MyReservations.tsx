import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { etiquetaEstadoReserva } from "../utils/reservas";

function badgeClass(estado: string): string {
  if (estado === "aprobada") return "badge badge--success";
  if (estado === "pendiente") return "badge badge--pending";
  if (estado === "rechazada") return "badge badge--warn";
  return "badge";
}

export default function MyReservations() {
  const {
    reservas,
    solicitudes,
    user,
    aprobarSolicitud,
    rechazarSolicitud,
    cancelarReserva,
    cancelarSolicitud,
    limpiarReservas,
  } = useApp();

  const esAdmin = user?.role === "admin";
  const email = user?.email ?? "";

  const misSolicitudes = solicitudes.filter(
    (s) => s.solicitanteEmail === email
  );
  const misReservas = reservas.filter((r) => r.solicitanteEmail === email);
  const pendientesAdmin = solicitudes.filter((s) => s.estado === "pendiente");

  const vacio =
    !esAdmin && misSolicitudes.length === 0 && misReservas.length === 0;

  return (
    <div className="page max-w-3xl">
      <header className="page-header">
        <h1 className="page-title">Mis reservaciones</h1>
        <p className="page-subtitle">
          {esAdmin
            ? "Aprueba o rechaza solicitudes. Solo las aprobadas quedan confirmadas."
            : "Tus solicitudes quedan en espera hasta que el administrador las apruebe."}
        </p>
      </header>

      {esAdmin && pendientesAdmin.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Pendientes de aprobación</h2>
          <ul className="space-y-3" style={{ listStyle: "none" }}>
            {pendientesAdmin.map((r) => (
              <li key={r.id} className="reservation-item">
                <div>
                  <p className="text-sm font-medium">
                    {r.sala.nombre} — {r.fecha} ({r.timeSlot})
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Solicitante: {r.solicitanteNombre} ({r.solicitanteEmail})
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className={badgeClass(r.estado)}>
                      {etiquetaEstadoReserva(r.estado)}
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-approve"
                    onClick={() => aprobarSolicitud(r.id)}
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    className="btn-reject"
                    onClick={() => rechazarSolicitud(r.id)}
                  >
                    Rechazar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {esAdmin && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Reservas confirmadas</h2>
          {reservas.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay reservas aprobadas.</p>
          ) : (
            <ul className="space-y-3" style={{ listStyle: "none" }}>
              {reservas.map((r) => (
                <li key={r.id} className="reservation-item">
                  <div>
                    <p className="text-sm font-medium">
                      {r.sala.nombre} — {r.fecha} ({r.timeSlot})
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {r.solicitanteNombre} —{" "}
                      <span className={badgeClass(r.estado)}>
                        {etiquetaEstadoReserva(r.estado)}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-danger-text"
                    onClick={() => cancelarReserva(r.id)}
                  >
                    Cancelar reserva
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {!esAdmin && vacio && (
        <div className="empty-state">
          <p className="text-muted-foreground mb-4">
            No tienes solicitudes ni reservas todavía.
          </p>
          <Link to="/reservar" className="btn-link">
            Crear solicitud de reserva
          </Link>
        </div>
      )}

      {!esAdmin && misSolicitudes.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Mis solicitudes</h2>
          <ul className="space-y-3" style={{ listStyle: "none" }}>
            {misSolicitudes.map((r) => (
              <li key={r.id} className="reservation-item">
                <div>
                  <p className="text-sm font-medium">
                    {r.sala.nombre} — {r.fecha} ({r.timeSlot})
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className={badgeClass(r.estado)}>
                      {etiquetaEstadoReserva(r.estado)}
                    </span>
                  </p>
                </div>
                {r.estado === "pendiente" && (
                  <button
                    type="button"
                    className="btn-danger-text"
                    onClick={() => cancelarSolicitud(r.id)}
                  >
                    Cancelar solicitud
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!esAdmin && misReservas.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Reservas confirmadas</h2>
          <ul className="space-y-3" style={{ listStyle: "none" }}>
            {misReservas.map((r) => (
              <li key={r.id} className="reservation-item">
                <div>
                  <p className="text-sm font-medium">
                    {r.sala.nombre} — {r.fecha} ({r.timeSlot})
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className={badgeClass(r.estado)}>
                      {etiquetaEstadoReserva(r.estado)}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {esAdmin && pendientesAdmin.length === 0 && (
        <p className="text-sm text-muted-foreground mb-4">
          No hay solicitudes pendientes por aprobar.
        </p>
      )}

      {esAdmin && (
        <button
          type="button"
          onClick={limpiarReservas}
          className="btn-danger-text mt-6"
        >
          Limpiar todo (demo)
        </button>
      )}
    </div>
  );
}
