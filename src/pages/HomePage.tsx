import type { Sala, Reserva } from "../types/types"

type Props = {
  reservas: Reserva[]
  onReservar: (sala: Sala) => void
  onCancelar: (reservaId: number) => void
  onLimpiar: () => void
}

const salas: Sala[] = [
{
id:1,
nombre:"Sala A",
tipo:"AULA",
capacidad:30,
edificio:"Edificio A",
recursosPermitidos:["Proyector"],
programasPermitidos:[],
requiereAprobacion:false,
estado:"DISPONIBLE"
},
{
id:2,
nombre:"Sala B",
tipo:"LABORATORIO",
capacidad:20,
edificio:"Edificio B",
recursosPermitidos:["Computadoras"],
programasPermitidos:[],
requiereAprobacion:false,
estado:"DISPONIBLE"
}
]

function HomePage({ onReservar }: Props) {

return (

<div>

<h1>Salas disponibles</h1>

{salas.map((sala)=>(
<div key={sala.id}>

<h3>{sala.nombre}</h3>

<p>Capacidad: {sala.capacidad}</p>

<button onClick={()=>onReservar(sala)}>
Reservar
</button>

</div>
))}

</div>

)
}

export default HomePage