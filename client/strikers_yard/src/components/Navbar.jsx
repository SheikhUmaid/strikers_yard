import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { isLoggedIn } from "../services/is_logged_in";

export default function Navbar({ openLogin }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const loggedIn = isLoggedIn();

  useEffect(() => {
    const handler = () => setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.dispatchEvent(new Event("authChanged"));
    window.location.href = "/";
  };

  return (
    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[90vw] max-w-5xl z-40">
      <nav className="
          flex items-center justify-between px-6 py-5 
          rounded-2xl shadow-xl backdrop-blur-xl 
          bg-gray-950/20 border border-white/15
          text-white
        "
      >
        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight font-[Montserrat] drop-shadow"
        >
          Strikers Yard
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="font-semibold px-4 py-1 rounded-xl transition hover:bg-white/10 hover:text-emerald-300"
          >
            Home
          </Link>
          <Link
            to="/booking"
            className="font-semibold px-4 py-1 rounded-xl transition hover:bg-white/10 hover:text-emerald-300"
          >
            Book Turf
          </Link>
          <Link
            to="/my-bookings"
            className="font-semibold px-4 py-1 rounded-xl transition hover:bg-white/10 hover:text-emerald-300"
          >
            My Bookings
          </Link>
        </div>

        {/* DESKTOP LOGIN BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          {!loggedIn ? (
            <button
              onClick={openLogin}
              className="
                font-bold px-7 py-2 rounded-full transition 
                border-2 border-emerald-400 
                hover:bg-emerald-400 hover:text-black
                hover:shadow-md
              "
            >
              Login
            </button>
          ) : (
            <>
              <Link
                to="/profile"
                className="font-semibold px-4 py-2 rounded-full transition hover:bg-white/10 hover:text-emerald-300"
              >
                {user?.name || "User"}
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-white/10 text-emerald-300"
              >
                <LogOut size={24} />
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div
          className="
            md:hidden mt-3 p-6 rounded-2xl backdrop-blur-xl 
            bg-gray-950/40 border border-white/10 shadow-xl 
            flex flex-col gap-4 text-white
          "
        >
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="font-semibold py-2 rounded-xl hover:bg-white/10 hover:text-emerald-300"
          >
            Home
          </Link>
          <Link
            to="/booking"
            onClick={() => setOpen(false)}
            className="font-semibold py-2 rounded-xl hover:bg-white/10 hover:text-emerald-300"
          >
            Book Turf
          </Link>
          <Link
            to="/my-bookings"
            onClick={() => setOpen(false)}
            className="font-semibold py-2 rounded-xl hover:bg-white/10 hover:text-emerald-300"
          >
            My Bookings
          </Link>

          {/* LOGIN / LOGOUT MOBILE */}
          {!loggedIn ? (
            <button
              onClick={() => {
                setOpen(false);
                openLogin();
              }}
              className="
                w-full font-bold py-3 rounded-xl border-2 
                border-emerald-400 hover:bg-emerald-400 
                hover:text-black transition
              "
            >
              Login
            </button>
          ) : (
            <>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="font-semibold py-2 rounded-xl hover:bg-white/10 hover:text-emerald-300"
              >
                {user?.name || "User"}
              </Link>
              <button
                onClick={logout}
                className="w-full font-semibold py-3 rounded-xl hover:bg-white/10 text-emerald-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
