import { useState } from "react"
import type { Reserva } from "../types/types"

type Props = {
  reservas: Reserva[]
}

function Calendar({ reservas }: Props) {

  const [fechaSeleccionada, setFechaSeleccionada] = useState("")

  const reservasDelDia = reservas.filter(
    (r) => r.fecha === fechaSeleccionada
  )

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Calendario de Reservas
      </h1>

      <input
        type="date"
        value={fechaSeleccionada}
        onChange={(e) => setFechaSeleccionada(e.target.value)}
        className="border p-2 mb-4"
      />

      <h2 className="text-lg font-semibold mb-2">
        Reservas del día
      </h2>

      {reservasDelDia.length === 0 ? (
        <p>No hay reservas para esta fecha</p>
      ) : (
        <ul>

          {reservasDelDia.map((r) => (
            <li key={r.id} className="border p-2 mb-2">

              <p>
                <strong>Sala:</strong> {r.sala.nombre}
              </p>

              <p>
                <strong>Estado:</strong> {r.estado}
              </p>

            </li>
          ))}

        </ul>
      )}

    </div>
  )
}

export default Calendar