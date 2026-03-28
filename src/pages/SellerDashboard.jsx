import InputField from "../components/InputField";

export default function SellerDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>
      <div className="mt-4 bg-white p-4 rounded shadow w-96">
        <h2 className="font-semibold mb-2">Add Product</h2>
        <InputField placeholder="Product Name" type="text" />
        <InputField placeholder="Price" type="number" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>
    </div>
  );
}