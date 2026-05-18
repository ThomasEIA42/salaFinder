import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function MyReservations() {
  const {
    reservas,
    user,
    cancelarReserva,
    limpiarReservas,
    setEstadoReserva,
  } = useApp();

  const esAdmin = user?.role === "admin";

  return (
    <div className="page max-w-3xl">
      <header className="page-header">
        <h1 className="page-title">Mis reservaciones</h1>
        <p className="page-subtitle">
          {esAdmin
            ? "Como administrador puedes aprobar o rechazar reservas pendientes."
            : "Aquí ves tus reservas guardadas."}
        </p>
      </header>

      {reservas.length === 0 ? (
        <div className="empty-state">
          <p className="text-muted-foreground mb-4">
            No tienes reservas todavía.
          </p>
          <Link to="/" className="btn-link">
            Ver espacios disponibles
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3" style={{ listStyle: "none" }}>
            {reservas.map((r) => (
              <li key={r.id} className="reservation-item">
                <div>
                  <p className="text-sm font-medium">
                    {r.sala.nombre} — {r.fecha} ({r.timeSlot})
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estado:{" "}
                    <span className="badge badge--success">{r.estado}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {esAdmin && r.estado === "pendiente" && (
                    <>
                      <button
                        type="button"
                        className="btn-approve"
                        onClick={() => setEstadoReserva(r.id, "aprobada")}
                      >
                        Aprobar
                      </button>
                      <button
                        type="button"
                        className="btn-reject"
                        onClick={() => setEstadoReserva(r.id, "rechazada")}
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => cancelarReserva(r.id)}
                    className="btn-danger-text"
                  >
                    Cancelar reserva
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={limpiarReservas}
            className="btn-danger-text mt-6"
          >
            Limpiar todas (demo)
          </button>
        </>
      )}
    </div>
  );
}
