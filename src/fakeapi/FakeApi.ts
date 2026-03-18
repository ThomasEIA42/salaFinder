import type { AuditLog, EstadoSala, Sala, TipoSala } from "../types/types";
import {
  AUDIT_ACCIONES,
  AUDIT_USUARIOS,
  delay,
  EDIFICIOS,
  MOCK_POSTS,
  MOCK_USERS,
  PROGRAMAS,
  RECURSOS,
} from "./data";

export type UserRole = "admin" | "user";

export type AuthUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
};
//simula un error sirve para probar el UI ante las fallas 
export const SIMULATE_SALAS_ERROR_KEY = "salaFinder_simulate_salas_error";

const STORAGE_KEY = "salaFinder.auth.user";

function fakeDateFromId(id: number): string {
  const day = (id % 28) + 1;
  const hour = (id % 12) + 8;
  const minute = (id * 7) % 60;
  const mm = String(minute).padStart(2, "0");
  return `${day}/03/2026 ${hour}:${mm}`;
}

function tipoDesdeCuerpo(body: string): TipoSala {
  const b = body.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  if (b.includes("laboratorio")) return "LABORATORIO";
  if (b.includes("auditorio")) return "AUDITORIO";
  return "SALON";
}

function mapPostASala(post: (typeof MOCK_POSTS)[0]): Sala {
  const tipo = tipoDesdeCuerpo(post.body);
  const edificio = EDIFICIOS[post.id % EDIFICIOS.length];
  const recursos = RECURSOS[post.id % RECURSOS.length];
  const programasPermitidos = PROGRAMAS[post.id % PROGRAMAS.length];
  const capacidad = 10 + (post.id % 10) * 5;
  const estado: EstadoSala =
    post.id % 6 === 0 ? "MANTENIMIENTO" : "DISPONIBLE";

  return {
    id: post.id,
    nombre: post.title,
    tipo,
    capacidad,
    edificio,
    recursosPermitidos: recursos,
    programasPermitidos,
    requiereAprobacion: post.id % 2 === 0,
    estado,
  };
}

function mapPostToAuditLog(post: (typeof MOCK_POSTS)[0]): AuditLog {
  const usuario = AUDIT_USUARIOS[post.id % AUDIT_USUARIOS.length];
  const accion = AUDIT_ACCIONES[post.id % AUDIT_ACCIONES.length];

  return {
    id: post.id,
    usuario,
    accion: `${accion}: ${post.title}`,
    fecha: fakeDateFromId(post.id),
  };
}

/**
 * Fake API centralizada en **una sola clase**.
 * Todo se resuelve en memoria (sin backend ni llamadas a red).
 */
export class FakeApi {
  // Login “fake”: valida por email contra usuarios mock y guarda sesión en localStorage.
  async login(email: string, _password: string): Promise<AuthUser> {
    await delay(400);

    if (!email?.trim()) {
      throw new Error("Email y contraseña son obligatorios");
    }

    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const role: UserRole =
      user.email.toLowerCase().includes("admin") || user.id === 1
        ? "admin"
        : "user";
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    return authUser;
  }

  // Cierra sesión borrando el usuario guardado.
  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /** Registro fake: crea sesión local sin validar duplicados */
  async register(email: string, _password: string): Promise<AuthUser> {
    await delay(400);
    if (!email?.trim()) throw new Error("Email obligatorio");
    const authUser: AuthUser = {
      id: Date.now(),
      name: email.split("@")[0] || "Usuario",
      username: email.split("@")[0] || "user",
      email: email.trim(),
      role: "user",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    return authUser;
  }

  // Devuelve el usuario actual si existe sesión (localStorage), si no retorna null.
  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      const u = JSON.parse(raw) as AuthUser & { role?: UserRole };
      if (!u.role) {
        u.role =
          u.email?.toLowerCase().includes("admin") || u.id === 1
            ? "admin"
            : "user";
      }
      return u as AuthUser;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  // Lista de salas mock si un backend real
  async obtenerSalas(): Promise<Sala[]> {
    await delay(450);
    if (
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(SIMULATE_SALAS_ERROR_KEY) === "1"
    ) {
      sessionStorage.removeItem(SIMULATE_SALAS_ERROR_KEY);
      throw new Error(
        "No se pudieron cargar los espacios."
      );
    }
    return MOCK_POSTS.slice(0, 20).map(mapPostASala);
  }

  // Obtiene una sala por id, simulando el comportamiento
  async obtenerSalaPorId(id: number): Promise<Sala> {
    await delay(250);

    const post = MOCK_POSTS.find((p) => p.id === id);
    if (!post) throw new Error("Sala no encontrada");
    return mapPostASala(post);
  }

  // Devuelve el historial audit log del sistema.
  async getAuditLogs(): Promise<AuditLog[]> {
    await delay(350);
    return MOCK_POSTS.slice(0, 20).map(mapPostToAuditLog);
  }

  // Devuelve un registro de audit log por id.
  async getAuditLogById(id: number): Promise<AuditLog> {
    await delay(250);

    const post = MOCK_POSTS.find((p) => p.id === id);
    if (!post) throw new Error("Audit log no encontrado");
    return mapPostToAuditLog(post);
  }
}

export const fakeApi = new FakeApi();

