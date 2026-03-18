import { describe, expect, test, beforeEach } from "vitest";
import { fakeApi } from "../fakeapi/FakeApi";

/**
 * Pruebas de la fakeapi: login, sesión, listado de salas y auditoría.
 * Cada test comprueba un comportamiento concreto sin backend real.
 */
describe("FakeApi", () => {
  // Antes de cada prueba: localStorage limpio para no mezclar sesiones entre tests.
  beforeEach(() => {
    localStorage.clear();
  });

  // Verifica que el login con un email válido devuelve el usuario correcto (rol admin si aplica)
  // y que la sesión queda guardada en localStorage para persistir la sesión.
  test("login guarda el usuario en localStorage y lo retorna", async () => {
    const user = await fakeApi.login("admin@test.com", "1234");
    expect(user.email).toBe("admin@test.com");
    expect(user.role).toBe("admin");

    const stored = localStorage.getItem("salaFinder.auth.user");
    expect(stored).toBeTruthy();
  });

  // Comprueba que si el email no está en la lista de usuarios mock, la promesa falla con el mensaje esperado.
  test("login falla si el email no existe", async () => {
    await expect(fakeApi.login("noexiste@test.com", "1234")).rejects.toThrow(
      "Credenciales inválidas"
    );
  });

  // Tras hacer login y luego logout, no debe quedar usuario en sesión (getCurrentUser = null).
  test("logout elimina la sesión", async () => {
    await fakeApi.login("admin@test.com", "1234");
    fakeApi.logout();
    expect(fakeApi.getCurrentUser()).toBeNull();
  });

  // Asegura que obtenerSalas() devuelve un array no vacío de objetos tipo sala (con id y nombre mínimo).
  test("obtenerSalas devuelve un listado", async () => {
    const salas = await fakeApi.obtenerSalas();
    expect(Array.isArray(salas)).toBe(true);
    expect(salas.length).toBeGreaterThan(0);
    expect(salas[0]).toHaveProperty("id");
    expect(salas[0]).toHaveProperty("nombre");
  });

  // Pide una sala por id conocido (1) y verifica que el id del objeto coincide.
  test("obtenerSalaPorId devuelve una sala específica", async () => {
    const sala = await fakeApi.obtenerSalaPorId(1);
    expect(sala.id).toBe(1);
  });

  // La pantalla de auditoría usa estos datos: debe haber al menos un log con campos usuario y acción.
  test("getAuditLogs devuelve logs", async () => {
    const logs = await fakeApi.getAuditLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0]).toHaveProperty("usuario");
    expect(logs[0]).toHaveProperty("accion");
  });
});

