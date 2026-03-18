import type { AuditLog, Sala, TipoSala } from "../types/types";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const AUTH_KEY = "salaFinder.auth.user";

const USERS = [
  { id: 1, name: "Admin", username: "admin", email: "admin@test.com" },
  { id: 2, name: "Usuario Demo", username: "demo", email: "demo@test.com" },
  { id: 3, name: "Thomas Gonzalez", username: "Thom", email: "thomas.gonzalez@gmail.com" },
  { id: 4, name: "Sebastian ramirez", username: "Sebas07", email: "sebastian.ramirez@gmail.com" },
  { id: 5, name: "Silvia Suarez", username: "SilviaD", email: "silvia.suarez@gmail.com" },
];

/** id + título + palabra clave para tipo de sala */
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

const E = ["Edificio Ingeniería", "Edificio Medicina", "Biblioteca", "Sala gamer", "Bloque Administrativo"];
const R = [["Video beam", "Tablero"], ["Computadores", "Video beam"], ["Sillas individuales"], ["Mesas"], ["Tablero"]];
const P = [["Ingeniería"], ["Administración"], ["Sala gamer"], ["Todos"], ["Ciencias"]];
const AU = ["admin@sala.com", "coordinacion@sala.com", "docente@sala.com", "estudiante@sala.com"];
const AA = ["Inició sesión", "Consultó salas", "Creó reserva", "Canceló reserva", "Aprobó reserva"];

function tipo(k: string): TipoSala {
  if (k === "laboratorio") return "LABORATORIO";
  if (k === "auditorio") return "AUDITORIO";
  return "SALON";
}

function sala(p: (typeof RAW)[number]): Sala {
  const n = p.id;
  return {
    id: n,
    nombre: p.t,
    tipo: tipo(p.k),
    capacidad: 10 + (n % 10) * 5,
    edificio: E[n % E.length],
    recursosPermitidos: [...R[n % R.length]],
    programasPermitidos: [...P[n % P.length]],
    requiereAprobacion: n % 2 === 0,
    estado: n % 6 === 0 ? "MANTENIMIENTO" : "DISPONIBLE",
  };
}

function log(p: (typeof RAW)[number]): AuditLog {
  const n = p.id;
  const mm = String((n * 7) % 60).padStart(2, "0");
  return {
    id: n,
    usuario: AU[n % AU.length],
    accion: `${AA[n % AA.length]}: ${p.t}`,
    fecha: `${(n % 28) + 1}/03/2026 ${(n % 12) + 8}:${mm}`,
  };
}

export type UserRole = "admin" | "user";
export type AuthUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
};

function roleFor(email: string, id: number): UserRole {
  return email.toLowerCase().includes("admin") || id === 1 ? "admin" : "user";
}

export class FakeApi {
  async login(email: string, _password: string): Promise<AuthUser> {
    await delay(400);
    if (!email?.trim()) throw new Error("Email y contraseña son obligatorios");
    const u = USERS.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u) throw new Error("Credenciales inválidas");
    const auth: AuthUser = { ...u, role: roleFor(u.email, u.id) };
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    return auth;
  }

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  }

  async register(email: string, _password: string): Promise<AuthUser> {
    await delay(400);
    if (!email?.trim()) throw new Error("Email obligatorio");
    const auth: AuthUser = {
      id: Date.now(),
      name: email.split("@")[0] || "Usuario",
      username: email.split("@")[0] || "user",
      email: email.trim(),
      role: "user",
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    return auth;
  }

  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
      const u = JSON.parse(raw) as AuthUser & { role?: UserRole };
      if (!u.role) u.role = roleFor(u.email ?? "", u.id);
      return u as AuthUser;
    } catch {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
  }

  async obtenerSalas(): Promise<Sala[]> {
    await delay(450);
    return RAW.map(sala);
  }

  async obtenerSalaPorId(id: number): Promise<Sala> {
    await delay(250);
    const p = RAW.find((x) => x.id === id);
    if (!p) throw new Error("Sala no encontrada");
    return sala(p);
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    await delay(350);
    return RAW.map(log);
  }

  async getAuditLogById(id: number): Promise<AuditLog> {
    await delay(250);
    const p = RAW.find((x) => x.id === id);
    if (!p) throw new Error("Audit log no encontrado");
    return log(p);
  }
}

export const fakeApi = new FakeApi();
