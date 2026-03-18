import type { Reserva, Sala } from "../types/types";

type Props = {
  salas: Sala[]
  reservas: Reserva[]
}

function Dashboard({ salas, reservas }: Props) {

  const pendientes = reservas.filter(r => r.estado === "pendiente").length
  const aprobadas = reservas.filter(r => r.estado === "aprobada").length

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard SalaFinder
      </h1>

      {/* tarjetas */}
      <div className="grid grid-cols-4 gap-4 mb-8">

        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-lg font-semibold">Salas</h2>
          <p className="text-2xl">{salas.length}</p>
        </div>

        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-lg font-semibold">Reservas</h2>
          <p className="text-2xl">{reservas.length}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded">
          <h2 className="text-lg font-semibold">Pendientes</h2>
          <p className="text-2xl">{pendientes}</p>
        </div>

        <div className="bg-purple-100 p-4 rounded">
          <h2 className="text-lg font-semibold">Aprobadas</h2>
          <p className="text-2xl">{aprobadas}</p>
        </div>

      </div>

      {/* tabla de reservas */}
      <h2 className="text-xl font-bold mb-4">
        Reservas recientes
      </h2>

      <table className="w-full border">

        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Sala</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Estado</th>
          </tr>
        </thead>

        <tbody>

          {reservas.slice(0,5).map((r) => (
            <tr key={r.id}>

              <td className="p-2 border">
                {r.sala.nombre}
              </td>

              <td className="p-2 border">
                {r.fecha}
              </td>

              <td className="p-2 border">
                {r.estado}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  )
}

export default Dashboard