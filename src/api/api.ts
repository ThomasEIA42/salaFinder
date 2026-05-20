export const BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://localhost:7060/api";

const TOKEN_KEY = "salaFinder.auth.token";
const USER_KEY  = "salaFinder.auth.user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("salaFinder:session-expired"));
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json", ...extra };
  const token = getToken();
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

function friendlyStatusMessage(status: number, text: string): string | null {
  const proxyFailure =
    /proxy|ECONNREFUSED|ECONNRESET|socket hang up/i.test(text);

  if (status === 500 && (proxyFailure || !text.trim())) {
    return "No se pudo conectar con el backend. Inicia la API en BackendSalaFinder (dotnet run --launch-profile https) y recarga esta página.";
  }
  if (status === 502 || status === 503 || status === 504) {
    return "El servidor no está disponible. Comprueba que el backend esté en ejecución.";
  }
  if (status === 401) {
    return "No se pudo autenticar la petición. Cierra sesión, vuelve a entrar y reinicia npm run dev si acabas de cambiar el proxy.";
  }
  if (status === 403) {
    return "No tienes permiso para esta acción.";
  }
  return null;
}

async function parseErrorMessage(res: Response): Promise<string> {
  const text = await res.text().catch(() => "");
  const friendly = friendlyStatusMessage(res.status, text);
  if (friendly) return friendly;
  if (!text) return `Error ${res.status}`;

  try {
    const body = JSON.parse(text) as Record<string, unknown>;
    if (typeof body.message === "string") return body.message;
    if (typeof body.title === "string") return body.title;
    if (Array.isArray(body.errors)) {
      return body.errors.map(String).join(", ");
    }
    if (body.errors && typeof body.errors === "object") {
      return Object.values(body.errors as Record<string, string[]>)
        .flat()
        .join(", ");
    }
  } catch {
    /* respuesta no JSON */
  }

  return text;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: headers(init?.headers as Record<string, string> ?? {}),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return undefined as T;

  return res.json() as Promise<T>;
}
//tipos
export type UserRole = "Admin" | "Staff" | "Student";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type Space = {
  id_space: string;
  name: string;
  type: string;
  capacity: number;
  building: string;
  resources: string;
  allowedPrograms: string;
  requiresApproval: boolean;
  isActive: boolean;
};

export type Reservation = {
  id_reservation: string;
  spaceId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendeeCount: number;
  status: string;
  space?: Space;
};

export type AuditLog = {
  id_log: string;
  userId: string;
  action: string;
  entity: string;
  timestamp: string;
};

export type NoShow = {
  id: string;
  userId: string;
  count: number;
  blockedUntil: string;
};

//auth
export async function login(email: string, password: string): Promise<AuthUser> {
  const data = await apiFetch<{ token?: string; Token?: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const token = data.token ?? data.Token;
  if (!token) throw new Error("El servidor no devolvió un token de sesión.");

  saveToken(token);

  // JWT para obtener el usuario
  const payload = parseJwt(token);
  const roleClaim =
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
    payload.role;
  const user: AuthUser = {
    id: String(
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ??
        payload.sub ??
        ""
    ),
    email: String(payload["email"] ?? email),
    role: String(roleClaim ?? "Student") as UserRole,
  };

  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function register(email: string, password: string, role: UserRole = "Student"): Promise<void> {
  await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, role: role }),
  });
}

export function logout(): void {
  clearSession();
}

export function getCurrentUser(): AuthUser | null {
  const token = getToken();
  if (!token || !isTokenValid(token)) {
    clearSession();
    return null;
  }
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    clearSession();
    return null;
  }
}

// espacios
export async function getSpaces(): Promise<Space[]> {
  return apiFetch<Space[]>("/space");
}

export async function getSpaceById(id: string): Promise<Space> {
  return apiFetch<Space>(`/space/${id}`);
}

export async function filterSpaces(
  type: string,
  capacity: number,
  building: string,
  resource: string
): Promise<Space[]> {
  const params = new URLSearchParams({ type, capacity: String(capacity), building, resource });
  return apiFetch<Space[]>(`/space/filter?${params}`);
}

export async function createSpace(space: Omit<Space, "id_space">): Promise<Space> {
  return apiFetch<Space>("/space", { method: "POST", body: JSON.stringify(space) });
}

export async function updateSpace(id: string, space: Partial<Space>): Promise<Space> {
  return apiFetch<Space>(`/space/${id}`, { method: "PUT", body: JSON.stringify(space) });
}

export async function changeSpaceStatus(id: string, isActive: boolean): Promise<void> {
  return apiFetch(`/space/status/${id}?isActive=${isActive}`, { method: "PATCH" });
}

// reseervaciones
export async function getAllReservations(): Promise<Reservation[]> {
  return apiFetch<Reservation[]>("/reservation");
}

export async function getReservationsByUser(userId: string): Promise<Reservation[]> {
  return apiFetch<Reservation[]>(`/reservation/user/${userId}`);
}

export async function getReservationById(id: string): Promise<Reservation> {
  return apiFetch<Reservation>(`/reservation/${id}`);
}

export async function createReservation(dto: {
  spaceId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendeeCount: number;
  userProgram: string;
}): Promise<Reservation> {
  return apiFetch<Reservation>("/reservation", { method: "POST", body: JSON.stringify(dto) });
}

export async function approveReservation(id: string): Promise<void> {
  return apiFetch(`/reservation/approve/${id}`, { method: "PUT" });
}

export async function rejectReservation(id: string): Promise<void> {
  return apiFetch(`/reservation/reject/${id}`, { method: "PUT" });
}

export async function cancelReservation(id: string): Promise<void> {
  return apiFetch(`/reservation/cancel/${id}`, { method: "PUT" });
}

// no show
export async function isUserBlocked(userId: string): Promise<{ userId: string; blocked: boolean }> {
  return apiFetch(`/noshow/blocked/${userId}`);
}

export async function registerNoShow(userId: string): Promise<NoShow> {
  return apiFetch<NoShow>(`/noshow/${userId}`, { method: "POST" });
}

export async function resetNoShows(userId: string): Promise<void> {
  return apiFetch(`/noshow/reset/${userId}`, { method: "POST" });
}

// audit log
export async function getAuditLogs(): Promise<AuditLog[]> {
  return apiFetch<AuditLog[]>("/auditlog");
}

/** Formatea hora ISO/TimeSpan del API para mostrar en UI. */
export function formatApiTime(value: string): string {
  const part = value.includes("T") ? value.split("T")[1] : value;
  return part.slice(0, 5);
}

/** Fecha YYYY-MM-DD desde el campo date del API. */
export function formatApiDate(value: string): string {
  return value.slice(0, 10);
}

function parseJwt(token: string): Record<string, string | number> {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)) as Record<string, string | number>;
  } catch {
    return {};
  }
}

function isTokenValid(token: string): boolean {
  const payload = parseJwt(token);
  const exp = payload.exp;
  if (typeof exp !== "number") return true;
  return Date.now() < exp * 1000;
}
