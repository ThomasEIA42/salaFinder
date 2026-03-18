import { describe, expect, it } from "vitest";
import type { Reserva, Sala } from "../types/types";

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

  it("detecta conflicto cuando coincide sala + fecha + timeSlot", () => {
    expect(hasConflict(reservas, 1, "2026-03-16", "09:00-11:00")).toBe(true);
  });

  it("no es conflicto si cambia el timeSlot", () => {
    expect(hasConflict(reservas, 1, "2026-03-16", "07:00-09:00")).toBe(false);
  });

  it("no es conflicto si cambia la fecha", () => {
    expect(hasConflict(reservas, 1, "2026-03-17", "09:00-11:00")).toBe(false);
  });

  it("no es conflicto si cambia la sala", () => {
    expect(hasConflict(reservas, 2, "2026-03-16", "09:00-11:00")).toBe(false);
  });
});

