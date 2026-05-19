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
    <div className="filters-panel" role="search" aria-label="Filtros de espacios">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="filtro-busqueda">Buscar</label>
        <input
          id="filtro-busqueda"
          type="search"
          placeholder="Nombre del espacio…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="w-full min-w-[140px] md:w-44">
        <label htmlFor="filtro-tipo">Tipo</label>
        <select
          id="filtro-tipo"
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="SALON">Salón</option>
          <option value="LABORATORIO">Laboratorio</option>
          <option value="AUDITORIO">Auditorio</option>
        </select>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm !text-muted-foreground self-end pb-2">
        <input
          type="checkbox"
          checked={soloDisponibles}
          onChange={(e) => setSoloDisponibles(e.target.checked)}
        />
        Solo disponibles
      </label>

      <button type="button" onClick={onReset} className="btn-ghost self-end">
        Reset
      </button>

      <p className="text-sm text-muted-foreground md:ml-auto self-end pb-2">
        <span className="font-semibold" style={{ color: "var(--text-main)" }}>
          {resultados}
        </span>{" "}
        resultado{resultados !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
