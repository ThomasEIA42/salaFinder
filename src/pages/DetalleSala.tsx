import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiLayers,
  FiMapPin,
  FiMic,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import type { Sala, TipoSala } from "../types/types";
import { fakeApi } from "../fakeapi/FakeApi";
import { useApp } from "../context/AppContext";
import { loginRedirectState, reservarReturnTo } from "../utils/authRedirect";
import { etiquetaTipoSala, heroTipoSala } from "../utils/tipoSala";

function IconoTipo({ tipo }: { tipo: TipoSala }) {
  const className = "detail-hero-icon";
  switch (tipo) {
    case "LABORATORIO":
      return <FiCpu className={className} aria-hidden />;
    case "AUDITORIO":
      return <FiMic className={className} aria-hidden />;
    default:
      return <FiBookOpen className={className} aria-hidden />;
  }
}

export default function DetalleSala() {
  const { id } = useParams();
  const { user, crearReserva, reservas, showToast } = useApp();
  const navigate = useNavigate();
  const hoy = new Date().toISOString().slice(0, 10);
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

  const reservasSala = useMemo(() => {
    if (!sala) return [];
    return reservas
      .filter((r) => r.sala.id === sala.id)
      .slice()
      .sort((a, b) => (a.fecha > b.fecha ? 1 : a.fecha < b.fecha ? -1 : 0));
  }, [reservas, sala]);

  const proximasReservas = useMemo(
    () => reservasSala.filter((r) => r.fecha >= hoy).slice(0, 5),
    [reservasSala, hoy]
  );

  function irAReservar() {
    if (!sala) return;
    if (!user) {
      showToast("Inicia sesión para reservar.", "error");
      navigate("/login", {
        state: loginRedirectState(reservarReturnTo(sala.id)),
      });
      return;
    }
    if (sala.estado === "MANTENIMIENTO") {
      showToast("No se puede reservar: sala en mantenimiento.", "error");
      return;
    }
    setFecha("");
    setTimeSlot("");
    setModalOpen(true);
  }

  function confirmar() {
    if (!user) {
      showToast("Inicia sesión para reservar.", "error");
      return;
    }
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
      <div className="page detail-page">
        <div className="detail-skeleton">
          <div className="detail-skeleton-hero" />
          <div className="detail-skeleton-grid">
            <div className="detail-skeleton-block" />
            <div className="detail-skeleton-aside" />
          </div>
        </div>
        <p className="state-loading" role="status">
          Cargando espacio…
        </p>
      </div>
    );
  }

  if (error || !sala) {
    return (
      <div className="page detail-page" role="alert">
        <div className="alert-error">
          <p>{error || "Sala no encontrada."}</p>
        </div>
        <Link to="/" className="link-back mt-4 inline-block">
          ← Volver al listado
        </Link>
      </div>
    );
  }

  const disponible = sala.estado === "DISPONIBLE";

  return (
    <div className="page detail-page">
      <Link to="/" className="link-back">
        ← Espacios
      </Link>

      <header className={`detail-hero ${heroTipoSala(sala.tipo)}`}>
        <div className="detail-hero-inner">
          <div className="detail-hero-icon-wrap">
            <IconoTipo tipo={sala.tipo} />
          </div>
          <div className="detail-hero-text">
            <div className="detail-hero-meta">
              <span
                className={`badge ${
                  disponible ? "badge--success" : "badge--warning"
                }`}
              >
                {disponible ? "Disponible" : "Mantenimiento"}
              </span>
              <span className="detail-hero-tipo">
                {etiquetaTipoSala(sala.tipo)}
              </span>
            </div>
            <h1 className="detail-hero-title">{sala.nombre}</h1>
            <p className="detail-hero-edificio">
              <FiMapPin aria-hidden />
              {sala.edificio}
            </p>
          </div>
        </div>
      </header>

      <div className="detail-grid">
        <div className="detail-main">
          <section className="detail-stats" aria-label="Datos del espacio">
            <article className="detail-stat">
              <FiUsers className="detail-stat-icon" aria-hidden />
              <div>
                <p className="detail-stat-label">Capacidad</p>
                <p className="detail-stat-value">{sala.capacidad}</p>
                <p className="detail-stat-hint">personas</p>
              </div>
            </article>
            <article className="detail-stat">
              <FiLayers className="detail-stat-icon" aria-hidden />
              <div>
                <p className="detail-stat-label">Tipo</p>
                <p className="detail-stat-value detail-stat-value--sm">
                  {etiquetaTipoSala(sala.tipo)}
                </p>
              </div>
            </article>
            <article className="detail-stat">
              <FiCalendar className="detail-stat-icon" aria-hidden />
              <div>
                <p className="detail-stat-label">Reservas</p>
                <p className="detail-stat-value">{reservasSala.length}</p>
                <p className="detail-stat-hint">registradas</p>
              </div>
            </article>
            <article className="detail-stat">
              <FiShield className="detail-stat-icon" aria-hidden />
              <div>
                <p className="detail-stat-label">Aprobación</p>
                <p className="detail-stat-value detail-stat-value--sm">
                  {sala.requiereAprobacion ? "Requerida" : "Automática"}
                </p>
              </div>
            </article>
          </section>

          <section className="card card--static detail-section">
            <h2 className="detail-section-title">Recursos incluidos</h2>
            {sala.recursosPermitidos.length > 0 ? (
              <ul className="detail-tags">
                {sala.recursosPermitidos.map((r) => (
                  <li key={r} className="detail-tag">
                    {r}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="detail-empty-hint">Sin recursos adicionales.</p>
            )}
          </section>

          <section className="card card--static detail-section">
            <h2 className="detail-section-title">Programas permitidos</h2>
            {sala.programasPermitidos.length > 0 ? (
              <ul className="detail-tags detail-tags--accent">
                {sala.programasPermitidos.map((p) => (
                  <li key={p} className="detail-tag detail-tag--accent">
                    {p}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="detail-empty-hint">Abierto a todos los programas.</p>
            )}
          </section>

          <section className="card card--static detail-section">
            <div className="detail-section-head">
              <h2 className="detail-section-title">Próximas reservas</h2>
              <span className="detail-section-count">
                {proximasReservas.length} en calendario
              </span>
            </div>
            {proximasReservas.length === 0 ? (
              <p className="detail-empty-hint">
                No hay reservas próximas para este espacio. ¡Sé el primero en
                reservar!
              </p>
            ) : (
              <ul className="detail-reservas-list">
                {proximasReservas.map((r) => (
                  <li key={r.id} className="detail-reserva-row">
                    <div className="detail-reserva-fecha">
                      <FiCalendar aria-hidden />
                      <span>{r.fecha}</span>
                    </div>
                    <div className="detail-reserva-slot">
                      <FiClock aria-hidden />
                      <span>{r.timeSlot}</span>
                    </div>
                    <span
                      className={`badge ${
                        r.estado === "aprobada"
                          ? "badge--success"
                          : r.estado === "pendiente"
                            ? "badge--warning"
                            : "badge--warning"
                      }`}
                    >
                      {r.estado}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="detail-aside">
          <div className="card card--static detail-booking-card">
            <h2 className="detail-booking-title">Reservar espacio</h2>
            <p className="detail-booking-desc">
              {disponible
                ? "Elige fecha y franja horaria. La reserva quedará pendiente hasta aprobación."
                : "Este espacio no acepta reservas mientras esté en mantenimiento."}
            </p>

            {disponible ? (
              <>
                <ul className="detail-booking-perks">
                  <li>
                    <FiCheckCircle aria-hidden />
                    Confirmación por correo (demo)
                  </li>
                  <li>
                    <FiCheckCircle aria-hidden />
                    {sala.requiereAprobacion
                      ? "Requiere aprobación de admin"
                      : "Confirmación inmediata"}
                  </li>
                </ul>
                <button
                  type="button"
                  className="detail-booking-btn"
                  onClick={irAReservar}
                >
                  {user ? "Reservar ahora" : "Iniciar sesión para reservar"}
                </button>
                {user ? (
                  <Link
                    to={`/reservar?salaId=${sala.id}`}
                    className="detail-booking-link"
                  >
                    Ir al formulario completo →
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    state={loginRedirectState(reservarReturnTo(sala.id))}
                    className="detail-booking-link"
                  >
                    Iniciar sesión →
                  </Link>
                )}
              </>
            ) : (
              <div className="detail-maintenance" role="status">
                <FiAlertTriangle aria-hidden />
                <p>En mantenimiento. Vuelve más tarde o elige otro espacio.</p>
                <Link to="/" className="btn-link mt-3 inline-flex">
                  Ver otros espacios
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>

      {modalOpen && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detalle-modal-titulo"
        >
          <div className="modal-content detail-modal">
            <h2 id="detalle-modal-titulo" className="detail-modal-title">
              Reservar {sala.nombre}
            </h2>
            <p className="detail-modal-sub">
              {etiquetaTipoSala(sala.tipo)} · {sala.edificio}
            </p>
            <div className="flex flex-col gap-4 mt-4">
              <div>
                <label htmlFor="det-fecha">Fecha</label>
                <input
                  id="det-fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  min={hoy}
                  required
                />
              </div>
              <div>
                <label htmlFor="det-slot">Franja horaria</label>
                <select
                  id="det-slot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
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
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="button" onClick={confirmar}>
                  Confirmar reserva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
