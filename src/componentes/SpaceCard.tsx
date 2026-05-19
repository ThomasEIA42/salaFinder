import { FiUsers, FiMapPin, FiInfo } from "react-icons/fi";
import { Link } from "react-router-dom";
import type { Space } from "../api/api";

interface ISpaceCard {
  space: Space;
}

export default function SpaceCard({ space }: ISpaceCard) {
  const resources = space.resources.split(",").map((r) => r.trim()).filter(Boolean);

  return (
    <div className="border border-border bg-surface rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-700/10 px-2 py-1 rounded">
            {space.type}
          </span>
          <h3 className="text-lg font-bold mt-1">{space.name}</h3>
        </div>
        {space.requiresApproval && (
          <span className="flex items-center gap-1 text-[10px] text-amber-600 font-medium border border-amber-200 bg-amber-50 px-2 py-0.5 rounded-full">
            <FiInfo size={12} /> Requiere Aprobación
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm text-muted mb-4">
        <div className="flex items-center gap-2">
          <FiUsers className="text-brand-700" />
          <span>Capacidad: <strong>{space.capacity} personas</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <FiMapPin className="text-brand-700" />
          <span>Edificio: {space.building}</span>
        </div>
      </div>

      {resources.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-2 uppercase text-gray-400">Recursos:</p>
          <div className="flex flex-wrap gap-1">
            {resources.map((res) => (
              <span key={res} className="text-[11px] bg-gray-100 px-2 py-1 rounded border border-gray-200">
                {res}
              </span>
            ))}
          </div>
        </div>
      )}

      <Link
        to={`/reservar?spaceId=${space.id_space}`}
        className="block w-full bg-brand-700 text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all text-center"
      >
        Reservar Espacio
      </Link>
    </div>
  );
}
