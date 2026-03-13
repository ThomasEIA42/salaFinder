import { useState } from "react"
import type { Sala, Reserva } from "../types/types"

type Props = {
  onCrear: (reserva: Reserva) => void
}

function CreateReservation({ onCrear }: Props) {

  const [nombreSala, setNombreSala] = useState("")
  const [fecha, setFecha] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const sala: Sala = {
      id: Date.now(),
      nombre: nombreSala,
      tipo: "AULA",
      capacidad: 30,
      edificio: "Edificio A",
      recursosPermitidos: [],
      programasPermitidos: [],
      requiereAprobacion: false,
      estado: "DISPONIBLE"
    }

    const nuevaReserva: Reserva = {
      id: Date.now(),
      sala,
      fecha,
      estado: "pendiente"
    }

    onCrear(nuevaReserva)

    setNombreSala("")
    setFecha("")
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Crear Reserva
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <input
          type="text"
          placeholder="Nombre de la sala"
          value={nombreSala}
          onChange={(e) => setNombreSala(e.target.value)}
        />

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <button type="submit">
          Crear Reserva
        </button>

      </form>

    </div>
  )
}

export default CreateReservation