import type { TipoSala } from "../types/types";

/** Etiqueta en español para mostrar en UI (coherente con el nombre del espacio). */
export function etiquetaTipoSala(tipo: TipoSala): string {
  switch (tipo) {
    case "SALON":
      return "Salón";
    case "LABORATORIO":
      return "Laboratorio";
    case "AUDITORIO":
      return "Auditorio";
    default:
      return tipo;
  }
}
