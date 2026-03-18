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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="mb-2 text-2xl font-bold">Mis reservaciones</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {esAdmin
          ? "Como administrador puedes aprobar o rechazar reservas pendientes."
          : "Aquí ves tus reservas guardadas."}
      </p>

      {reservas.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground mb-4">
            No tienes reservas todavía.
          </p>
          <Link to="/" className="text-brand-700 font-semibold underline">
            Ver espacios disponibles
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {reservas.map((r) => (
              <li
                key={r.id}
                className="flex flex-col gap-2 rounded border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">
                    {r.sala.nombre} — {r.fecha} ({r.timeSlot})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Estado: <strong>{r.estado}</strong>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {esAdmin && r.estado === "pendiente" && (
                    <>
                      <button
                        type="button"
                        className="bg-emerald-800 text-white text-xs px-3 py-1.5 rounded"
                        onClick={() => setEstadoReserva(r.id, "aprobada")}
                      >
                        Aprobar
                      </button>
                      <button
                        type="button"
                        className="bg-amber-900 text-white text-xs px-3 py-1.5 rounded"
                        onClick={() => setEstadoReserva(r.id, "rechazada")}
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => cancelarReserva(r.id)}
                    className="text-xs text-red-400 underline bg-transparent px-0"
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
            className="mt-4 text-xs text-muted-foreground underline"
          >
            Limpiar todas (demo)
          </button>
        </>
      )}
    </div>
  );
}
