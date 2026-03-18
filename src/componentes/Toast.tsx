import { useApp } from "../context/AppContext";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg ${
        toast.type === "error"
          ? "border-red-500/50 bg-red-950/90 text-red-100"
          : "border-emerald-500/50 bg-emerald-950/90 text-emerald-100"
      }`}
    >
      {toast.message}
    </div>
  );
}
