import type { ReactNode } from "react";
import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import { AppProvider } from "../context/AppContext";
import { fakeApi } from "../fakeapi/FakeApi";
import type { Reserva, Sala } from "../types/types";
import "@testing-library/jest-dom";

const RESERVAS_KEY = "salaFinder.reservas";

function mkSala(id: number, nombre: string, tipo: Sala["tipo"]): Sala {
  return {
    id,
    nombre,
    tipo,
    capacidad: 30,
    edificio: "Edificio A",
    recursosPermitidos: [],
    programasPermitidos: [],
    requiereAprobacion: false,
    estado: "DISPONIBLE",
  };
}

function wrap(ui: ReactNode) {
  return (
    <MemoryRouter>
      <AppProvider>{ui}</AppProvider>
    </MemoryRouter>
  );
}

/**
 * Test de integración de UI: monta HomePage con router y contexto real.
 * Simula la API de salas con un mock para tener datos predecibles (una sola sala “Sala A”).
 */
describe("HomePage", () => {
  beforeEach(() => {
    localStorage.removeItem(RESERVAS_KEY);
    localStorage.removeItem("salaFinder.auth.user");
    sessionStorage.removeItem("salaFinder_simulate_salas_error");
    vi.spyOn(fakeApi, "obtenerSalas").mockResolvedValue([mkSala(1, "Sala A", "SALON")]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Flujo completo en pantalla:
   * 1) Ya existe en localStorage una reserva para Sala A el 16/03 en 09:00–11:00.
   * 2) El usuario abre “Reservar” otra vez con la misma fecha y franja.
   * 3) La app debe mostrar el mensaje de error (alert) de reserva duplicada, sin crear otra reserva.
   */
  test("abre el modal y bloquea reserva duplicada (misma sala/fecha/hora)", async () => {
    const user = userEvent.setup();
    const salaA = mkSala(1, "Sala A", "SALON");
    const reservas: Reserva[] = [
      {
        id: 123,
        sala: salaA,
        fecha: "2026-03-16",
        timeSlot: "09:00-11:00",
        estado: "pendiente",
      },
    ];
    localStorage.setItem(RESERVAS_KEY, JSON.stringify(reservas));

    render(wrap(<HomePage />));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Sala A/i })).toBeInTheDocument();
    });

    const reservarBtns = screen.getAllByRole("button", { name: /^Reservar$/i });
    await user.click(reservarBtns[0]);

    expect(
      screen.getByRole("heading", { name: /crear reserva/i })
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^Día$/i), "2026-03-16");
    await user.selectOptions(
      screen.getByLabelText(/franja horaria|tiempo entre horarios/i),
      "09:00-11:00"
    );

    await user.click(screen.getByRole("button", { name: /crear reserva/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      /ya existe una reserva/i
    );
  });
});
