import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const initialForm = {
  name: "",
  image: "",
  price: "",
  dist: "",
  rating: "",
};

export default function SellerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const sellerName = user?.name || "Seller";

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState("");

  const loadProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data || []);
    } catch {
      alert("Products load nahi ho paaye");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const sellerProducts = products.filter((product) =>
    product.shops?.some((shop) => shop.name === sellerName)
  );

  const totalListings = sellerProducts.length;
  const totalValue = sellerProducts.reduce((sum, product) => {
    const sellerShop = product.shops?.find((shop) => shop.name === sellerName);
    return sum + (sellerShop?.price || 0);
  }, 0);
  const averageRating = totalListings
    ? (
        sellerProducts.reduce((sum, product) => {
          const sellerShop = product.shops?.find((shop) => shop.name === sellerName);
          return sum + (sellerShop?.rating || 0);
        }, 0) / totalListings
      ).toFixed(1)
    : "0.0";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "image" && value.trim()) {
      setImagePreview(value.trim());
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl === "string") {
        setForm((prev) => ({ ...prev, image: dataUrl }));
        setImagePreview(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        name: form.name,
        image:
          form.image ||
          "https://images.unsplash.com/photo-1483985988355-763728e1935b",
        shops: [
          {
            name: sellerName,
            price: Number(form.price),
            dist: Number(form.dist),
            rating: Number(form.rating),
          },
        ],
      };

      const res = await axios.post(`${API_BASE_URL}/api/products`, payload);
      setProducts((prev) => {
        const remaining = prev.filter(
          (item) => item._id !== res.data._id && item.name !== res.data.name
        );
        return [res.data, ...remaining];
      });
      setForm(initialForm);
      setImagePreview("");
      alert("Product add ho gaya");
    } catch (err) {
      alert(err.response?.data?.msg || "Product save nahi hua");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 p-6 text-white shadow-lg">
          <p className="text-sm uppercase tracking-[0.25em] text-white/80">
            Seller Workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold">Welcome, {sellerName}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/90">
            Apne products list karo, pricing update karo, aur ek jagah se apni
            storefront ko manage karo.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Your Listings</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">
              {totalListings}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Listed Value</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              Rs. {totalValue}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Average Rating</p>
            <p className="mt-2 text-3xl font-bold text-amber-500">
              {averageRating}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow"
          >
            <h2 className="text-2xl font-semibold text-slate-800">
              Add New Product
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Seller name automatically "{sellerName}" ke naam se save hoga.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product name"
                className="rounded-xl border border-slate-200 p-3 outline-none focus:border-orange-400"
                required
              />
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Image URL (optional)"
                className="rounded-xl border border-slate-200 p-3 outline-none focus:border-orange-400"
              />
              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-orange-300 bg-orange-50 p-3 text-sm font-medium text-orange-700 transition hover:bg-orange-100">
                Upload Product Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-cyan-300 bg-cyan-50 p-3 text-sm font-medium text-cyan-700 transition hover:bg-cyan-100">
                Capture From Camera
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="rounded-xl border border-slate-200 p-3 outline-none focus:border-orange-400"
                required
              />
              <input
                name="dist"
                type="number"
                min="0"
                step="0.1"
                value={form.dist}
                onChange={handleChange}
                placeholder="Distance in km"
                className="rounded-xl border border-slate-200 p-3 outline-none focus:border-orange-400"
                required
              />
              <input
                name="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={handleChange}
                placeholder="Rating"
                className="rounded-xl border border-slate-200 p-3 outline-none focus:border-orange-400 md:col-span-2"
                required
              />
            </div>

            {imagePreview && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-48 w-full object-cover"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Add Product"}
            </button>
          </form>

          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold text-slate-800">
              Seller Notes
            </h2>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                Fast tip: clear product image dene se listing zyada trustable lagti
                hai.
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                Competitive price aur strong rating se home listing pe better
                impression padta hai.
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                Agar Atlas down ho, tab bhi local fallback ki wajah se seller
                testing rukegi nahi.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800">
                Your Products
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Sirf wo products dikh rahe hain jahan shop name "{sellerName}" hai.
              </p>
            </div>
            <button
              onClick={loadProducts}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          {isLoading ? (
            <p className="mt-5 text-slate-500">Products load ho rahe hain...</p>
          ) : sellerProducts.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
              Abhi koi seller listing nahi hai. Pehla product add karke dashboard
              ko active karo.
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sellerProducts.map((product) => {
                const sellerShop = product.shops?.find(
                  (shop) => shop.name === sellerName
                );

                return (
                  <div
                    key={product._id || `${product.name}-${sellerShop?.price}`}
                    className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-44 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {product.name}
                      </h3>
                      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                        <span>Price</span>
                        <span className="font-semibold text-emerald-600">
                          Rs. {sellerShop?.price}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                        <span>Distance</span>
                        <span>{sellerShop?.dist} km</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                        <span>Rating</span>
                        <span>{sellerShop?.rating}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
