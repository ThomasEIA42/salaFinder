import React from 'react';
import { FiUsers, FiMapPin, FiInfo, FiCheckCircle } from "react-icons/fi";

/**
 * @typedef {Object} SpaceProps
 * @property {Object} space
 * @property {string} space.id
 * @property {string} space.name
 * @property {string} space.type
 * @property {number} space.capacity
 * @property {string} space.building
 * @property {string[]} space.resources
 * @property {boolean} space.requiresApproval
 * @property {(id: string) => void} onSelect
 */

/**
 * @param {SpaceProps} props
 */
export default function SpaceCard({ space, onSelect }) {
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

      <div className="mb-4">
        <p className="text-xs font-semibold mb-2 uppercase text-gray-400">Recursos incluidos:</p>
        <div className="flex flex-wrap gap-1">
          {space.resources.map((res, index) => (
            <span key={index} className="text-[11px] bg-gray-100 px-2 py-1 rounded border border-gray-200">
              {res}
            </span>
          ))}
        </div>
      </div>

      <button 
        onClick={() => onSelect(space.id)}
        className="w-full bg-brand-700 text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 flex items-center justify-center gap-2 transition-all"
      >
        Reservar Espacio
      </button>
    </div>
  );
}