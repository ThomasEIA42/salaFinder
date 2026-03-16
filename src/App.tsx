import { useState } from "react";
import Navbar from "./componentes/Navbar";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import DetalleSala from "./pages/DetalleSala";
import CrearReserva from "./pages/CreateReservation";
import MyReservations from "./pages/MyReservations";
import Login from "./pages/Login";
import NotFoundPage from "./pages/NotFoundPage";

import type { Sala, Reserva } from "./types/types";

function App() {
  /* ======================= RESERVAS ======================= */

  const [reservas, setReservas] = useState<Reserva[]>([]);

  function crearReserva(sala: Sala, fecha: string) {
    const nuevaReserva: Reserva = {
      id: Date.now(),
      sala,
      fecha, // viene del calendario / formulario
      estado: "pendiente",
    };

    setReservas((prev) => [...prev, nuevaReserva]);
  }

  function cancelarReserva(reservaId: number) {
    setReservas((prev) => prev.filter((r) => r.id !== reservaId));
  }

  function limpiarReservas() {
    setReservas([]);
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              reservas={reservas}
              onReservar={crearReserva}
              onCancelar={cancelarReserva}
              onLimpiar={limpiarReservas}
            />
          }
        />

        <Route
          path="/reservations"
          element={
            <MyReservations
              reservas={reservas}
              onCancelar={cancelarReserva}
              onLimpiar={limpiarReservas}
            />
          }
        />

        <Route
          path="/sala/:id"
          element={
            <DetalleSala
              onReservar={(sala) =>
                crearReserva(
                  sala,
                  new Date().toISOString().slice(0, 10) // hoy por defecto
                )
              }
            />
          }
        />

        <Route
          path="/reservar"
          element={
            <CrearReserva
              onCrear={(reserva) => setReservas((prev) => [...prev, reserva])}
            />
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;