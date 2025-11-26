import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { isLoggedIn } from "../services/is_logged_in";

export default function Navbar({ openLogin }) {
  const [open, setOpen] = useState(false);
  const loggedIn = isLoggedIn();

  return (
    <div className="backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link 
          to="/" 
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Book My Turf
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6 ml-10">
          <Link to="/" className="font-medium text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/booking" className="font-medium text-gray-700 hover:text-blue-600">Book Turf</Link>
          <Link to="/my-bookings" className="font-medium text-gray-700 hover:text-blue-600">My Bookings</Link>
        </div>

        {/* RIGHT SIDE - PROFILE OR LOGIN (DESKTOP) */}
        {loggedIn ? (
          <Link 
            to="/profile" 
            className="font-medium text-gray-700 hover:text-blue-600 hidden md:block"
          >
            Profile
          </Link>
        ) : (
          <button
            onClick={openLogin}
            className="font-medium text-gray-700 hover:text-blue-600 hidden md:block"
          >
            Login
          </button>
        )}

        {/* MOBILE MENU BUTTON */}
        <button 
          className="md:hidden p-2" 
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      {open && (
        <div className="md:hidden bg-white/50 backdrop-blur-xl border-t border-white/20 py-4 px-6 space-y-4">
          
          <Link 
            to="/" 
            className="block font-medium text-gray-700 hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link 
            to="/booking"
            className="block font-medium text-gray-700 hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            Book Turf
          </Link>

          <Link 
            to="/my-bookings"
            className="block font-medium text-gray-700 hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            My Bookings
          </Link>

          {/* MOBILE PROFILE / LOGIN */}
          {loggedIn ? (
            <Link 
              to="/profile"
              className="block font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
          ) : (
            <button
              onClick={() => {
                openLogin();
                setOpen(false);
              }}
              className="block font-medium text-gray-700 hover:text-blue-600"
            >
              Login
            </button>
          )}

        </div>
      )}
    </div>
  );
}
