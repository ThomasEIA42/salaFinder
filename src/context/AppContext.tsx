import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Reserva, EstadoReserva } from "../types/types";
import type { AuthUser } from "../fakeapi/FakeApi";
import { fakeApi } from "../fakeapi/FakeApi";

const RESERVAS_KEY = "salaFinder.reservas";

function loadReservas(): Reserva[] {
  try {
    const raw = localStorage.getItem(RESERVAS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Reserva[];
  } catch {
    return [];
  }
}

type ToastState = { message: string; type: "success" | "error" } | null;

type AppContextValue = {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
  refreshUser: () => void;
  reservas: Reserva[];
  crearReserva: (sala: Reserva["sala"], fecha: string, timeSlot: string) => void;
  cancelarReserva: (id: number) => void;
  limpiarReservas: () => void;
  setEstadoReserva: (id: number, estado: EstadoReserva) => void;
  toast: ToastState;
  showToast: (message: string, type?: "success" | "error") => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [reservas, setReservas] = useState<Reserva[]>(loadReservas);
  const [user, setUserState] = useState<AuthUser | null>(() =>
    fakeApi.getCurrentUser()
  );
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    localStorage.setItem(RESERVAS_KEY, JSON.stringify(reservas));
  }, [reservas]);

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
  }, []);

  const refreshUser = useCallback(() => {
    setUserState(fakeApi.getCurrentUser());
  }, []);

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setToast({ message, type });
      window.setTimeout(() => setToast(null), 3800);
    },
    []
  );

  const crearReserva = useCallback(
    (sala: Reserva["sala"], fecha: string, timeSlot: string) => {
      const nueva: Reserva = {
        id: Date.now(),
        sala,
        fecha,
        timeSlot,
        estado: "pendiente",
      };
      setReservas((prev) => [...prev, nueva]);
      showToast("Reserva creada correctamente.", "success");
    },
    [showToast]
  );

  const cancelarReserva = useCallback((id: number) => {
    setReservas((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const limpiarReservas = useCallback(() => setReservas([]), []);

  const setEstadoReserva = useCallback((id: number, estado: EstadoReserva) => {
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado } : r))
    );
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      refreshUser,
      reservas,
      crearReserva,
      cancelarReserva,
      limpiarReservas,
      setEstadoReserva,
      toast,
      showToast,
    }),
    [
      user,
      setUser,
      refreshUser,
      reservas,
      crearReserva,
      cancelarReserva,
      limpiarReservas,
      setEstadoReserva,
      toast,
      showToast,
    ]
  );

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}
