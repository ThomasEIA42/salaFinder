import { useCallback, useEffect, useMemo, useState } from "react";
import { getSpaces } from "../api/api";
import SalaCard from "../componentes/SalaCard";
import SpacesFilters from "../componentes/SpacesFilters";
import { useApp } from "../context/AppContext";
import { mapSpaceToListItem } from "../utils/spaceMapper";

export default function HomePage() {
  const { user } = useApp();
  const [salas, setSalas] = useState(() => [] as ReturnType<typeof mapSpaceToListItem>[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  const cargarSalas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSpaces();
      setSalas(data.map(mapSpaceToListItem));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar espacios.");
      setSalas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargarSalas();
  }, [cargarSalas]);

  const filtradas = useMemo(() => {
    return salas.filter((s) => {
      const matchNombre = s.nombre
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchTipo = !tipoFiltro || s.tipo.toUpperCase() === tipoFiltro;
      const matchDisp = !soloDisponibles || s.estado === "DISPONIBLE";
      return matchNombre && matchTipo && matchDisp;
    });
  }, [salas, search, tipoFiltro, soloDisponibles]);

  const reset = useCallback(() => {
    setSearch("");
    setTipoFiltro("");
    setSoloDisponibles(false);
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Espacios disponibles</h1>
        <p className="page-subtitle">
          {user
            ? "Busca, filtra y reserva salas, laboratorios y auditorios."
            : "Explora los espacios disponibles. Para reservar debes iniciar sesión."}
        </p>
      </header>

      <SpacesFilters
        search={search}
        setSearch={setSearch}
        tipoFiltro={tipoFiltro}
        setTipoFiltro={setTipoFiltro}
        soloDisponibles={soloDisponibles}
        setSoloDisponibles={setSoloDisponibles}
        resultados={filtradas.length}
        onReset={reset}
      />

      {loading && (
        <p className="state-loading" role="status">
          Cargando espacios…
        </p>
      )}

      {!loading && error && (
        <div className="alert-error" role="alert">
          <p>{error}</p>
          <pre className="text-xs mt-3 mb-3 opacity-80 overflow-x-auto">
            cd BackendSalaFinder{"\n"}
            dotnet run --launch-profile https
          </pre>
          <button type="button" onClick={() => void cargarSalas()}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && filtradas.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtradas.map((sala) => (
            <SalaCard key={sala.id} sala={sala} />
          ))}
        </div>
      )}

      {!loading && !error && filtradas.length === 0 && (
        <p className="state-empty">
          No hay espacios que coincidan con los filtros.
        </p>
      )}
    </div>
  );
}
