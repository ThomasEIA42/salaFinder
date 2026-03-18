import Navbar from "./componentes/Navbar";
import Toast from "./componentes/Toast";
import { Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

import HomePage from "./pages/HomePage";
import DetalleSala from "./pages/DetalleSala";
import CrearReserva from "./pages/CreateReservation";
import MyReservations from "./pages/MyReservations";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFoundPage from "./pages/NotFoundPage";
import AuditPage from "./pages/AuditPage";

function AppRoutes() {
  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <Toast />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reservations" element={<MyReservations />} />
        <Route path="/sala/:id" element={<DetalleSala />} />
        <Route path="/reservar" element={<CrearReserva />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
