export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="p-6 pt-20">
      <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Welcome back{user?.name ? `, ${user.name}` : ""}.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Access Level</p>
          <p className="mt-2 text-xl font-semibold text-slate-800">Admin</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">User Email</p>
          <p className="mt-2 break-all text-xl font-semibold text-slate-800">
            {user?.email || "Not available"}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Status</p>
          <p className="mt-2 text-xl font-semibold text-emerald-600">Active</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow">
        <h2 className="text-xl font-semibold text-slate-800">Project Notes</h2>
        <p className="mt-3 text-slate-600">
          This panel is ready for admin-only actions such as managing users,
          products, and reports as the project grows.
        </p>
      </div>
    </div>
  );
}
