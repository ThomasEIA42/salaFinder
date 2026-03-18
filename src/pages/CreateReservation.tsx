import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Sala } from "../types/types";
import { fakeApi } from "../fakeapi/FakeApi";
import { useApp } from "../context/AppContext";

export default function CreateReservation() {
  const { reservas, crearReserva, showToast } = useApp();
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
      setSalaId((prev) => {
        if (prev !== "") return prev;
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
  }, []);

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
    const conflicto = reservas.some(
      (r) => r.sala.id === sala.id && r.fecha === fecha && r.timeSlot === timeSlot
    );
    if (conflicto) {
      showToast(
        "Ya existe una reserva para esa sala, fecha y franja.",
        "error"
      );
      return;
    }
    crearReserva(sala, fecha, timeSlot);
  }

  if (loading) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <p role="status">Cargando espacios…</p>
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
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">Nueva reserva</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Elige espacio, día y tiempo. Las reservas quedan{" "}
        <strong>pendientes</strong> hasta que un admin las apruebe (demo).
      </p>

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
            <option value="07:00-09:00">07:00–09:00</option>
            <option value="09:00-11:00">09:00–11:00</option>
            <option value="11:00-13:00">11:00–13:00</option>
            <option value="14:00-16:00">14:00–16:00</option>
            <option value="16:00-18:00">16:00–18:00</option>
          </select>
        </div>
        <button type="submit">Crear reserva</button>
      </form>

      <p className="mt-6 text-sm">
        <Link to="/" className="text-brand-700 underline">
          ← Volver a espacios
        </Link>
      </p>
    </div>
  );
}
