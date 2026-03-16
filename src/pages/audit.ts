import type { AuditLog } from "../types/types";

// API pública para la clase (sin backend real)
const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

const USUARIOS = ["admin@sala.com", "coordinacion@sala.com", "docente@sala.com", "estudiante@sala.com"];
const ACCIONES = [
  "Inició sesión",
  "Cerró sesión",
  "Consultó salas",
  "Creó una reserva",
  "Canceló una reserva",
  "Actualizó una reserva",
  "Aprobó una reserva",
  "Rechazó una reserva"
];

function fakeDateFromId(id: number) {
  const day = (id % 28) + 1;
  const hour = (id % 12) + 8; // 08..19
  const minute = (id * 7) % 60;
  const mm = String(minute).padStart(2, "0");
  return `${day}/03/2026 ${hour}:${mm}`;
}

function mapPostToAuditLog(post: { id: number; title: string; body: string; userId: number }): AuditLog {
  const usuario = USUARIOS[post.id % USUARIOS.length];
  const accion = ACCIONES[post.id % ACCIONES.length];

  return {
    id: post.id,
    usuario,
    accion: `${accion}: ${post.title}`,
    fecha: fakeDateFromId(post.id)
  };
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error("Failed to fetch audit logs");
  }

  const posts = (await res.json()) as Array<{ id: number; title: string; body: string; userId: number }>;
  return posts.slice(0, 20).map(mapPostToAuditLog);
}

export async function getAuditLogById(id: number): Promise<AuditLog> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch audit log");
  }

  const post = (await res.json()) as { id: number; title: string; body: string; userId: number };
  return mapPostToAuditLog(post);
}

