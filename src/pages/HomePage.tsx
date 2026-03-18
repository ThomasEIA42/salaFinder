import { useCallback, useEffect, useMemo, useState } from "react";
import type { Sala } from "../types/types";
import { fakeApi } from "../fakeapi/FakeApi";
import SalaCard from "../componentes/SalaCard";
import SpacesFilters from "../componentes/SpacesFilters";

export default function HomePage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<string>("");
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  const cargarSalas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fakeApi.obtenerSalas();
      setSalas(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Error al cargar espacios."
      );
      setSalas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarSalas();
  }, [cargarSalas]);

  const filtradas = useMemo(() => {
    return salas.filter((s) => {
      const matchNombre = s.nombre
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchTipo = !tipoFiltro || s.tipo === tipoFiltro;
      const matchDisp =
        !soloDisponibles || s.estado === "DISPONIBLE";
      return matchNombre && matchTipo && matchDisp;
    });
  }, [salas, search, tipoFiltro, soloDisponibles]);

  const reset = useCallback(() => {
    setSearch("");
    setTipoFiltro("");
    setSoloDisponibles(false);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="mb-2 text-2xl font-bold">Espacios disponibles</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Busca, filtra y reserva salas, laboratorios y auditorios (fake API
        async).
      </p>

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
        <p className="py-8 text-center text-muted-foreground" role="status">
          Cargando espacios
        </p>
      )}

      {!loading && error && (
        <div
          className="rounded-lg border border-red-500/40 bg-red-950/30 p-4"
          role="alert"
        >
          <p className="mb-2 font-medium text-red-200">{error}</p>
          <button type="button" onClick={cargarSalas}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtradas.map((sala) => (
            <SalaCard key={sala.id} sala={sala} />
          ))}
        </div>
      )}

      {!loading && !error && filtradas.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">
          No hay espacios que coincidan con los filtros.
        </p>
      )}
    </div>
  );
}
