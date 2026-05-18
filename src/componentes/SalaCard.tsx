import { Link } from "react-router-dom";
import type { Sala } from "../types/types";
import { etiquetaTipoSala } from "../utils/tipoSala";

export default function SalaCard({ sala }: { sala: Sala }) {
  return (
    <article className="card relative">
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
      <p className="text-xs text-muted-foreground mb-3">{sala.edificio}</p>

      <div className="flex justify-between items-center mt-2">
        <Link
          to={`/sala/${sala.id}`}
          className="text-xs font-semibold text-brand-700 hover:underline"
        >
          Ver detalle
        </Link>
        {sala.estado === "DISPONIBLE" ? (
          <Link
            to={`/reservar?salaId=${sala.id}`}
            className="btn-link"
          >
            Reservar
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="opacity-50 cursor-not-allowed"
          >
            No disponible
          </button>
        )}
      </div>
    </article>
  );
}

