import { BiBomb, BiLogIn, BiLogOut } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { fakeApi } from "../fakeapi/FakeApi";

export default function Navbar() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();

  const linkBase = "text-sm text-muted-foreground";
  const active = "text-sm font-semibold";

  function handleLogout() {
    fakeApi.logout();
    setUser(null);
    navigate("/");
  }

  return (
    <header className="sf-header">
      <div className="sf-header-inner">
        <div className="flex items-center gap-2">
          <BiBomb aria-hidden />
          <h2 className="text-lg font-semibold">Sala Finder</h2>
          {user ? (
            <span className="text-xs text-muted-foreground">
              {user.role === "admin" ? "Admin" : "Usuario"} · {user.email}
            </span>
          ) : null}
        </div>

        <nav
          className="sf-nav"
          aria-label="Navegación principal"
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${active}` : linkBase
            }
          >
            Espacios
          </NavLink>
          <NavLink
            to="/reservations"
            className={({ isActive }) =>
              isActive ? `${active}` : linkBase
            }
          >
            Mis reservaciones
          </NavLink>
          <NavLink
            to="/reservar"
            className={({ isActive }) =>
              isActive ? `${active}` : linkBase
            }
          >
            Nueva reserva
          </NavLink>

          {user?.role === "admin" && (
            <NavLink
              to="/audit"
              className={({ isActive }) =>
                isActive ? `${active}` : linkBase
              }
            >
              Auditoría
            </NavLink>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-transparent"
            >
              <BiLogOut aria-hidden />
              Salir
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? `${active}` : linkBase
                }
              >
                <span className="inline-flex items-center gap-2">
                  <BiLogIn aria-hidden />
                  Log in
                </span>
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive ? `${active}` : linkBase
                }
              >
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
