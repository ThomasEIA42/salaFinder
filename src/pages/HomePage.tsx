import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Sala } from "../types/types";
import { useApp } from "../context/AppContext";
import { fakeApi } from "../fakeapi/FakeApi";
import { etiquetaTipoSala } from "../utils/tipoSala";

export default function HomePage() {
  const { reservas, crearReserva, showToast } = useApp();

  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<string>("");
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  const [salaSeleccionada, setSalaSeleccionada] = useState<Sala | null>(null);
  const [fechaReserva, setFechaReserva] = useState("");
  const [franjaHoraria, setFranjaHoraria] = useState("");
  const [asistentes, setAsistentes] = useState(1);
  const [errorReserva, setErrorReserva] = useState<string | null>(null);

  const cargarSalas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fakeApi.obtenerSalas();
      setSalas(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Error al cargar espacios."
      );
      setSalas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarSalas();
  }, [cargarSalas]);

  const filtradas = useMemo(() => {
    return salas.filter((s) => {
      const matchNombre = s.nombre
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchTipo = !tipoFiltro || s.tipo === tipoFiltro;
      const matchDisp =
        !soloDisponibles || s.estado === "DISPONIBLE";
      return matchNombre && matchTipo && matchDisp;
    });
  }, [salas, search, tipoFiltro, soloDisponibles]);

  function abrirModal(sala: Sala) {
    if (sala.estado === "MANTENIMIENTO") {
      showToast("Este espacio no se puede reservar (en mantenimiento).", "error");
      return;
    }
    setSalaSeleccionada(sala);
    setFechaReserva("");
    setFranjaHoraria("");
    setAsistentes(1);
    setErrorReserva(null);
  }

  function cerrarModal() {
    setSalaSeleccionada(null);
    setFechaReserva("");
    setFranjaHoraria("");
    setAsistentes(1);
    setErrorReserva(null);
  }

  function confirmarReserva() {
    if (!salaSeleccionada || !fechaReserva || !franjaHoraria) return;

    const existeConflicto = reservas.some(
      (r) =>
        r.sala.id === salaSeleccionada.id &&
        r.fecha === fechaReserva &&
        r.timeSlot === franjaHoraria
    );

    if (existeConflicto) {
      setErrorReserva(
        "Ya existe una reserva para esta sala en la misma fecha y hora."
      );
      return;
    }

    setErrorReserva(null);
    crearReserva(salaSeleccionada, fechaReserva, franjaHoraria);
    cerrarModal();
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="mb-2 text-2xl font-bold">Espacios disponibles</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Busca, filtra y reserva salas, laboratorios y auditorios (fake API
        async).
      </p>

      {/* Filtros de búsqueda */}
      <div
        className="mb-6 flex flex-col gap-4 rounded-lg border border-border bg-surface/50 p-4 md:flex-row md:flex-wrap md:items-end"
        role="search"
        aria-label="Filtros de espacios"
      >
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="filtro-busqueda" className="mb-1 block text-sm font-medium">
            Buscar
          </label>
          <input
            id="filtro-busqueda"
            type="search"
            placeholder="Nombre del espacio…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
            autoComplete="off"
          />
        </div>
        <div className="w-full min-w-[140px] md:w-44">
          <label htmlFor="filtro-tipo" className="mb-1 block text-sm font-medium">
            Tipo
          </label>
          <select
            id="filtro-tipo"
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="w-full"
          >
            <option value="">Todos</option>
            <option value="SALON">Salón</option>
            <option value="LABORATORIO">Laboratorio</option>
            <option value="AUDITORIO">Auditorio</option>
          </select>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={soloDisponibles}
            onChange={(e) => setSoloDisponibles(e.target.checked)}
          />
          Solo disponibles
        </label>
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setTipoFiltro("");
            setSoloDisponibles(false);
          }}
          className="border border-border bg-transparent px-3 py-2 text-sm"
        >
          Reset
        </button>
        <p className="text-sm text-muted-foreground md:ml-auto">
          Resultados: {filtradas.length}
        </p>
      </div>

      {loading && (
        <p className="py-8 text-center text-muted-foreground" role="status">
          Cargando espacios
        </p>
      )}

      {!loading && error && (
        <div
          className="rounded-lg border border-red-500/40 bg-red-950/30 p-4"
          role="alert"
        >
          <p className="mb-2 font-medium text-red-200">{error}</p>
          <button type="button" onClick={cargarSalas}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtradas.map((sala) => (
            <article key={sala.id} className="card relative">
              <div className="absolute right-3 top-3">
                <span
                  className={`rounded px-2 py-0.5 text-xs font-semibold ${
                    sala.estado === "DISPONIBLE"
                      ? "bg-emerald-900/60 text-emerald-200"
                      : "bg-amber-900/60 text-amber-200"
                  }`}
                >
                  {sala.estado === "DISPONIBLE" ? "DISPONIBLE" : "MANTENIMIENTO"}
                </span>
              </div>
              <h3 className="text-lg font-semibold pr-24">{sala.nombre}</h3>
              <p className="text-xs text-muted-foreground mb-1">
                {etiquetaTipoSala(sala.tipo)}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                Capacidad: {sala.capacidad} personas
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                {sala.edificio}
              </p>

              <div className="flex justify-between items-center mt-2">
                <Link
                  to={`/sala/${sala.id}`}
                  className="text-xs font-semibold text-brand-700 hover:underline"
                >
                  Ver detalle
                </Link>
                {sala.estado === "DISPONIBLE" ? (
                  <button type="button" onClick={() => abrirModal(sala)}>
                    Reservar
                  </button>
                ) : (
                  <button type="button" disabled className="opacity-50 cursor-not-allowed">
                    No disponible
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && filtradas.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">
          No hay espacios que coincidan con los filtros.
        </p>
      )}

      {salaSeleccionada && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-reserva-titulo"
        >
          <div className="modal-content">
            <h2 id="modal-reserva-titulo" className="mb-1 text-xl font-bold">
              Crear reserva
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              <span className="font-semibold">{salaSeleccionada.nombre}</span>{" "}
              ({etiquetaTipoSala(salaSeleccionada.tipo)}) — Capacidad:{" "}
              {salaSeleccionada.capacidad}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                confirmarReserva();
              }}
              className="flex flex-col gap-3"
            >
              {errorReserva ? (
                <p role="alert" className="text-sm font-semibold text-red-400">
                  {errorReserva}
                </p>
              ) : null}
              <div>
                <label
                  htmlFor="reserva-fecha"
                  className="block text-sm font-medium mb-1"
                >
                  Día
                </label>
                <input
                  id="reserva-fecha"
                  type="date"
                  value={fechaReserva}
                  onChange={(e) => setFechaReserva(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="reserva-timeslot"
                  className="block text-sm font-medium mb-1"
                >
                  Franja horaria
                </label>
                <select
                  id="reserva-timeslot"
                  value={franjaHoraria}
                  onChange={(e) => setFranjaHoraria(e.target.value)}
                  required
                >
                  <option value="">Selecciona…</option>
                  <option value="07:00-09:00">07:00–09:00</option>
                  <option value="09:00-11:00">09:00–11:00</option>
                  <option value="11:00-13:00">11:00–13:00</option>
                  <option value="14:00-16:00">14:00–16:00</option>
                  <option value="16:00-18:00">16:00–18:00</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="reserva-asistentes"
                  className="block text-sm font-medium mb-1"
                >
                  Asistentes (1–20)
                </label>
                <input
                  id="reserva-asistentes"
                  type="number"
                  min={1}
                  max={20}
                  value={asistentes}
                  onChange={(e) =>
                    setAsistentes(Number(e.target.value) || 1)
                  }
                  required
                />
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="border border-border bg-transparent text-sm px-4 py-2"
                >
                  Cancelar
                </button>
                <button type="submit" className="text-sm px-4 py-2">
                  Crear reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
