export default function SellerDashboard() {
  return (
    <div className="p-6 pt-20">
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Seller accounts can use this page as their workspace.
      </p>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow">
        <h2 className="font-semibold text-slate-800">Next Step</h2>
        <p className="mt-2 text-slate-600">
          Product management UI can be added here without breaking seller login
          redirects.
        </p>
      </div>
    </div>
  );
}
