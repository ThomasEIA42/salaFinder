import type { TipoSala } from "../types/types";

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

export function heroTipoSala(tipo: TipoSala): string {
  switch (tipo) {
    case "LABORATORIO":
      return "detail-hero--lab";
    case "AUDITORIO":
      return "detail-hero--auditorio";
    default:
      return "detail-hero--salon";
  }
}
