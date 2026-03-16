import type { Sala, EstadoReserva, TipoSala, EstadoSala } from "../types/types";

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

// catálogos falsos
const TIPOS: TipoSala[] = ["LABORATORIO", "AULA", "AUDITORIO"];

const EDIFICIOS = [
  "Edificio Ingeniería",
  "Edificio Ciencias",
  "Biblioteca Central",
  "Centro Deportivo",
  "Bloque Administrativo"
];

const RECURSOS = [
  ["Video beam", "Tablero"],
  ["Computadores", "Video beam"],
  ["Sistema de sonido"],
  ["Aire acondicionado"],
  ["Tablero"]
];

const PROGRAMAS = [
  ["Ingeniería"],
  ["Administración"],
  ["Artes"],
  ["Todos"],
  ["Ciencias"]
];

function mapPostASala(post: {
  id: number;
  title: string;
  body: string;
  userId: number;
}): Sala {
  const tipo = TIPOS[post.id % TIPOS.length];
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
    programasPermitidos: programasPermitidos,
    requiereAprobacion: post.id % 2 === 0,
    estado
  };
}

export async function obtenerSalas(): Promise<Sala[]> {
  const res = await fetch(BASE_URL);

  if (!res.ok) {
    throw new Error("Error al obtener las salas");
  }

  const posts = await res.json() as Array<{
    id: number;
    title: string;
    body: string;
    userId: number;
  }>;

  return posts.slice(0, 20).map(mapPostASala);
}

export async function obtenerSalaPorId(id: number): Promise<Sala> {
  const res = await fetch(`${BASE_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Error al obtener la sala");
  }

  const post = await res.json() as {
    id: number;
    title: string;
    body: string;
    userId: number;
  };

  return mapPostASala(post);
}