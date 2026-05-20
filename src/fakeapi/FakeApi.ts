import type { AuditLog, Sala, TipoSala } from "../types/types";
import { EIA_EMAIL_ERROR, isEmailEia } from "../utils/emailEia";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const AUTH_KEY = "salaFinder.auth.user";
const REGISTRY_KEY = "salaFinder.registered.accounts";

const ADMIN_EMAIL = "admin@test.com";
const ADMIN_PASSWORD = "Hola1234#";

const PROFESOR_EMAIL = "profesor@eia.edu.co";
const PROFESOR_PASSWORD = "Profesor1234#";

const ADMIN_USER = {
  id: 1,
  name: "Admin",
  username: "admin",
  email: ADMIN_EMAIL,
} as const;

const PROFESOR_USER = {
  id: 2,
  name: "Profesor Demo",
  username: "profesor",
  email: PROFESOR_EMAIL,
} as const;

type StoredAccount = {
  id: number;
  email: string;
  password: string;
  name: string;
  username: string;
  role: "estudiante" | "profesor";
};

export type UserRole = "admin" | "profesor" | "estudiante";
export type AuthUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
};

function isAdminEmail(email: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}

function isProfesorEmail(email: string): boolean {
  return email.trim().toLowerCase() === PROFESOR_EMAIL;
}

function loadRegistry(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredAccount[];
  } catch {
    return [];
  }
}

function saveRegistry(accounts: StoredAccount[]) {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(accounts));
}

const RAW = [
  { id: 1, t: "Salon A", k: "salon" },
  { id: 2, t: "Salon B", k: "salon" },
  { id: 3, t: "Auditorio Principal", k: "auditorio" },
  { id: 4, t: "Laboratorio fisica mecanica", k: "laboratorio" },
  { id: 5, t: "Salon 1.1B", k: "salon" },
  { id: 6, t: "Salon 2.4A", k: "salon" },
  { id: 7, t: "Laboratorio Sistemas", k: "laboratorio" },
  { id: 8, t: "Auditorio pequeño", k: "auditorio" },
  { id: 9, t: "Clase 1.4A", k: "salon" },
  { id: 10, t: "Laboratorio fisica de ondas", k: "laboratorio" },
] as const;

const E = [
  "Edificio Ingeniería",
  "Edificio Medicina",
  "Biblioteca",
  "Sala gamer",
  "Bloque Administrativo",
];
const R = [
  ["Video beam", "Tablero"],
  ["Computadores", "Video beam"],
  ["Sillas individuales"],
  ["Mesas"],
  ["Tablero"],
];
const P = [
  ["Ingeniería"],
  ["Administración"],
  ["Sala gamer"],
  ["Todos"],
  ["Ciencias"],
];

function tipoSala(k: string): TipoSala {
  if (k === "laboratorio") return "LABORATORIO";
  if (k === "auditorio") return "AUDITORIO";
  return "SALON";
}

function buildSala(p: (typeof RAW)[number]): Sala {
  const n = p.id;
  return {
    id: n,
    nombre: p.t,
    tipo: tipoSala(p.k),
    capacidad: 10 + (n % 10) * 5,
    edificio: E[n % E.length],
    recursosPermitidos: [...R[n % R.length]],
    programasPermitidos: [...P[n % P.length]],
    requiereAprobacion: n % 2 === 0,
    estado: n % 6 === 0 ? "MANTENIMIENTO" : "DISPONIBLE",
  };
}

export class FakeApi {
  async login(email: string, password: string): Promise<AuthUser> {
    await delay(400);
    const normalized = email?.trim().toLowerCase();
    const pwd = password?.trim() ?? "";
    if (!normalized || !pwd) {
      throw new Error("Email y contraseña son obligatorios");
    }

    if (isAdminEmail(normalized)) {
      if (pwd !== ADMIN_PASSWORD) {
        throw new Error("Credenciales inválidas");
      }
      const auth: AuthUser = { ...ADMIN_USER, role: "admin" };
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
      return auth;
    }

    if (isProfesorEmail(normalized)) {
      if (pwd !== PROFESOR_PASSWORD) {
        throw new Error("Credenciales inválidas");
      }
      const auth: AuthUser = { ...PROFESOR_USER, role: "profesor" };
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
      return auth;
    }

    const account = loadRegistry().find((a) => a.email === normalized);
    if (!account || account.password !== pwd) {
      throw new Error("Credenciales inválidas");
    }

    const auth: AuthUser = {
      id: account.id,
      name: account.name,
      username: account.username,
      email: account.email,
      role: account.role === "profesor" ? "profesor" : "estudiante",
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    return auth;
  }

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  }

  async register(email: string, password: string): Promise<AuthUser> {
    await delay(400);
    const normalized = email?.trim().toLowerCase();
    if (!normalized) throw new Error("Email obligatorio");
    const pwd = password?.trim() ?? "";
    if (!pwd) throw new Error("Contraseña obligatoria");
    if (!isEmailEia(normalized)) throw new Error(EIA_EMAIL_ERROR);

    const accounts = loadRegistry();
    if (accounts.some((a) => a.email === normalized)) {
      throw new Error("Ya existe una cuenta con ese correo.");
    }

    const account: StoredAccount = {
      id: Date.now(),
      email: normalized,
      password: pwd,
      name: normalized.split("@")[0] || "Usuario",
      username: normalized.split("@")[0] || "user",
      role: "estudiante",
    };
    saveRegistry([...accounts, account]);

    const auth: AuthUser = {
      id: account.id,
      name: account.name,
      username: account.username,
      email: account.email,
      role: "estudiante",
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    return auth;
  }

  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
      const u = JSON.parse(raw) as AuthUser & { role?: UserRole };
      if (!u.role) {
        if (isAdminEmail(u.email ?? "")) u.role = "admin";
        else if (isProfesorEmail(u.email ?? "")) u.role = "profesor";
        else u.role = "estudiante";
      }
      if ((u.role as string) === "user") u.role = "estudiante";
      return u as AuthUser;
    } catch {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
  }

  async obtenerSalas(): Promise<Sala[]> {
    await delay(450);
    return RAW.map(buildSala);
  }

  async obtenerSalaPorId(id: number): Promise<Sala> {
    await delay(250);
    const p = RAW.find((x) => x.id === id);
    if (!p) throw new Error("Sala no encontrada");
    return buildSala(p);
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    await delay(350);
    return [];
  }

  async getAuditLogById(_id: number): Promise<AuditLog> {
    await delay(250);
    throw new Error("Audit log no encontrado");
  }
}

export const fakeApi = new FakeApi();
