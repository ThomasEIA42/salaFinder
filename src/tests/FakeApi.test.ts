import { describe, expect, test, beforeEach } from "vitest";
import { fakeApi } from "../fakeapi/FakeApi";

describe("FakeApi", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("login guarda el usuario admin en localStorage", async () => {
    const user = await fakeApi.login("admin@test.com", "Hola1234#");
    expect(user.email).toBe("admin@test.com");
    expect(user.role).toBe("admin");

    const stored = localStorage.getItem("salaFinder.auth.user");
    expect(stored).toBeTruthy();
  });

  test("login falla si el correo no está registrado", async () => {
    await expect(
      fakeApi.login("noexiste@eia.edu.co", "1234")
    ).rejects.toThrow("Credenciales inválidas");
  });

  test("login con correo registrado @eia.edu.co", async () => {
    await fakeApi.register("alumno@eia.edu.co", "mi-clave");
    fakeApi.logout();

    const user = await fakeApi.login("alumno@eia.edu.co", "mi-clave");
    expect(user.email).toBe("alumno@eia.edu.co");
    expect(user.role).toBe("estudiante");
  });

  test("login admin falla con contraseña incorrecta", async () => {
    await expect(fakeApi.login("admin@test.com", "mala")).rejects.toThrow(
      "Credenciales inválidas"
    );
  });

  test("login profesor con credenciales fijas", async () => {
    const user = await fakeApi.login("profesor@eia.edu.co", "Profesor1234#");
    expect(user.role).toBe("profesor");
  });

  test("logout elimina la sesión", async () => {
    await fakeApi.login("admin@test.com", "Hola1234#");
    fakeApi.logout();
    expect(fakeApi.getCurrentUser()).toBeNull();
  });

  test("obtenerSalas devuelve espacios", async () => {
    const salas = await fakeApi.obtenerSalas();
    expect(salas.length).toBeGreaterThan(0);
    expect(salas[0]).toHaveProperty("nombre");
  });

  test("obtenerSalaPorId devuelve una sala", async () => {
    const sala = await fakeApi.obtenerSalaPorId(1);
    expect(sala.id).toBe(1);
    expect(sala.nombre).toBe("Salon A");
  });

  test("obtenerSalaPorId falla si no existe", async () => {
    await expect(fakeApi.obtenerSalaPorId(999)).rejects.toThrow(
      "Sala no encontrada"
    );
  });

  test("getAuditLogs devuelve listado vacío", async () => {
    const logs = await fakeApi.getAuditLogs();
    expect(logs).toEqual([]);
  });
});
