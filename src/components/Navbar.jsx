import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

export default function Navbar({ cart }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/30 px-4 py-3 shadow">

      <div className="flex justify-between items-center">

        {/* Logo */}
        <img
          src={logo}
          className="h-10 cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">

          <span
            onClick={() => navigate("/")}
            className="cursor-pointer hover:text-blue-500"
          >
            Home
          </span>

          <span
            onClick={() => navigate("/cart")}
            className="cursor-pointer hover:text-blue-500 relative"
          >
            Cart 🛒
            {cart?.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1 rounded-full">
                {cart.length}
              </span>
            )}
          </span>

          {user?.role === "admin" && (
            <span
              onClick={() => navigate("/admin")}
              className="cursor-pointer hover:text-blue-500"
            >
              Admin
            </span>
          )}

          {user?.role === "seller" && (
            <span
              onClick={() => navigate("/seller")}
              className="cursor-pointer hover:text-blue-500"
            >
              Seller
            </span>
          )}

          {/* User */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">
                👋 {user.name}
              </span>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer hover:text-blue-500"
            >
              Login
            </span>
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className="md:hidden cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          ☰
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="flex flex-col mt-3 gap-2 md:hidden">

          <span onClick={() => navigate("/")}>Home</span>
          <span onClick={() => navigate("/cart")}>Cart</span>

          {user?.role === "admin" && (
            <span onClick={() => navigate("/admin")}>Admin</span>
          )}

          {user?.role === "seller" && (
            <span onClick={() => navigate("/seller")}>Seller</span>
          )}

          {user ? (
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="text-red-500"
            >
              Logout
            </button>
          ) : (
            <span onClick={() => navigate("/login")}>Login</span>
          )}
        </div>
      )}
    </div>
  );
}
