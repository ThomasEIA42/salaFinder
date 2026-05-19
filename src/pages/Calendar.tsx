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

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

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
      <div className="page">
        <p>Debes iniciar sesión.</p>
        <Link to="/login">Iniciar sesión</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page">
        <p>Cargando…</p>
      </div>
    );
  }

  return (
    <div className="page cal-simple">
      <h1 className="page-title">Calendario</h1>

      <div className="cal-simple-nav">
        <button
          type="button"
          onClick={() =>
            setMonthCursor(
              (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)
            )
          }
        >
          ← Anterior
        </button>
        <strong className="cal-simple-month">{monthLabel(monthCursor)}</strong>
        <button
          type="button"
          onClick={() =>
            setMonthCursor(
              (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)
            )
          }
        >
          Siguiente →
        </button>
      </div>

      <table className="cal-simple-table">
        <thead>
          <tr>
            {WEEKDAYS.map((w) => (
              <th key={w}>{w}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: days.length / 7 }, (_, week) => (
            <tr key={week}>
              {days.slice(week * 7, week * 7 + 7).map((cell) => {
                if (!cell.inMonth) {
                  return <td key={cell.key} className="cal-simple-off" />;
                }
                const count = reservasPorFecha.get(cell.key)?.length ?? 0;
                const selected = cell.key === fechaSeleccionada;
                return (
                  <td key={cell.key}>
                    <button
                      type="button"
                      className={
                        selected ? "cal-simple-day cal-simple-day--on" : "cal-simple-day"
                      }
                      onClick={() => setFechaSeleccionada(cell.key)}
                    >
                      {cell.day}
                      {count > 0 ? ` (${count})` : ""}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <section className="cal-simple-detail">
        <h2>Reservas del {fechaSeleccionada}</h2>
        {reservasDelDia.length === 0 ? (
          <p className="text-muted-foreground">Ninguna.</p>
        ) : (
          <ul>
            {reservasDelDia.map((r) => (
              <li key={r.id_reservation}>
                {formatApiTime(r.startTime)}–{formatApiTime(r.endTime)} —{" "}
                {r.space?.name ?? "Sala"} ({r.status})
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4">
          <Link to="/reservations">Mis reservaciones</Link>
        </p>
      </section>
    </div>
  );
}
