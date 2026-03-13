import { useState } from "react"
import Navbar from "./componentes/Navbar"
import { Route, Routes } from "react-router-dom"

import HomePage from "./pages/HomePage"
import DetalleSala from "./pages/DetalleSala"
import Login from "./pages/Login"
import NotFoundPage from "./pages/NotFoundPage" 
import type { EstadoReserva, Reserva, Sala } from "./types/types"
import CreateReservation from "./pages/CreateReservation"
import type { AuditLog } from "./types/types"
import AuditLogPage from "./pages/AuditLog"

function App() {

  const [reservas, setReservas] = useState<Reserva[]>([])
  const [logs, setLogs] = useState<AuditLog[]>([])

  function crearReserva(sala: Sala) {

    const nuevaReserva: Reserva = {
      id: Date.now(),
      sala,
      fecha: new Date().toLocaleDateString(),
      estado: "pendiente" as const
    }

    setReservas((prev) => [...prev, nuevaReserva])

    
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        usuario: "usuario",
        accion: "Creó una reserva",
        fecha: new Date().toLocaleString()
      }
    ])
  }

  function cancelarReserva(reservaId: number) {

    setReservas((prev) =>
      prev.filter((r) => r.id !== reservaId)
    )

    
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        usuario: "usuario",
        accion: "Canceló una reserva",
        fecha: new Date().toLocaleString()
      }
    ])
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
              reservas={reservas}
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
          element={<CreateReservation onCrear={(reserva) => setReservas((prev) => [...prev, reserva])} />}
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