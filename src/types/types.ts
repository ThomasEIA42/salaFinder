export type TipoSala = "LABORATORIO" | "AULA" | "CANCHA";
export type EstadoSala = "DISPONIBLE" | "MANTENIMIENTO";

export type EstadoReserva = "pendiente" | "aprobada" | "rechazada" | "cancelada";

export interface Sala {
  id: number;
  nombre: string;
  tipo: "LABORATORIO" | "AULA" | "CANCHA";
  capacidad: number;
  edificio: string;
  recursosPermitidos: string[];
  requiereAprobacion: boolean;
  estado: "DISPONIBLE" | "MANTENIMIENTO";
}

export interface Reserva {
  id: number;
  sala: Sala;
  fecha: string;
  estado: EstadoReserva;
}