import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on login or register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeRole");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center shadow-md">
      <button
        onClick={() => navigate("/dashboard")}
        className="text-lg font-semibold hover:text-gray-300"
      >
        Home
      </button>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
