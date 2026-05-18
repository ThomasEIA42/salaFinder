import { useState } from "react";
import { FiLogIn } from "react-icons/fi";
import Button from "../componentes/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { LoginRedirectState } from "../utils/authRedirect";
import { fakeApi } from "../fakeapi/FakeApi";
import { useApp } from "../context/AppContext";
import { EIA_EMAIL_DOMAIN } from "../utils/emailEia";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectFrom = (location.state as LoginRedirectState | null)?.from;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email y contraseña son obligatorios.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const user = await fakeApi.login(email.trim(), password);
      setUser(user);
      showToast(
        user.role === "admin"
          ? "Sesión iniciada (administrador)."
          : "Sesión iniciada correctamente.",
        "success"
      );
      const destino = redirectFrom
        ? `${redirectFrom.pathname}${redirectFrom.search ?? ""}`
        : "/";
      navigate(destino, { replace: true });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "No se pudo iniciar sesión.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page mx-auto max-w-md">
      <section className="card card--static">
        <div className="auth-header">
          <span className="sf-logo auth-header__icon">
            <FiLogIn aria-hidden />
          </span>
          <h1 className="auth-header__title">Iniciar sesión</h1>
        </div>

        {redirectFrom && (
          <p className="auth-notice" role="status">
            Inicia sesión para continuar con tu reserva.
          </p>
        )}

        <p className="auth-hint text-sm text-muted-foreground">
          Ingresa el correo con el que te registraste (
          <strong>@{EIA_EMAIL_DOMAIN}</strong>).
        </p>

        <form
          className="form--plain mt-5 flex flex-col gap-4"
          onSubmit={onSubmit}
        >
          <label className="flex flex-col gap-1">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              placeholder={`tu.correo@${EIA_EMAIL_DOMAIN}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>Contraseña</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </label>
          {error && (
            <p className="text-sm" style={{ color: "var(--danger)" }} role="alert">
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </Button>
          <p className="m-0 text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link
              className="font-semibold"
              to="/signup"
              state={location.state}
            >
              Registrarse
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
