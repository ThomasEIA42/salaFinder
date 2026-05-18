import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Calendar() {
  const { reservas } = useApp();
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  const reservasDelDia = useMemo(() => {
    if (!fechaSeleccionada) return [];
    return reservas
      .filter((r) => r.fecha === fechaSeleccionada)
      .slice()
      .sort((a, b) => (a.timeSlot > b.timeSlot ? 1 : -1));
  }, [reservas, fechaSeleccionada]);

  return (
    <div className="page max-w-4xl">
      <header className="page-header">
        <h1 className="page-title">Calendario de reservas</h1>
        <p className="page-subtitle">
          Selecciona una fecha para ver qué reservas hay ese día.
        </p>
      </header>

      <section className="card card--static">
        <label className="block text-sm font-medium mb-2" htmlFor="cal-fecha">
          Fecha
        </label>
        <input
          id="cal-fecha"
          type="date"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        />

        <div className="mt-4 flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold">Reservas del día</h2>
          <Link to="/reservations" className="text-sm text-brand-700 underline">
            Ir a “Mis reservaciones”
          </Link>
        </div>

        {!fechaSeleccionada ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Elige una fecha para ver resultados.
          </p>
        ) : reservasDelDia.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No hay reservas para esta fecha.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {reservasDelDia.map((r) => (
              <li key={r.id} className="reservation-item">
                <p className="text-sm font-medium">
                  {r.sala.nombre} — {r.timeSlot}
                </p>
                <p className="text-xs text-muted-foreground">
                  Estado: <strong>{r.estado}</strong>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}