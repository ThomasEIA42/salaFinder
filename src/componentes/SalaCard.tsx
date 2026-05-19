import { Link } from "react-router-dom";
import type { SpaceListItem } from "../utils/spaceMapper";
import { useApp } from "../context/AppContext";
import { loginRedirectState, reservarReturnTo } from "../utils/authRedirect";
import { etiquetaTipoSala } from "../utils/tipoSala";

export default function SalaCard({ sala }: { sala: SpaceListItem }) {
  const { user } = useApp();
  const disponible = sala.estado === "DISPONIBLE";

  return (
    <article className="card">
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="min-w-0 flex-1 pr-2">
          <h3 className="text-lg font-semibold leading-tight">{sala.nombre}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {etiquetaTipoSala(sala.tipo)}
          </p>
        </div>
        <span
          className={`badge shrink-0 ${
            disponible ? "badge--success" : "badge--warning"
          }`}
        >
          {disponible ? "Disponible" : "Mantenimiento"}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-1">
        Capacidad:{" "}
        <strong className="font-medium" style={{ color: "var(--text-main)" }}>
          {sala.capacidad}
        </strong>{" "}
        personas
      </p>
      <p className="text-xs text-muted-foreground mb-4">{sala.edificio}</p>

      <div className="flex justify-between items-center gap-2 pt-3 border-t border-border">
        <Link
          to={`/sala/${sala.id}`}
          className="text-xs font-semibold text-brand-700 hover:underline"
        >
          Ver detalle →
        </Link>
        {disponible ? (
          user ? (
            <Link to={`/reservar?spaceId=${sala.id}`} className="btn-link">
              Reservar
            </Link>
          ) : (
            <Link
              to="/login"
              state={loginRedirectState(reservarReturnTo(sala.id))}
              className="btn-link"
            >
              Reservar
            </Link>
          )
        ) : (
          <button type="button" disabled className="btn-ghost text-xs">
            No disponible
          </button>
        )}
      </div>
    </article>
  );
}
