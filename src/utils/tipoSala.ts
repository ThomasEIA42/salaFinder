import type { TipoSala } from "../types/types";

//da una etiqueta mas formal para cada tipo de sala
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
