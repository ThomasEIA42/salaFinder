import type { Dispatch, SetStateAction } from "react";

type Props = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  tipoFiltro: string;
  setTipoFiltro: Dispatch<SetStateAction<string>>;
  soloDisponibles: boolean;
  setSoloDisponibles: Dispatch<SetStateAction<boolean>>;
  resultados: number;
  onReset: () => void;
};

export default function SpacesFilters({
  search,
  setSearch,
  tipoFiltro,
  setTipoFiltro,
  soloDisponibles,
  setSoloDisponibles,
  resultados,
  onReset,
}: Props) {
  return (
    <div
      className="mb-6 flex flex-col gap-4 rounded-lg border border-border bg-surface/50 p-4 md:flex-row md:flex-wrap md:items-end"
      role="search"
      aria-label="Filtros de espacios"
    >
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="filtro-busqueda" className="mb-1 block text-sm font-medium">
          Buscar
        </label>
        <input
          id="filtro-busqueda"
          type="search"
          placeholder="Nombre del espacio…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
          autoComplete="off"
        />
      </div>

      <div className="w-full min-w-[140px] md:w-44">
        <label htmlFor="filtro-tipo" className="mb-1 block text-sm font-medium">
          Tipo
        </label>
        <select
          id="filtro-tipo"
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          className="w-full"
        >
          <option value="">Todos</option>
          <option value="SALON">Salón</option>
          <option value="LABORATORIO">Laboratorio</option>
          <option value="AUDITORIO">Auditorio</option>
        </select>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={soloDisponibles}
          onChange={(e) => setSoloDisponibles(e.target.checked)}
        />
        Solo disponibles
      </label>

      <button
        type="button"
        onClick={onReset}
        className="border border-border bg-transparent px-3 py-2 text-sm"
      >
        Reset
      </button>

      <p className="text-sm text-muted-foreground md:ml-auto">
        Resultados: {resultados}
      </p>
    </div>
  );
}

