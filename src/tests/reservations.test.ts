import { describe, expect, test } from "vitest";
import type { Reserva, Sala } from "../types/types";
import {
  fechaHoyLocal,
  hasSlotConflict,
  slotOcupado,
  validarFechaHorarioReserva,
} from "../utils/reservas";

const salaA: Sala = {
  id: 1,
  nombre: "Sala A",
  tipo: "SALON",
  capacidad: 20,
  edificio: "A",
  recursosPermitidos: [],
  programasPermitidos: [],
  requiereAprobacion: false,
  estado: "DISPONIBLE",
};

describe("reservas utils", () => {
  const base = {
    id: 1,
    sala: salaA,
    fecha: "2026-03-16",
    timeSlot: "09:00-11:00",
    solicitanteEmail: "a@eia.edu.co",
    solicitanteNombre: "A",
  };

  test("pendiente no bloquea el horario", () => {
    const reservas: Reserva[] = [{ ...base, estado: "pendiente" }];
    expect(hasSlotConflict(reservas, 1, "2026-03-16", "09:00-11:00")).toBe(
      false
    );
  });

  test("aprobada sí bloquea el horario", () => {
    const reservas: Reserva[] = [{ ...base, estado: "aprobada" }];
    expect(hasSlotConflict(reservas, 1, "2026-03-16", "09:00-11:00")).toBe(true);
  });

  test("no es conflicto si cambia el timeSlot", () => {
    const reservas: Reserva[] = [{ ...base, estado: "aprobada" }];
    expect(hasSlotConflict(reservas, 1, "2026-03-16", "07:00-09:00")).toBe(false);
  });

  test("solicitud pendiente bloquea el mismo horario", () => {
    const reservas: Reserva[] = [];
    const solicitudes: Reserva[] = [{ ...base, estado: "pendiente" }];
    expect(slotOcupado(reservas, solicitudes, 1, "2026-03-16", "09:00-11:00")).toBe(
      true
    );
  });

  test("rechaza fecha pasada", () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const pasada = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    expect(validarFechaHorarioReserva(pasada, "09:00-11:00").ok).toBe(false);
    expect(fechaHoyLocal()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
