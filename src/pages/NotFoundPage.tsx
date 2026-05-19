import { Link } from "react-router-dom";
import StateMessage from "../componentes/StateMessage";
export default function NotFoundPage() {
  return (
    <main className="page mx-auto max-w-3xl">
      <StateMessage
        type="empty"
        title="Página no encontrada"
        description="La ruta que intentas abrir no existe en la aplicación."
        actionText="Ir al inicio"
        onAction={() => (window.location.href = "/")}
      />
      <div className="mt-4 text-center">
        <Link to="/" className="text-sm text-brand-700 hover:underline">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}