import { describe, expect, test } from "vitest";
import type { Reserva, Sala } from "../types/types";

/** Misma lógica que en la app: hay conflicto si ya existe reserva con misma sala, fecha y franja horaria. */
function hasConflict(
  reservas: Reserva[],
  salaId: number,
  fecha: string,
  timeSlot: string
) {
  return reservas.some(
    (r) => r.sala.id === salaId && r.fecha === fecha && r.timeSlot === timeSlot
  );
}

/**
 * Tests unitarios puros (sin React): validan cuándo dos reservas “chocan” en tiempo.
 * Sirven para explicar la regla de negocio “no dos reservas en la misma sala a la misma hora y día”.
 */
describe("Reservas - conflicto por sala/fecha/hora", () => {
  const salaA: Sala = {
    id: 1,
    nombre: "Sala A",
    tipo: "SALON",
    capacidad: 30,
    edificio: "Edificio A",
    recursosPermitidos: [],
    programasPermitidos: [],
    requiereAprobacion: false,
    estado: "DISPONIBLE",
  };

  const reservas: Reserva[] = [
    {
      id: 1,
      sala: salaA,
      fecha: "2026-03-16",
      timeSlot: "09:00-11:00",
      estado: "pendiente",
    },
  ];

  // Caso feliz del conflicto: misma sala, misma fecha, misma franja → debe marcar conflicto (true).
  test("detecta conflicto cuando coincide sala + fecha + timeSlot", () => {
    expect(hasConflict(reservas, 1, "2026-03-16", "09:00-11:00")).toBe(true);
  });

  // Mismo día y sala pero otra franja horaria → no hay choque (false).
  test("no es conflicto si cambia el timeSlot", () => {
    expect(hasConflict(reservas, 1, "2026-03-16", "07:00-09:00")).toBe(false);
  });

  // Misma sala y misma hora pero otro día → no hay conflicto (false).
  test("no es conflicto si cambia la fecha", () => {
    expect(hasConflict(reservas, 1, "2026-03-17", "09:00-11:00")).toBe(false);
  });

  // Misma fecha y franja pero otra sala (id distinto) → no hay conflicto (false).
  test("no es conflicto si cambia la sala", () => {
    expect(hasConflict(reservas, 2, "2026-03-16", "09:00-11:00")).toBe(false);
  });
});

