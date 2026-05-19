import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getSpaces, createReservation, type Space } from "../api/api";
import { useApp } from "../context/AppContext";

const TIME_SLOTS = [
  { label: "07:00–09:00", start: "07:00:00", end: "09:00:00" },
  { label: "09:00–11:00", start: "09:00:00", end: "11:00:00" },
  { label: "11:00–13:00", start: "11:00:00", end: "13:00:00" },
  { label: "14:00–16:00", start: "14:00:00", end: "16:00:00" },
  { label: "16:00–18:00", start: "16:00:00", end: "18:00:00" },
];

export default function CreateReservation() {
  const { showToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [salas, setSalas] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [salaId, setSalaId] = useState("");
  const [fecha, setFecha] = useState("");
  const [slotIndex, setSlotIndex] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [userProgram, setUserProgram] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSpaces();
      setSalas(data);
      const preselected = searchParams.get("spaceId");
      const match = preselected
        ? data.find((s) => s.id_space === preselected && s.isActive)
        : undefined;
      const first = match ?? data.find((s) => s.isActive);
      if (first) setSalaId(first.id_space);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar los espacios.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!salaId || !fecha || !purpose || !userProgram) return;
    setSubmitting(true);
    try {
      const slot = TIME_SLOTS[slotIndex];
      await createReservation({
        spaceId: salaId,
        date: fecha,
        startTime: slot.start,
        endTime: slot.end,
        purpose,
        attendeeCount,
        userProgram,
      });
      showToast("Reserva creada correctamente.", "success");
      navigate("/reservations");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al crear la reserva.";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p className="state-loading" role="status">
          Cargando espacios…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page" role="alert">
        <div className="alert-error">
          <p>{error}</p>
          <button type="button" onClick={() => void cargar()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page max-w-lg mx-auto">
      <header className="page-header">
        <h1 className="page-title">Nueva reserva</h1>
        <p className="page-subtitle">
          Las reservas quedan pendientes hasta que un administrador las apruebe, si el
          espacio lo requiere.
        </p>
      </header>

      <section className="card card--static">
        <form onSubmit={enviar} className="form--plain flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span>Espacio</span>
            <select
              id="cr-sala"
              value={salaId}
              onChange={(e) => setSalaId(e.target.value)}
              required
            >
              {salas.map((s) => (
                <option key={s.id_space} value={s.id_space}>
                  {s.name} — {s.building} (cap. {s.capacity})
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span>Fecha</span>
            <input
              id="cr-fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span>Horario</span>
            <select
              id="cr-slot"
              value={slotIndex}
              onChange={(e) => setSlotIndex(Number(e.target.value))}
            >
              {TIME_SLOTS.map((s, i) => (
                <option key={s.label} value={i}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span>Propósito</span>
            <input
              id="cr-purpose"
              type="text"
              placeholder="Ej: Clase de cálculo"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span>Tu programa</span>
            <input
              id="cr-program"
              type="text"
              placeholder="Ej: Ingeniería o Todos"
              value={userProgram}
              onChange={(e) => setUserProgram(e.target.value)}
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span>Número de asistentes</span>
            <input
              id="cr-attendees"
              type="number"
              min={1}
              value={attendeeCount}
              onChange={(e) => setAttendeeCount(Number(e.target.value))}
              required
            />
          </label>

          <button type="submit" disabled={submitting}>
            {submitting ? "Creando…" : "Crear reserva"}
          </button>
        </form>
      </section>

      <p className="mt-6 text-sm">
        <Link to="/" className="link-back">
          ← Volver a espacios
        </Link>
      </p>
    </div>
  );
}
