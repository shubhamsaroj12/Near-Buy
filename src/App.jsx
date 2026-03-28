import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const location = useLocation();

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <>
      {location.pathname !== "/login" && <Navbar cart={cart} />}

      <Routes>

        <Route path="/" element={<Home cart={cart} setCart={setCart} />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart cart={cart} setCart={setCart} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

      </Routes>
    </>
  );
}