import type { Reserva } from "../types/types";

type Props = {
  reservas: Reserva[];
  onCancelar: (reservaId: number) => void;
  onLimpiar: () => void;
};

function MyReservations({ reservas, onCancelar, onLimpiar }: Props) {
  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-bold">Mis Reservacaciones</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Ahora con esta web podras reservas tus salas mas comodamente.
      </p>

      {reservas.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tienes ninguna reserva aún.
        </p>
      ) : (
        <>
          <ul className="space-y-2">
            {reservas.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded border border-border bg-surface p-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {r.sala.nombre} — {r.fecha}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Status: {r.estado}
                  </p>
                </div>
                <button
                  onClick={() => onCancelar(r.id)}
                  className="text-xs font-semibold text-red-500 hover:underline bg-transparent px-0 py-0"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={onLimpiar}
            className="mt-3 text-xs font-semibold text-brand-700 hover:underline bg-transparent px-0 py-0"
          >
            Limpiar todo
          </button>
        </>
      )}
    </div>
  );
}

export default MyReservations;

