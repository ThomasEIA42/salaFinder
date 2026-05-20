export type TipoSala = "LABORATORIO" | "SALON" | "AUDITORIO";
export type EstadoSala = "DISPONIBLE" | "MANTENIMIENTO";

export type EstadoReserva = "pendiente" | "aprobada" | "rechazada" | "cancelada";

export interface Sala {
  id: number
  nombre: string
  tipo: TipoSala
  capacidad: number
  edificio: string
  recursosPermitidos: string[]
  programasPermitidos: string[]
  requiereAprobacion: boolean
  estado: EstadoSala
}

export interface Reserva {
  id: number;
  sala: Sala;
  fecha: string;
  timeSlot: string;
  estado: EstadoReserva;
  solicitanteEmail: string;
  solicitanteNombre: string;
}
export interface AuditLog {
  id: number
  usuario: string
  accion: string
  fecha: string
}