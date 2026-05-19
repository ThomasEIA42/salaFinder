import type { Space } from "../api/api";

export type SpaceListItem = {
  id: string;
  nombre: string;
  tipo: string;
  capacidad: number;
  edificio: string;
  estado: "DISPONIBLE" | "MANTENIMIENTO";
  recursosPermitidos: string[];
  programasPermitidos: string[];
  requiereAprobacion: boolean;
};

export function mapSpaceToListItem(space: Space): SpaceListItem {
  return {
    id: space.id_space,
    nombre: space.name,
    tipo: space.type,
    capacidad: space.capacity,
    edificio: space.building,
    estado: space.isActive ? "DISPONIBLE" : "MANTENIMIENTO",
    recursosPermitidos: space.resources
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean),
    programasPermitidos: space.allowedPrograms
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean),
    requiereAprobacion: space.requiresApproval,
  };
}
