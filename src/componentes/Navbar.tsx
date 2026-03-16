import { FiMusic, FiLogIn } from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkBase = "text-sm text-muted hover:text-text";
  const active = "text-brand-700 font-semibold text-text";

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-text">
          <FiMusic className="text-brand-700" />
          <h2 className="text-lg font-semibold">Sala Finder</h2>
        </div>

        <nav
          className="flex items-center gap-4 text-sm text-muted"
          aria-label="Primary navigation"
        >
          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${linkBase} ${active}` : linkBase
            }
          >
            Home
          </NavLink>

          {/* My Reservations */}
          <NavLink
            to="/reservations"
            className={({ isActive }) =>
              isActive ? `${linkBase} ${active}` : linkBase
            }
          >
            My Reservations
          </NavLink>

          {/* Login */}
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? `${linkBase} ${active}` : linkBase
            }
          >
            <span className="inline-flex items-center gap-2">
              <FiLogIn />
              Log In
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}