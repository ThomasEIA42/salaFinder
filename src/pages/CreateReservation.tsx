import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Sala } from "../types/types";
import { fakeApi } from "../fakeapi/FakeApi";
import { useApp } from "../context/AppContext";
import {
  fechaHoyLocal,
  FRANJAS_HORARIAS,
  validarFechaHorarioReserva,
} from "../utils/reservas";

export default function CreateReservation() {
  const { crearReserva, showToast } = useApp();
  const hoy = fechaHoyLocal();
  const [searchParams] = useSearchParams();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [salaId, setSalaId] = useState<number | "">("");
  const [fecha, setFecha] = useState("");
  const [timeSlot, setTimeSlot] = useState("09:00-11:00");

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fakeApi.obtenerSalas();
      setSalas(data);
      const requestedRaw = searchParams.get("salaId");
      const requestedId = requestedRaw ? Number(requestedRaw) : NaN;
      const requestedSala = Number.isFinite(requestedId)
        ? data.find((s) => s.id === requestedId)
        : undefined;
      setSalaId((prev) => {
        if (prev !== "") return prev;
        if (requestedSala) return requestedSala.id;
        if (!data.length) return "";
        const firstDisp = data.find((s) => s.estado === "DISPONIBLE");
        return (firstDisp ?? data[0]).id;
      });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudieron cargar los espacios."
      );
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const id = Number(salaId);
    const sala = salas.find((s) => s.id === id);
    if (!sala || !fecha || !timeSlot) return;
    if (sala.estado === "MANTENIMIENTO") {
      showToast("Ese espacio está en mantenimiento.", "error");
      return;
    }
    const validacion = validarFechaHorarioReserva(fecha, timeSlot);
    if (!validacion.ok) {
      showToast(validacion.message, "error");
      return;
    }
    crearReserva(sala, fecha, timeSlot);
  }

  if (loading) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <p role="status">Cargando espacios</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto" role="alert">
        <p className="text-red-400 mb-4">{error}</p>
        <button type="button" onClick={() => cargar()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="page max-w-lg">
      <header className="page-header">
        <h1 className="page-title">Nueva reserva</h1>
        <p className="page-subtitle">
        Elige espacio, día y tiempo. La solicitud queda{" "}
        <strong>en espera de aprobación</strong> y solo se confirma cuando el
        administrador la apruebe.
        </p>
      </header>

      <form onSubmit={enviar} className="flex flex-col gap-4">
        <div>
          <label htmlFor="cr-sala" className="block text-sm font-medium mb-1">
            Espacio
          </label>
          <select
            id="cr-sala"
            value={salaId === "" ? "" : String(salaId)}
            onChange={(e) =>
              setSalaId(e.target.value ? Number(e.target.value) : "")
            }
            required
          >
            {salas.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
                {s.estado === "MANTENIMIENTO" ? " (mantenimiento)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cr-fecha" className="block text-sm font-medium mb-1">
            Fecha
          </label>
          <input
            id="cr-fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            min={hoy}
            required
          />
        </div>
        <div>
          <label htmlFor="cr-slot" className="block text-sm font-medium mb-1">
            Tiempo entre sala
          </label>
          <select
            id="cr-slot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
          >
            {FRANJAS_HORARIAS.map((franja) => (
              <option key={franja} value={franja}>
                {franja.replace("-", "–")}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Enviar solicitud</button>
      </form>

      <p className="mt-6">
        <Link to="/" className="link-back">
          ← Volver a espacios
        </Link>
      </p>
    </div>
  );
}
