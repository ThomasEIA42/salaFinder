import { Link } from "react-router-dom";
import StateMessage from "../componentes/StateMessage";

export default function NotFoundPage() {    
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <StateMessage
        type="empty"
        title="Page not found"
        description="The route you are trying to access does not exist."
        actionText="Go home"
        onAction={() => (window.location.href = "/")}
      />
      <div className="mt-4 text-center">
        <Link to="/" className="text-sm text-brand-700 hover:underline">
          Back to Home
        </Link>
      </div>
    </main>
  );
}