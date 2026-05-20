import type { Reserva } from "../types/types";

/** Fecha local YYYY-MM-DD (evita desfase UTC de toISOString). */
export function fechaHoyLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const FRANJAS_HORARIAS = [
  "07:00-09:00",
  "09:00-11:00",
  "11:00-13:00",
  "14:00-16:00",
  "16:00-18:00",
] as const;

function minutosDesdeMedianoche(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function finFranjaHoraria(timeSlot: string): string {
  return timeSlot.split("-")[1]?.trim() ?? "";
}

export type ValidacionReserva =
  | { ok: true }
  | { ok: false; message: string };

export function validarFechaHorarioReserva(
  fecha: string,
  timeSlot: string,
  ahora: Date = new Date()
): ValidacionReserva {
  const hoy = fechaHoyLocal();
  if (!fecha || !timeSlot) {
    return { ok: false, message: "Selecciona fecha y horario." };
  }
  if (fecha < hoy) {
    return { ok: false, message: "No puedes reservar en una fecha pasada." };
  }
  if (fecha > hoy) return { ok: true };

  const fin = finFranjaHoraria(timeSlot);
  if (!fin) {
    return { ok: false, message: "Franja horaria no válida." };
  }
  const ahoraMin = ahora.getHours() * 60 + ahora.getMinutes();
  if (ahoraMin >= minutosDesdeMedianoche(fin)) {
    return {
      ok: false,
      message: "Esa franja horaria ya terminó hoy. Elige otra u otro día.",
    };
  }
  return { ok: true };
}

function coincideSlot(
  r: Reserva,
  salaId: number,
  fecha: string,
  timeSlot: string
): boolean {
  return r.sala.id === salaId && r.fecha === fecha && r.timeSlot === timeSlot;
}

export function reservaOcupaEspacio(r: Reserva): boolean {
  return r.estado === "aprobada";
}

export function hasSlotConflict(
  reservas: Reserva[],
  salaId: number,
  fecha: string,
  timeSlot: string
): boolean {
  return reservas.some(
    (r) =>
      reservaOcupaEspacio(r) && coincideSlot(r, salaId, fecha, timeSlot)
  );
}

export function slotOcupado(
  reservas: Reserva[],
  solicitudes: Reserva[],
  salaId: number,
  fecha: string,
  timeSlot: string
): boolean {
  if (hasSlotConflict(reservas, salaId, fecha, timeSlot)) return true;
  return solicitudes.some(
    (s) => s.estado === "pendiente" && coincideSlot(s, salaId, fecha, timeSlot)
  );
}

export function etiquetaEstadoReserva(estado: Reserva["estado"]): string {
  switch (estado) {
    case "pendiente":
      return "En espera de aprobación";
    case "aprobada":
      return "Aprobada";
    case "rechazada":
      return "Rechazada";
    case "cancelada":
      return "Cancelada";
    default:
      return estado;
  }
}
