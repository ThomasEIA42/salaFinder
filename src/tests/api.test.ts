import { describe, expect, test, beforeEach, vi } from "vitest";
import { login, logout, getCurrentUser } from "../api/api";

describe("api auth", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test("login guarda token y usuario en localStorage", async () => {
    const payload = btoa(
      JSON.stringify({
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier":
          "user-1",
        email: "admin@test.com",
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Admin",
      })
    );
    const token = `h.${payload}.s`;

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => "application/json" },
        json: async () => ({ token }),
      })
    );

    const user = await login("admin@test.com", "Admin123!");
    expect(user.email).toBe("admin@test.com");
    expect(user.role).toBe("Admin");
    expect(getCurrentUser()?.id).toBe("user-1");

    logout();
    expect(getCurrentUser()).toBeNull();
  });
});
