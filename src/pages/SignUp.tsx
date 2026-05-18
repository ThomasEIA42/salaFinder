import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import Button from "../componentes/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { LoginRedirectState } from "../utils/authRedirect";
import { fakeApi } from "../fakeapi/FakeApi";
import { useApp } from "../context/AppContext";
import { EIA_EMAIL_DOMAIN, EIA_EMAIL_ERROR, isEmailEia } from "../utils/emailEia";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectFrom = (location.state as LoginRedirectState | null)?.from;

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
    if (!isEmailEia(email)) {
      setError(EIA_EMAIL_ERROR);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const user = await fakeApi.register(email.trim(), password);
      setUser(user);
      showToast("Cuenta creada. Bienvenido.", "success");
      const destino = redirectFrom
        ? `${redirectFrom.pathname}${redirectFrom.search ?? ""}`
        : "/";
      navigate(destino, { replace: true });
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
    <main className="page mx-auto max-w-md">
      <section className="card card--static">
        <div className="auth-header">
          <span className="sf-logo auth-header__icon">
            <FiUserPlus aria-hidden />
          </span>
          <h1 className="auth-header__title">Registro</h1>
        </div>

        <p className="auth-hint text-sm text-muted-foreground">
          Solo se permiten correos institucionales{" "}
          <strong>@{EIA_EMAIL_DOMAIN}</strong> (ej.{" "}
          <code
            className="text-xs px-1.5 py-0.5 rounded"
            style={{ background: "rgba(148,163,184,0.12)" }}
          >
            nombre.apellido@{EIA_EMAIL_DOMAIN}
          </code>
          ).
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
              placeholder={`tu.nombre@${EIA_EMAIL_DOMAIN}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              aria-describedby="signup-email-hint"
            />
            <span id="signup-email-hint" className="text-xs text-muted-foreground">
              Dominio obligatorio: @{EIA_EMAIL_DOMAIN}
            </span>
          </label>
          <label className="flex flex-col gap-1">
            <span>Contraseña</span>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>Confirmar contraseña</span>
            <input
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
            <p className="text-sm" style={{ color: "var(--danger)" }} role="alert">
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </Button>
          <p className="m-0 text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link className="font-semibold" to="/login" state={location.state}>
              Iniciar sesión
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
