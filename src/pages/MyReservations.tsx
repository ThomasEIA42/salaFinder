import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  getReservationsByUser,
  getAllReservations,
  formatApiDate,
  formatApiTime,
  type Reservation,
} from "../api/api";

export default function MyReservations() {
  const { user, cancelReservation, approveReservation, rejectReservation, showToast } =
    useApp();
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const esAdmin = user?.role === "Admin";

  const cargar = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = esAdmin
        ? await getAllReservations()
        : await getReservationsByUser(user.id);
      setReservas(data);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Error al cargar reservas.", "error");
    } finally {
      setLoading(false);
    }
  }, [user, esAdmin, showToast]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  async function handleCancel(id: string) {
    await cancelReservation(id);
    void cargar();
  }

  async function handleApprove(id: string) {
    await approveReservation(id);
    void cargar();
  }

  async function handleReject(id: string) {
    await rejectReservation(id);
    void cargar();
  }

  if (loading) {
    return (
      <div className="page">
        <p className="state-loading" role="status">
          Cargando reservas…
        </p>
      </div>
    );
  }

  return (
    <div className="page max-w-3xl">
      <header className="page-header">
        <h1 className="page-title">
          {esAdmin ? "Todas las reservas" : "Mis reservaciones"}
        </h1>
        <p className="page-subtitle">
          {esAdmin
            ? "Como administrador puedes aprobar o rechazar reservas pendientes."
            : "Aquí ves tus reservas del backend."}
        </p>
      </header>

      {reservas.length === 0 ? (
        <div className="empty-state">
          <p className="text-muted-foreground mb-4">No hay reservas.</p>
          <Link to="/" className="btn-link">
            Ver espacios disponibles
          </Link>
        </div>
      ) : (
        <ul style={{ listStyle: "none" }} className="space-y-3">
          {reservas.map((r) => (
            <li key={r.id_reservation} className="reservation-item">
              <div>
                <p className="text-sm font-medium">
                  {r.space?.name ?? r.spaceId} — {formatApiDate(r.date)} (
                  {formatApiTime(r.startTime)} - {formatApiTime(r.endTime)})
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Propósito: {r.purpose} · Asistentes: {r.attendeeCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Estado: <span className="badge badge--warning">{r.status}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {esAdmin && r.status === "Pending" && (
                  <>
                    <button
                      type="button"
                      className="btn-approve"
                      onClick={() => void handleApprove(r.id_reservation)}
                    >
                      Aprobar
                    </button>
                    <button
                      type="button"
                      className="btn-reject"
                      onClick={() => void handleReject(r.id_reservation)}
                    >
                      Rechazar
                    </button>
                  </>
                )}
                {(r.status === "Pending" || r.status === "Approved") && (
                  <button
                    type="button"
                    onClick={() => void handleCancel(r.id_reservation)}
                    className="btn-danger-text"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
