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
import {
  hasSlotConflict,
  slotOcupado,
  validarFechaHorarioReserva,
} from "../utils/reservas";

const SOLICITUDES_KEY = "salaFinder.solicitudes";
const RESERVAS_KEY = "salaFinder.reservas";

function normalizeReserva(r: Reserva): Reserva {
  const estado =
    r.estado === "aprobada" ||
    r.estado === "pendiente" ||
    r.estado === "rechazada" ||
    r.estado === "cancelada"
      ? r.estado
      : "pendiente";
  return {
    ...r,
    estado,
    solicitanteEmail: r.solicitanteEmail ?? "desconocido@eia.edu.co",
    solicitanteNombre: r.solicitanteNombre ?? "Usuario",
  };
}

function loadList(key: string): Reserva[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return (JSON.parse(raw) as Reserva[]).map(normalizeReserva);
  } catch {
    return [];
  }
}

function loadInitialState(): { solicitudes: Reserva[]; reservas: Reserva[] } {
  const sol = loadList(SOLICITUDES_KEY);
  const rawRes = loadList(RESERVAS_KEY);

  const reservas = rawRes.filter((r) => r.estado === "aprobada");
  const malUbicadas = rawRes.filter(
    (r) => r.estado === "pendiente" || r.estado === "rechazada"
  );

  return {
    solicitudes: [...sol, ...malUbicadas],
    reservas,
  };
}

type ToastState = { message: string; type: "success" | "error" } | null;

type AppContextValue = {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
  refreshUser: () => void;
  reservas: Reserva[];
  solicitudes: Reserva[];
  crearReserva: (sala: Reserva["sala"], fecha: string, timeSlot: string) => void;
  aprobarSolicitud: (id: number) => void;
  rechazarSolicitud: (id: number) => void;
  cancelarReserva: (id: number) => void;
  cancelarSolicitud: (id: number) => void;
  limpiarReservas: () => void;
  toast: ToastState;
  showToast: (message: string, type?: "success" | "error") => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [solicitudes, setSolicitudes] = useState<Reserva[]>(
    () => loadInitialState().solicitudes
  );
  const [reservas, setReservas] = useState<Reserva[]>(
    () => loadInitialState().reservas
  );
  const [user, setUserState] = useState<AuthUser | null>(() =>
    fakeApi.getCurrentUser()
  );
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    localStorage.setItem(SOLICITUDES_KEY, JSON.stringify(solicitudes));
  }, [solicitudes]);

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
      if (!user) {
        showToast("Inicia sesión para solicitar una reserva.", "error");
        return;
      }
      if (user.role === "admin") {
        showToast("El administrador no crea reservas desde aquí.", "error");
        return;
      }

      const validacion = validarFechaHorarioReserva(fecha, timeSlot);
      if (!validacion.ok) {
        showToast(validacion.message, "error");
        return;
      }

      if (slotOcupado(reservas, solicitudes, sala.id, fecha, timeSlot)) {
        showToast(
          "Ese horario ya está ocupado o en espera de aprobación. Elige otra franja.",
          "error"
        );
        return;
      }

      const nueva: Reserva = {
        id: Date.now(),
        sala,
        fecha,
        timeSlot,
        estado: "pendiente",
        solicitanteEmail: user.email,
        solicitanteNombre: user.name,
      };
      setSolicitudes((prev) => [...prev, nueva]);
      showToast(
        "Solicitud enviada. En espera de aprobación del administrador.",
        "success"
      );
    },
    [user, reservas, solicitudes, showToast]
  );

  const aprobarSolicitud = useCallback(
    (id: number) => {
      const sol = solicitudes.find((s) => s.id === id && s.estado === "pendiente");
      if (!sol) return;

      if (hasSlotConflict(reservas, sol.sala.id, sol.fecha, sol.timeSlot)) {
        showToast(
          "No se puede aprobar: ya hay otra reserva confirmada en ese horario.",
          "error"
        );
        return;
      }

      const confirmada: Reserva = { ...sol, estado: "aprobada" };
      setReservas((prev) => [...prev, confirmada]);
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      showToast("Reserva aprobada y confirmada.", "success");
    },
    [solicitudes, reservas, showToast]
  );

  const rechazarSolicitud = useCallback(
    (id: number) => {
      setSolicitudes((prev) =>
        prev.map((s) =>
          s.id === id && s.estado === "pendiente"
            ? { ...s, estado: "rechazada" as EstadoReserva }
            : s
        )
      );
      showToast("Solicitud rechazada.", "success");
    },
    [showToast]
  );

  const cancelarReserva = useCallback((id: number) => {
    setReservas((prev) => prev.filter((r) => r.id !== id));
    showToast("Reserva confirmada cancelada.", "success");
  }, [showToast]);

  const cancelarSolicitud = useCallback((id: number) => {
    setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    showToast("Solicitud eliminada.", "success");
  }, [showToast]);

  const limpiarReservas = useCallback(() => {
    setReservas([]);
    setSolicitudes([]);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      refreshUser,
      reservas,
      solicitudes,
      crearReserva,
      aprobarSolicitud,
      rechazarSolicitud,
      cancelarReserva,
      cancelarSolicitud,
      limpiarReservas,
      toast,
      showToast,
    }),
    [
      user,
      setUser,
      refreshUser,
      reservas,
      solicitudes,
      crearReserva,
      aprobarSolicitud,
      rechazarSolicitud,
      cancelarReserva,
      cancelarSolicitud,
      limpiarReservas,
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
