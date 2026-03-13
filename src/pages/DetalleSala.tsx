import { useParams } from "react-router-dom"
import type { Sala } from "../types/types"

type Props = {
  onReservar: (sala: Sala) => void
}

function DetalleSala({ onReservar }: Props) {

  const { id } = useParams()

  const salaDemo: Sala = {
    id: Number(id),
    nombre: "Sala Demo",
    tipo: "AULA",
    capacidad: 30,
    edificio: "Edificio A",
    recursosPermitidos: [],
    programasPermitidos: [],
    requiereAprobacion: false,
    estado: "DISPONIBLE"
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Detalle de la Sala
      </h1>

      <p>ID de la sala: {id}</p>
      <p>Nombre: {salaDemo.nombre}</p>
      <p>Tipo: {salaDemo.tipo}</p>
      <p>Capacidad: {salaDemo.capacidad}</p>
      <p>Edificio: {salaDemo.edificio}</p>

      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => onReservar(salaDemo)}
      >
        Reservar sala
      </button>

    </div>
  )
}

export default DetalleSala