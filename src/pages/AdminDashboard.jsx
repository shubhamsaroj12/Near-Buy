import { useEffect, useState } from "react";
import apiClient from "../lib/apiClient";
import getApiErrorMessage from "../lib/getApiErrorMessage";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = async () => {
    setIsLoading(true);

    try {
      const [usersRes, productsRes] = await Promise.all([
        apiClient.get("/api/auth/users"),
        apiClient.get("/api/products"),
      ]);

      setUsers(usersRes.data || []);
      setProducts(productsRes.data || []);
    } catch (err) {
      alert(getApiErrorMessage(err, "Admin dashboard data load nahi hua"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const admins = users.filter((item) => item.role === "admin").length;
  const sellers = users.filter((item) => item.role === "seller").length;
  const customers = users.filter(
    (item) => !item.role || item.role === "user"
  ).length;
  const totalShops = products.reduce(
    (sum, product) => sum + (product.shops?.length || 0),
    0
  );

  const recentUsers = [...users].slice(-5).reverse();
  const recentProducts = [...products].slice(-4).reverse();

  return (
    <div className="min-h-screen bg-slate-100 p-4 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-700 p-6 text-white shadow-lg">
          <p className="text-sm uppercase tracking-[0.25em] text-white/70">
            Admin Control Room
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Welcome back{user?.name ? `, ${user.name}` : ""}.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            Yahan se users, seller activity, aur product network ka quick health
            view mil raha hai.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Total Users</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">
              {users.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Sellers</p>
            <p className="mt-2 text-3xl font-bold text-amber-500">{sellers}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Products</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Shop Entries</p>
            <p className="mt-2 text-3xl font-bold text-cyan-600">
              {totalShops}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-white p-6 shadow">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">
                  User Breakdown
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Role-wise distribution of the current user base.
                </p>
              </div>
              <button
                onClick={loadDashboard}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Admins</p>
                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {admins}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Customers</p>
                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {customers}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Sellers</p>
                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {sellers}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
              Status:
              {" "}
              {isLoading
                ? "Dashboard data load ho raha hai..."
                : "Live admin summary ready hai."}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold text-slate-800">
              Admin Snapshot
            </h2>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-slate-500">Signed in as</p>
                <p className="mt-1 break-all font-semibold text-slate-800">
                  {user?.email || "Not available"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-slate-500">Access level</p>
                <p className="mt-1 font-semibold text-slate-800">Admin</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-slate-500">Operational note</p>
                <p className="mt-1">
                  Atlas unavailable hone par bhi fallback storage ke through
                  testing continue ho sakti hai.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold text-slate-800">
              Recent Users
            </h2>
            {recentUsers.length === 0 ? (
              <p className="mt-4 text-slate-500">Abhi users data available nahi hai.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {recentUsers.map((item) => (
                  <div
                    key={item._id || item.email}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.name || "Unnamed User"}
                      </p>
                      <p className="text-sm text-slate-500">{item.email}</p>
                    </div>
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
                      {item.role || "user"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold text-slate-800">
              Recent Products
            </h2>
            {recentProducts.length === 0 ? (
              <p className="mt-4 text-slate-500">
                Abhi koi product listing available nahi hai.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {recentProducts.map((product) => (
                  <div
                    key={product._id || product.name}
                    className="rounded-2xl bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {product.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          Shops linked: {product.shops?.length || 0}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-emerald-600">
                        Rs. {product.shops?.[0]?.price ?? "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
