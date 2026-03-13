
import type { Reserva, Sala } from "../types/types"

type Props = {
  reservas: Reserva[]
  onReservar: (sala: Sala) => void
  onCancelar: (id: number) => void
  onLimpiar: () => void
}

function HomePage({ reservas, onReservar, onCancelar, onLimpiar }: Props) {

  return (
    <div>

      <h1>Salas disponibles</h1>

      <button onClick={onLimpiar}>
        Limpiar reservas
      </button>

      {reservas.map((r) => (
        <div key={r.id}>
          <p>{r.sala.nombre}</p>

          <button onClick={() => onCancelar(r.id)}>
            Cancelar
          </button>
        </div>
      ))}

    </div>
  )
}

export default HomePage