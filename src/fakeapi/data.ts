/**
 * Datos mock para la Fake API.
 * Todo en memoria, sin backend ni llamadas a red.
 */

export const MOCK_USERS = [
  { id: 1, name: "Admin", username: "admin", email: "admin@test.com" },
  { id: 2, name: "Usuario Demo", username: "demo", email: "demo@test.com" },
  { id: 3, name: "Thomas Gonzalez", username: "Thom", email: "thomas.gonzalez@gmail.com" },
  { id: 4, name: "Sebastian ramirez", username: "Sebas07", email: "sebastian.ramirez@gmail.com" },
  { id: 5, name: "Silvia Suarez", username: "SilviaD", email: "silvia.suarez@gmail.com" },
];

export const MOCK_POSTS = [
  { id: 1, title: "Salon A", body: "Salon", userId: 1 },
  { id: 2, title: "Salon B", body: "Salon", userId: 1 },
  { id: 3, title: "Auditorio Principal", body: "Auditorio", userId: 1 },
  { id: 4, title: "Laboratorio fisica mecanica", body: "Laboratorio", userId: 2 },
  { id: 5, title: "Salon 1.1B", body: "Salon", userId: 2 },
  { id: 6, title: "Salon 2.4A", body: "Salon", userId: 3 },
  { id: 7, title: "Laboratorio Sistemas", body: "Laboratorio", userId: 3 },
  { id: 8, title: "Auditorio pequeño", body: "Auditorio", userId: 4 },
  { id: 9, title: "Clase 1.4A", body: "Salon", userId: 4 },
  { id: 10, title: "Laboratorio fisica de ondas", body: "Laboratorio", userId: 5 },
];

export const TIPOS = ["LABORATORIO", "SALON", "AUDITORIO"] as const;
export const EDIFICIOS = [
  "Edificio Ingeniería",
  "Edificio Medicina",
  "Biblioteca",
  "Sala gamer",
  "Bloque Administrativo",
];

export const RECURSOS = [
  ["Video beam", "Tablero"],
  ["Computadores", "Video beam"],
  ["Sillas individuales"],
  ["Mesas"],
  ["Tablero"],
];

export const PROGRAMAS = [
  ["Ingeniería"],
  ["Administración"],
  ["Sala gamer"],
  ["Todos"],
  ["Ciencias"],
];

export const AUDIT_USUARIOS = [
  "admin@sala.com",
  "coordinacion@sala.com",
  "docente@sala.com",
  "estudiante@sala.com",
];

export const AUDIT_ACCIONES = [
  "Inició sesión",
  "Cerró sesión",
  "Consultó salas",
  "Creó una reserva",
  "Canceló una reserva",
  "Actualizó una reserva",
  "Aprobó una reserva",
  "Rechazó una reserva",
];

export function delay(ms = 50): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
