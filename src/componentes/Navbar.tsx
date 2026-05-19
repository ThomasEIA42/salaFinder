import { BiBomb, BiLogIn, BiLogOut } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  function navClass(isActive: boolean) {
    return isActive ? "navLink navLinkActive" : "navLink";
  }

  const roleLabel =
    user?.role === "Admin"
      ? "Admin"
      : user?.role === "Staff"
        ? "Staff"
        : user
          ? "Estudiante"
          : null;

  return (
    <header className="sf-header">
      <div className="sf-header-inner">
        <div className="sf-brand">
          <span className="sf-logo" aria-hidden>
            <BiBomb />
          </span>
          <div>
            <h2 className="sf-brand-title">Sala Finder</h2>
            {user ? (
              <span className="sf-brand-meta">
                {roleLabel} · {user.email}
              </span>
            ) : null}
          </div>
        </div>

        <nav className="sf-nav" aria-label="Navegación principal">
          <NavLink to="/" className={({ isActive }) => navClass(isActive)}>
            Espacios
          </NavLink>
          <NavLink to="/reservations" className={({ isActive }) => navClass(isActive)}>
            Mis reservaciones
          </NavLink>
          <NavLink to="/reservar" className={({ isActive }) => navClass(isActive)}>
            Nueva reserva
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => navClass(isActive)}>
            Dashboard
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => navClass(isActive)}>
            Calendario
          </NavLink>

          {user?.role === "Admin" && (
            <NavLink to="/audit" className={({ isActive }) => navClass(isActive)}>
              Auditoría
            </NavLink>
          )}

          {user ? (
            <button type="button" onClick={handleLogout} className="navButton navButton--ghost">
              <BiLogOut aria-hidden />
              Salir
            </button>
          ) : (
            <>
              <NavLink to="/login" className="navButton navButton--ghost">
                <BiLogIn aria-hidden />
                Log in
              </NavLink>
              <NavLink to="/signup" className="navButton navButton--primary">
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
