import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ Import React Router's navigation hook

  const handleLogout = () => {
    logout(); // Clears token & resets user (handled in AuthContext)
    navigate("/"); // ✅ Redirects to login page
  };

  return (
    <div className="bg-gray-800 text-white flex justify-between items-center p-4  h-[50px]">
      <h1 className="text-xl font-bold">AI Chatbot</h1>
      <div className="flex items-center space-x-3">
        <span className="text-gray-300">Hi, {user?.username}</span>
        <button
          onClick={handleLogout} // ✅ Use local function
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
