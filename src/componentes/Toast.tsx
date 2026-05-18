import { useApp } from "../context/AppContext";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`toast ${
        toast.type === "error" ? "toast--error" : "toast--success"
      }`}
    >
      {toast.message}
    </div>
  );
}
