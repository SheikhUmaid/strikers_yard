import { useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, loggedIn, openLogin }) {
  const location = useLocation();

  if (!loggedIn) {
    // Open login modal instead of navigating
    openLogin(location.pathname);
    return null; // Don't render the page yet
  }

  return children;
}
