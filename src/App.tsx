import { useState } from "react"
import Navbar from "./componentes/Navbar"
import { Route, Routes } from "react-router-dom"

import HomePage from "./pages/homePage"
import DetalleSala from "./pages/DetalleSala"
import CrearReserva from "./pages/CreateReservation"
import Login from "./pages/Login"
import NotFoundPage from "./pages/NotFoundPage" 

import type { EstadoReserva, Sala } from "./types/types"

function App() {

  /* ======================= RESERVAS ======================= */

  const [reservas, setReservas] = useState<EstadoReserva[]>([])

  function crearReserva(sala: Sala) {

    const nuevaReserva: EstadoReserva = {
      id: Date.now(),
      sala,
      fecha: new Date().toLocaleDateString(),
      estado: "PENDIENTE" as const
    }

    setReservas((prev) => [...prev, nuevaReserva])
  }

  function cancelarReserva(reservaId: number) {
    setReservas((prev) =>
      prev.filter((r) => r.id !== reservaId)
    )
  }

  function limpiarReservas() {
    setReservas([])
  }

  return (
    <div className="min-h-screen bg-page">

      {/* Barra de navegación */}
      <Navbar />

      <Routes>

        <Route
          path="/"
          element={
            <HomePage
              EstadoSala={EstadoSala}
              onReservar={crearReserva}
              onCancelar={cancelarReserva}
              onLimpiar={limpiarReservas}
            />
          }
        />

        <Route
          path="/sala/:id"
          element={<DetalleSala onReservar={crearReserva} />}
        />

        <Route
          path="/reservar"
          element={<CrearReserva />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Routes>
    </div>
  )
}

export default App