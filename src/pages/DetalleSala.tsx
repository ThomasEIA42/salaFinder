import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiBookOpen,
  FiCheckCircle,
  FiCpu,
  FiLayers,
  FiMapPin,
  FiMic,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import { getSpaceById } from "../api/api";
import { useApp } from "../context/AppContext";
import { loginRedirectState, reservarReturnTo } from "../utils/authRedirect";
import { mapSpaceToListItem, type SpaceListItem } from "../utils/spaceMapper";
import { etiquetaTipoSala, heroTipoSala } from "../utils/tipoSala";

function IconoTipo({ tipo }: { tipo: string }) {
  const className = "detail-hero-icon";
  switch (tipo.toUpperCase()) {
    case "LABORATORIO":
      return <FiCpu className={className} aria-hidden />;
    case "AUDITORIO":
      return <FiMic className={className} aria-hidden />;
    default:
      return <FiBookOpen className={className} aria-hidden />;
  }
}

const GUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function DetalleSala() {
  const { id } = useParams();
  const { user, showToast } = useApp();
  const navigate = useNavigate();
  const [sala, setSala] = useState<SpaceListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !GUID_RE.test(id)) {
      setError("ID de espacio no válido.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const space = await getSpaceById(id);
        if (!cancelled) setSala(mapSpaceToListItem(space));
      } catch (e) {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : "No se pudo cargar el espacio."
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

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
      showToast("No se puede reservar: espacio en mantenimiento.", "error");
      return;
    }
    navigate(`/reservar?spaceId=${sala.id}`);
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
          <p>{error || "Espacio no encontrado."}</p>
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
        </div>

        <aside className="detail-aside">
          <div className="card card--static detail-booking-card">
            <h2 className="detail-booking-title">Reservar espacio</h2>
            <p className="detail-booking-desc">
              {disponible
                ? "Completa el formulario de reserva con fecha y horario."
                : "Este espacio no acepta reservas mientras esté en mantenimiento."}
            </p>

            {disponible ? (
              <>
                <ul className="detail-booking-perks">
                  <li>
                    <FiCheckCircle aria-hidden />
                    Reserva vinculada a tu cuenta
                  </li>
                  <li>
                    <FiCheckCircle aria-hidden />
                    {sala.requiereAprobacion
                      ? "Requiere aprobación de admin"
                      : "Confirmación según política del espacio"}
                  </li>
                </ul>
                <button
                  type="button"
                  className="detail-booking-btn"
                  onClick={irAReservar}
                >
                  {user ? "Reservar ahora" : "Iniciar sesión para reservar"}
                </button>
                {user && (
                  <Link
                    to={`/reservar?spaceId=${sala.id}`}
                    className="detail-booking-link"
                  >
                    Ir al formulario completo →
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
    </div>
  );
}
