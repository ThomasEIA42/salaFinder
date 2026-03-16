import { useState } from "react";
import type { Sala, Reserva } from "../types/types";

type Props = {
  reservas: Reserva[];
  onReservar: (sala: Sala, fecha: string) => void;
  onCancelar: (reservaId: number) => void;
  onLimpiar: () => void;
};

const salas: Sala[] = [
  {
    id: 1,
    nombre: "Sala A",
    tipo: "AULA",
    capacidad: 30,
    edificio: "Edificio A",
    recursosPermitidos: ["Proyector"],
    programasPermitidos: [],
    requiereAprobacion: false,
    estado: "DISPONIBLE",
  },
  {
    id: 2,
    nombre: "Sala B",
    tipo: "LABORATORIO",
    capacidad: 20,
    edificio: "Edificio B",
    recursosPermitidos: ["Computadoras"],
    programasPermitidos: [],
    requiereAprobacion: false,
    estado: "DISPONIBLE",
  },
  {
    id: 3,
    nombre: "Auditorio Principal",
    tipo: "AUDITORIO",
    capacidad: 80,
    edificio: "Centro de Eventos",
    recursosPermitidos: ["Sonido profesional", "Proyector 4K"],
    programasPermitidos: [],
    requiereAprobacion: false,
    estado: "DISPONIBLE",
  },
];

function HomePage({ reservas, onReservar, onCancelar, onLimpiar }: Props) {
  const [salaSeleccionada, setSalaSeleccionada] = useState<Sala | null>(null);
  const [fechaReserva, setFechaReserva] = useState("");
  const [franjaHoraria, setFranjaHoraria] = useState("");
  const [proposito, setProposito] = useState("");
  const [asistentes, setAsistentes] = useState(1);

  function abrirModal(sala: Sala) {
    setSalaSeleccionada(sala);
    setFechaReserva("");
    setFranjaHoraria("");
    setProposito("");
    setAsistentes(1);
  }

  function cerrarModal() {
    setSalaSeleccionada(null);
    setFechaReserva("");
    setFranjaHoraria("");
    setProposito("");
    setAsistentes(1);
  }

  function confirmarReserva() {
    if (!salaSeleccionada || !fechaReserva) return;
    // De momento solo guardamos la fecha; el resto de campos se pueden
    // usar después si amplías el tipo Reserva.
    onReservar(salaSeleccionada, fechaReserva);
    cerrarModal();
  }

  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-bold">Espacios Disponibles</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Busca tu reserva, aparta el salon que necesites.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {salas.map((sala) => (
          <div key={sala.id} className="card">
            <h3 className="text-lg font-semibold">{sala.nombre}</h3>
            <p className="text-xs text-muted-foreground mb-1">{sala.tipo}</p>
            <p className="text-sm text-muted-foreground mb-1">
              Capacidad: {sala.capacidad} personas
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Edificio: {sala.edificio}
            </p>

            <div className="flex justify-between items-center mt-2">
              <button
                type="button"
                className="text-xs font-semibold text-muted-foreground underline-offset-2 hover:underline bg-transparent px-0 py-0"
              >
                mirar detalles
              </button>

              <button type="button" onClick={() => abrirModal(sala)}>
                Reservar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* La lista de reservas ahora vive en la página MyReservations */}

      {/* Modal de reserva */}
      {salaSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="mb-1 text-xl font-bold">Crear Reservation</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              <span className="font-semibold">
                {salaSeleccionada.nombre}
              </span>{" "}
              ({salaSeleccionada.tipo}) — Capacidad: {salaSeleccionada.capacidad}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                confirmarReserva();
              }}
              className="flex flex-col gap-3"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Día</label>
                <input
                  type="date"
                  value={fechaReserva}
                  onChange={(e) => setFechaReserva(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  tiempo de uso
                </label>
                <select
                  value={franjaHoraria}
                  onChange={(e) => setFranjaHoraria(e.target.value)}
                  required
                >
                  <option value="">Selecciona una hora.</option>
                  <option value="07:00-09:00">07:00–09:00</option>
                  <option value="09:00-11:00">09:00–11:00</option>
                  <option value="11:00-13:00">11:00–13:00</option>
                  <option value="14:00-16:00">14:00–16:00</option>
                  <option value="16:00-18:00">16:00–18:00</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Lista de Asistentes (1–20)
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={asistentes}
                  onChange={(e) => setAsistentes(Number(e.target.value) || 1)}
                  required
                />
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="border border-border bg-transparent text-sm px-4 py-2"
                >
                  Cancelar
                </button>
                <button type="submit" className="text-sm px-4 py-2">
                  Crear reservacion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;