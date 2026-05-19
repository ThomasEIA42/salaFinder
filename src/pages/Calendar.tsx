import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllReservations,
  getReservationsByUser,
  formatApiDate,
  formatApiTime,
  type Reservation,
} from "../api/api";
import { useApp } from "../context/AppContext";

const WEEKDAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
}

export default function Calendar() {
  const { user, showToast } = useApp();
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [fechaSeleccionada, setFechaSeleccionada] = useState(() =>
    toDateKey(new Date())
  );

  const cargar = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data =
        user.role === "Admin"
          ? await getAllReservations()
          : await getReservationsByUser(user.id);
      setReservas(data);
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Error al cargar reservas.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const reservasPorFecha = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    for (const r of reservas) {
      const key = formatApiDate(r.date);
      const prev = map.get(key) ?? [];
      prev.push(r);
      map.set(key, prev);
    }
    return map;
  }, [reservas]);

  const days = useMemo(() => {
    const y = monthCursor.getFullYear();
    const m = monthCursor.getMonth();
    const firstDay = new Date(y, m, 1);
    const monthDays = new Date(y, m + 1, 0).getDate();
    const startOffset = (firstDay.getDay() + 6) % 7;
    const cells: Array<{ key: string; day: number; inMonth: boolean }> = [];

    for (let i = 0; i < startOffset; i++) {
      cells.push({ key: `empty-start-${i}`, day: 0, inMonth: false });
    }
    for (let day = 1; day <= monthDays; day++) {
      const date = new Date(y, m, day);
      cells.push({ key: toDateKey(date), day, inMonth: true });
    }
    while (cells.length % 7 !== 0) {
      const i = cells.length;
      cells.push({ key: `empty-end-${i}`, day: 0, inMonth: false });
    }
    return cells;
  }, [monthCursor]);

  const reservasDelDia = useMemo(() => {
    if (!fechaSeleccionada) return [];
    return (reservasPorFecha.get(fechaSeleccionada) ?? [])
      .slice()
      .sort((a, b) =>
        formatApiTime(a.startTime).localeCompare(formatApiTime(b.startTime))
      );
  }, [reservasPorFecha, fechaSeleccionada]);

  if (!user) {
    return (
      <div className="p-6">
        <p>Debes iniciar sesión para ver el calendario.</p>
        <Link to="/login" className="text-brand-700 underline">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <p role="status">Cargando calendario…</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Calendario de reservas</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Vista mensual de reservas por día y detalle de espacios ocupados.
      </p>

      <div className="card calendar-card">
        <div className="calendar-toolbar">
          <button
            type="button"
            className="calendar-toolbar-btn"
            onClick={() =>
              setMonthCursor(
                (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)
              )
            }
          >
            Mes anterior
          </button>
          <h2 className="text-lg font-semibold capitalize">{monthLabel(monthCursor)}</h2>
          <button
            type="button"
            className="calendar-toolbar-btn"
            onClick={() =>
              setMonthCursor(
                (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)
              )
            }
          >
            Mes siguiente
          </button>
        </div>

        <div className="calendar-grid">
          {WEEKDAYS.map((w) => (
            <div key={w} className="calendar-head">
              {w}
            </div>
          ))}
          {days.map((cell) => {
            if (!cell.inMonth) return <div key={cell.key} className="calendar-empty" />;
            const count = reservasPorFecha.get(cell.key)?.length ?? 0;
            const selected = cell.key === fechaSeleccionada;
            return (
              <button
                key={cell.key}
                type="button"
                className={`calendar-day ${selected ? "calendar-day--active" : ""}`}
                onClick={() => setFechaSeleccionada(cell.key)}
              >
                <span className="calendar-day-number">{cell.day}</span>
                {count > 0 ? (
                  <span className="calendar-day-count">
                    {count} reserva{count > 1 ? "s" : ""}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold">Reservas del día</h2>
          <Link to="/reservations" className="btn-link text-sm">
            Ir a mis reservaciones
          </Link>
        </div>

        {reservasDelDia.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No hay reservas para esta fecha.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {reservasDelDia.map((r) => (
              <li
                key={r.id_reservation}
                className="rounded border border-border bg-surface p-3"
              >
                <p className="text-sm font-medium">
                  {r.space?.name ?? r.spaceId} — {formatApiTime(r.startTime)}–
                  {formatApiTime(r.endTime)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Estado:{" "}
                  <span
                    className={`status-badge ${
                      r.status === "Approved"
                        ? "status-badge--ok"
                        : r.status === "Rejected" || r.status === "Cancelled"
                        ? "status-badge--warn"
                        : ""
                    }`}
                  >
                    {r.status}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
