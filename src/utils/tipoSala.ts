export function etiquetaTipoSala(tipo: string): string {
  switch (tipo.toUpperCase()) {
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

export function heroTipoSala(tipo: string): string {
  switch (tipo.toUpperCase()) {
    case "LABORATORIO":
      return "detail-hero--lab";
    case "AUDITORIO":
      return "detail-hero--auditorio";
    default:
      return "detail-hero--salon";
  }
}
