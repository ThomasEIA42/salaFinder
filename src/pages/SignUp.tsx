import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import Button from "../componentes/Button";
import { Link, useNavigate } from "react-router-dom";
import { fakeApi } from "../fakeapi/FakeApi";
import { useApp } from "../context/AppContext";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, showToast } = useApp();
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !confirmPass.trim()) {
      setError("Completa todos los campos.");
      return;
    }
    if (password !== confirmPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const user = await fakeApi.register(email.trim(), password);
      setUser(user);
      showToast("Cuenta creada. Bienvenido.", "success");
      navigate("/");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "No se pudo registrar.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <section className="bg-brand-200 shadow rounded-card px-4">
        <div className="flex items-center text-text text-xl space-between rounded-t-card py-2">
          <FiUserPlus aria-hidden />
          <h1 className="font-semibold pl-1">Registro</h1>
        </div>

        <p className="font-raleway font-bold text-sm text-surface">
          Crea una cuenta de demostración. Usa cualquier email y contraseña.
        </p>

        <form className="mt-4 flex flex-col gap-3" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-xs text-muted">Email</span>
            <input
              className="rounded-input border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300"
              type="email"
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs text-muted">Contraseña</span>
            <input
              className="rounded-input border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300"
              type="password"
              autoComplete="new-password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs text-muted">Confirmar contraseña</span>
            <input
              className="rounded-input border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300"
              type="password"
              autoComplete="new-password"
              placeholder="••••••"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
              disabled={loading}
            />
          </label>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </Button>
          <p className="m-0 text-sm text-muted">
            ¿Ya tienes cuenta?{" "}
            <Link
              className="text-brand-600 hover:underline hover:font-semibold"
              to="/login"
            >
              Iniciar sesión
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
