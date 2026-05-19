import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
