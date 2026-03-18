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
  // Identificador local de la reserva .
  id: number;
  // Sala reservada (
  sala: Sala;
  // Fecha en formato string,
  fecha: string;
  // tiempo enre horarios
  // Sirve para bloquear reservas repetidas de la misma sala a la misma hora.
  timeSlot: string;
  // Estado de la reserva.
  estado: EstadoReserva;
}
export interface AuditLog {
  id: number
  usuario: string
  accion: string
  fecha: string
}