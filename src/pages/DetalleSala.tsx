import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Sala } from "../types/types";
import { fakeApi } from "../fakeapi/FakeApi";
import { useApp } from "../context/AppContext";
import { etiquetaTipoSala } from "../utils/tipoSala";

export default function DetalleSala() {
  const { id } = useParams();
  const { crearReserva, reservas, showToast } = useApp();
  const [sala, setSala] = useState<Sala | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fecha, setFecha] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const numId = Number(id);
    if (!id || Number.isNaN(numId)) {
      setError("ID de sala no válido.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const s = await fakeApi.obtenerSalaPorId(numId);
        if (!cancelled) setSala(s);
      } catch (e) {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : "No se pudo cargar la sala."
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function intentarReservar() {
    if (!sala) return;
    if (sala.estado === "MANTENIMIENTO") {
      showToast("No se puede reservar: sala en mantenimiento.", "error");
      return;
    }
    setFecha("");
    setTimeSlot("");
    setModalOpen(true);
  }

  function confirmar() {
    if (!sala || !fecha || !timeSlot) return;
    const conflicto = reservas.some(
      (r) =>
        r.sala.id === sala.id && r.fecha === fecha && r.timeSlot === timeSlot
    );
    if (conflicto) {
      showToast("Conflicto: ya hay reserva en esa fecha y hora.", "error");
      return;
    }
    crearReserva(sala, fecha, timeSlot);
    setModalOpen(false);
  }

  if (loading) {
    return (
      <div className="p-6">
        <p role="status">Cargando sala</p>
      </div>
    );
  }

  if (error || !sala) {
    return (
      <div className="p-6" role="alert">
        <p className="text-red-400 mb-4">{error || "Sala no encontrada."}</p>
        <Link to="/" className="text-brand-700 underline">
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl">
      <Link to="/" className="text-sm text-brand-700 underline mb-4 inline-block">
        Espacios
      </Link>
      <h1 className="text-2xl font-bold mb-4">{sala.nombre}</h1>
      <ul className="space-y-2 text-sm text-muted-foreground mb-6">
        <li>Tipo: {etiquetaTipoSala(sala.tipo)}</li>
        <li>Capacidad: {sala.capacidad}</li>
        <li>Edificio: {sala.edificio}</li>
        <li>
          Estado:{" "}
          <strong>
            {sala.estado === "DISPONIBLE" ? "Disponible" : "Mantenimiento"}
          </strong>
        </li>
      </ul>

      {sala.estado === "DISPONIBLE" ? (
        <button type="button" onClick={intentarReservar}>
          Reservar
        </button>
      ) : (
        <p className="text-amber-400 text-sm">
          No disponible para reserva (mantenimiento).
        </p>
      )}

      {modalOpen && (
        <div
          className="modal-overlay mt-0"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detalle-modal-titulo"
        >
          <div className="modal-content">
            <h2 id="detalle-modal-titulo" className="text-lg font-bold mb-3">
              Reservar {sala.nombre}
            </h2>
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="det-fecha" className="block text-sm mb-1">
                  Fecha
                </label>
                <input
                  id="det-fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="det-slot" className="block text-sm mb-1">
                  Franja
                </label>
                <select
                  id="det-slot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  required
                >
                  <option value="">Selecciona…</option>
                  <option value="09:00-11:00">09:00–11:00</option>
                  <option value="14:00-16:00">14:00–16:00</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  className="border border-border bg-transparent px-3 py-2"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="button" onClick={confirmar}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
