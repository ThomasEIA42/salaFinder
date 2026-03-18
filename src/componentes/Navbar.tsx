import { BiBomb, BiLogIn, BiLogOut } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { fakeApi } from "../fakeapi/FakeApi";

export default function Navbar() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();

  const linkBase = "text-sm text-muted hover:text-text";
  const active = "text-brand-700 font-semibold text-text";

  function handleLogout() {
    fakeApi.logout();
    setUser(null);
    navigate("/");
  }

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-2 text-text">
          <BiBomb className="text-brand-700" aria-hidden />
          <h2 className="text-lg font-semibold">Sala Finder</h2>
        </div>

        <nav
          className="flex flex-wrap items-center gap-4 text-sm text-muted"
          aria-label="Navegación principal"
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${linkBase} ${active}` : linkBase
            }
          >
            Espacios
          </NavLink>
          <NavLink
            to="/reservations"
            className={({ isActive }) =>
              isActive ? `${linkBase} ${active}` : linkBase
            }
          >
            Mis reservaciones
          </NavLink>
          <NavLink
            to="/reservar"
            className={({ isActive }) =>
              isActive ? `${linkBase} ${active}` : linkBase
            }
          >
            Nueva reserva
          </NavLink>

          {user?.role === "admin" && (
            <NavLink
              to="/audit"
              className={({ isActive }) =>
                isActive ? `${linkBase} ${active}` : linkBase
              }
            >
              Auditoría
            </NavLink>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className={`inline-flex items-center gap-1 ${linkBase}`}
            >
              <BiLogOut aria-hidden />
              Salir
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? `${linkBase} ${active}` : linkBase
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
                  isActive ? `${linkBase} ${active}` : linkBase
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
