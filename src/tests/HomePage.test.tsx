import type { ReactNode } from "react";
import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import { AppProvider } from "../context/AppContext";
import * as api from "../api/api";
import type { Space } from "../api/api";
import "@testing-library/jest-dom";

function mkSpace(id: string, name: string): Space {
  return {
    id_space: id,
    name,
    type: "SALON",
    capacity: 30,
    building: "Edificio A",
    resources: "Tablero",
    allowedPrograms: "Todos",
    requiresApproval: false,
    isActive: true,
  };
}

function wrap(ui: ReactNode) {
  return (
    <MemoryRouter>
      <AppProvider>{ui}</AppProvider>
    </MemoryRouter>
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      "salaFinder.auth.user",
      JSON.stringify({ id: "user-1", email: "test@eia.edu.co", role: "Student" })
    );
    vi.spyOn(api, "getSpaces").mockResolvedValue([
      mkSpace("11111111-1111-1111-1111-111111111111", "Sala A"),
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('muestra "Ver detalle" y enlace Reservar', async () => {
    render(wrap(<HomePage />));

    await waitFor(() => {
      expect(screen.getByText("Sala A")).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: /Ver detalle/i })).toHaveAttribute(
      "href",
      "/sala/11111111-1111-1111-1111-111111111111"
    );
    expect(screen.getByRole("link", { name: /^Reservar$/i })).toHaveAttribute(
      "href",
      "/reservar?spaceId=11111111-1111-1111-1111-111111111111"
    );
  });
});
