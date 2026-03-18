import type { ReactNode } from "react";
import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import { AppProvider } from "../context/AppContext";
import { fakeApi } from "../fakeapi/FakeApi";
import type { Sala } from "../types/types";
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
   * HomePage ahora está simplificada (solo listado + filtros).
   * La acción "Reservar" envía al formulario de nueva reserva con la sala preseleccionada por query param.
   */
  test("el link Reservar lleva a /reservar?salaId=<id>", async () => {
    render(wrap(<HomePage />));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Sala A/i })).toBeInTheDocument();
    });

    const reservarLink = screen.getByRole("link", { name: /^Reservar$/i });
    expect(reservarLink).toHaveAttribute("href", "/reservar?salaId=1");
  });
});
