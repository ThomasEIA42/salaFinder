import {
  createContext, useCallback, useContext, useEffect,
  useMemo, useState, type ReactNode,
} from "react";
import {
  login as apiLogin, register as apiRegister,
  logout as apiLogout, getCurrentUser,
  cancelReservation as apiCancel,
  approveReservation as apiApprove,
  rejectReservation as apiReject,
  type AuthUser, type UserRole,
} from "../api/api";

type ToastState = { message: string; type: "success" | "error" } | null;

type AppContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  cancelReservation: (id: string) => Promise<void>;
  approveReservation: (id: string) => Promise<void>;
  rejectReservation: (id: string) => Promise<void>;
  toast: ToastState;
  showToast: (message: string, type?: "success" | "error") => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener("salaFinder:session-expired", onExpired);
    return () => window.removeEventListener("salaFinder:session-expired", onExpired);
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3800);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await apiLogin(email, password);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (email: string, password: string, role: UserRole = "Student") => {
    await apiRegister(email, password, role);
  }, []);

  const logout = useCallback(() => { apiLogout(); setUser(null); }, []);

  const cancelReservation = useCallback(async (id: string) => {
    await apiCancel(id); showToast("Reserva cancelada.", "success");
  }, [showToast]);

  const approveReservation = useCallback(async (id: string) => {
    await apiApprove(id); showToast("Reserva aprobada.", "success");
  }, [showToast]);

  const rejectReservation = useCallback(async (id: string) => {
    await apiReject(id); showToast("Reserva rechazada.", "success");
  }, [showToast]);

  const value = useMemo(() => ({
    user, login, register, logout,
    cancelReservation, approveReservation, rejectReservation,
    toast, showToast,
  }), [user, login, register, logout, cancelReservation, approveReservation, rejectReservation, toast, showToast]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}