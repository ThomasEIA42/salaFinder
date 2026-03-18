import { describe, expect, it, beforeEach } from "vitest";
import { fakeApi } from "../fakeapi/FakeApi";

describe("FakeApi", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("login guarda el usuario en localStorage y lo retorna", async () => {
    const user = await fakeApi.login("admin@test.com", "1234");
    expect(user.email).toBe("admin@test.com");
    expect(user.role).toBe("admin");

    const stored = localStorage.getItem("salaFinder.auth.user");
    expect(stored).toBeTruthy();
  });

  it("login falla si el email no existe", async () => {
    await expect(fakeApi.login("noexiste@test.com", "1234")).rejects.toThrow(
      "Credenciales inválidas"
    );
  });

  it("logout elimina la sesión", async () => {
    await fakeApi.login("admin@test.com", "1234");
    fakeApi.logout();
    expect(fakeApi.getCurrentUser()).toBeNull();
  });

  it("obtenerSalas devuelve un listado", async () => {
    const salas = await fakeApi.obtenerSalas();
    expect(Array.isArray(salas)).toBe(true);
    expect(salas.length).toBeGreaterThan(0);
    expect(salas[0]).toHaveProperty("id");
    expect(salas[0]).toHaveProperty("nombre");
  });

  it("obtenerSalaPorId devuelve una sala específica", async () => {
    const sala = await fakeApi.obtenerSalaPorId(1);
    expect(sala.id).toBe(1);
  });

  it("getAuditLogs devuelve logs", async () => {
    const logs = await fakeApi.getAuditLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0]).toHaveProperty("usuario");
    expect(logs[0]).toHaveProperty("accion");
  });
});

