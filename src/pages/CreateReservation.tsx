import { useState } from "react"
import type { Reserva, Sala } from "../types/types"

type Props = {
  onCrear: (reserva: Reserva) => void
}

function CreateReservation({ onCrear }: Props) {

  const [nombreSala, setNombreSala] = useState("")
  const [fecha, setFecha] = useState("")

  function crear() {

    const sala: Sala = {
      id:1,
      nombre:"Sala A",
      tipo:"AULA",
      capacidad:30,
      edificio:"Edificio A",
      recursosPermitidos:[],
      programasPermitidos:[],
      requiereAprobacion:false,
      estado:"DISPONIBLE"
    }

    const nuevaReserva: Reserva = {
      id: Date.now(),
      sala,
      fecha,
      estado:"pendiente"
    }

    onCrear(nuevaReserva)
  }

  return (

    <div>

      <h2>Crear Reserva</h2>

      <input
        type="date"
        value={fecha}
        onChange={(e)=>setFecha(e.target.value)}
      />

      <button onClick={crear}>
        Reservar
      </button>

    </div>

  )
}

export default CreateReservation