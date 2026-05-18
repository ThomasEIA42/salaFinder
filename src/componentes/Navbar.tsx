import { BiBomb, BiLogIn, BiLogOut } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { fakeApi } from "../fakeapi/FakeApi";

export default function Navbar() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();

  const linkBase = "text-sm text-muted-foreground";
  const active = "text-sm font-semibold";
  const linkBase = "navLink";
  const active = "navLinkActive";

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
          className="top-nav flex flex-wrap items-center gap-4 text-sm text-muted"
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
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? `${linkBase} ${active}` : linkBase
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              isActive ? `${linkBase} ${active}` : linkBase
            }
          >
            Calendario
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
              className="navButton navButton--ghost"
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
                className="navButton navButton--ghost"
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
                className="navButton navButton--primary"
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
