export type AuthUser = {
  id: number;
  name: string;
  username: string;
  email: string;
};

type JsonPlaceholderUser = {
  id: number;
  name: string;
  username: string;
  email: string;
};

// API pública para la clase (sin backend real)
const BASE_URL = "https://jsonplaceholder.typicode.com/users";
const STORAGE_KEY = "salaFinder.auth.user";

function mapApiUserToAuthUser(user: JsonPlaceholderUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email
  };
}

export async function login(email: string, password: string): Promise<AuthUser> {
  if (!email || !password) {
    throw new Error("Email y contraseña son obligatorios");
  }

  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error("Error al intentar iniciar sesión");
  }

  const users = (await res.json()) as JsonPlaceholderUser[];
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  // JsonPlaceholder no maneja password; aceptamos si el email existe.
  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const authUser = mapApiUserToAuthUser(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
  return authUser;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}
