import { useState, useEffect } from "react";
import Carousel from "../components/Carousel";

function getBestShop(shops = []) {
  return shops.reduce((best, current) => {
    if (!best) return current;

    if (current.price < best.price) {
      return current;
    }

    if (current.price === best.price && current.rating > best.rating) {
      return current;
    }

    return best;
  }, null);
}

export default function Home({cart, setCart}) {
  const [selected, setSelected] = useState(null);
  const [location, setLocation] = useState("Fetching...");

  // 📍 Get User Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        },
        () => setLocation("Permission Denied")
      );
    }
  }, []);

  // 🛍️ Products with multiple shops
  const products = [
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad",
    shops: [
      { name: "Amazon", price: 999, dist: 2, rating: 4.5 },
      { name: "Flipkart", price: 950, dist: 3, rating: 4.4 },
      { name: "Croma", price: 920, dist: 1, rating: 4.3 },
    ],
  },
  {
    name: "Headphones",
    image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd",
    shops: [
      { name: "Amazon", price: 1499, dist: 2.5, rating: 4.6 },
      { name: "Flipkart", price: 1399, dist: 3, rating: 4.5 },
      { name: "Reliance", price: 1350, dist: 1.8, rating: 4.4 },
    ],
  },
  {
    name: "Smart Watch",
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
    shops: [
      { name: "Amazon", price: 1999, dist: 2, rating: 4.4 },
      { name: "Flipkart", price: 1899, dist: 3, rating: 4.3 },
      { name: "Croma", price: 1850, dist: 1.5, rating: 4.2 },
    ],
  },
  {
    name: "Running Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    shops: [
      { name: "Nike", price: 2499, dist: 4, rating: 4.6 },
      { name: "Puma", price: 2299, dist: 3.5, rating: 4.5 },
      { name: "Adidas", price: 2399, dist: 2.8, rating: 4.4 },
    ],
  },
  {
    name: "Laptop",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    shops: [
      { name: "Amazon", price: 55999, dist: 5, rating: 4.7 },
      { name: "Flipkart", price: 54999, dist: 4, rating: 4.6 },
      { name: "Reliance", price: 54500, dist: 3, rating: 4.5 },
    ],
  },
  {
    name: "Smartphone",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    shops: [
      { name: "Samsung Store", price: 20999, dist: 2, rating: 4.5 },
      { name: "Amazon", price: 19999, dist: 3, rating: 4.4 },
      { name: "Flipkart", price: 19500, dist: 2.5, rating: 4.3 },
    ],
  },
  {
    name: "Backpack",
    image: "https://images.unsplash.com/photo-1526178613658-3f1622045557",
    shops: [
      { name: "Local Shop", price: 799, dist: 1, rating: 4.2 },
      { name: "Amazon", price: 899, dist: 2, rating: 4.3 },
      { name: "Flipkart", price: 850, dist: 1.5, rating: 4.1 },
    ],
  },
  {
    name: "Sunglasses",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    shops: [
      { name: "RayBan", price: 1299, dist: 3.5, rating: 4.6 },
      { name: "Amazon", price: 1199, dist: 4, rating: 4.4 },
      { name: "Flipkart", price: 1150, dist: 3, rating: 4.3 },
    ],
  },
  {
    name: "Bluetooth Speaker",
    image: "https://images.unsplash.com/photo-1589003077984-894e133dabab",
    shops: [
      { name: "Amazon", price: 1799, dist: 2, rating: 4.5 },
      { name: "Flipkart", price: 1699, dist: 3, rating: 4.4 },
      { name: "Croma", price: 1650, dist: 1.5, rating: 4.3 },
    ],
  },
  {
    name: "Gaming Mouse",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
    shops: [
      { name: "Amazon", price: 999, dist: 2, rating: 4.6 },
      { name: "Flipkart", price: 950, dist: 2.5, rating: 4.5 },
      { name: "Reliance", price: 920, dist: 1.8, rating: 4.4 },
    ],
  },
];

  // 📦 PRODUCT DETAIL PAGE
  if (selected) {
    const best = getBestShop(selected.shops);

    return (
      <div className="p-4 pt-20">
        <button
          onClick={() => setSelected(null)}
          className="text-blue-500 mb-4"
        >
          ⬅ Back
        </button>

        <h1 className="text-2xl font-bold mb-4">{selected.name}</h1>

        <img
          src={selected.image}
          alt="product"
          className="w-48 rounded mb-4"
        />

        {/* Shop Comparison */}
        <div className="bg-white p-4 rounded-xl shadow">
          {selected.shops.map((shop, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p className="font-semibold">{shop.name}</p>
                <p className="text-sm text-gray-500">
                  {shop.dist} km
                </p>
              </div>

              <div className="text-right">
                <p className="text-green-600 font-bold">
                  ₹{shop.price}
                </p>
                <p className="text-yellow-500 text-sm">
                  ⭐ {shop.rating}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Best Suggestion */}
        <div className="mt-4 p-4 bg-green-100 rounded-xl">
          🤖 Best Choice: <b>{best.name}</b> <br />
          ₹{best.price} • {best.dist} km • ⭐ {best.rating}
        </div>
      </div>
    );
  }

  // 🏠 HOME PAGE
  return (
    <div className="p-4">
      <Carousel />

      {/* Location */}
      <p className="text-sm text-gray-600 mb-3">
        📍 Location: {location}
      </p>

      {/* Categories */}
      <h2 className="font-semibold mb-3">Categories</h2>
      <div className="flex gap-3 mb-5 overflow-x-auto">
        {["Fashion", "Electronics", "Grocery", "Beauty"].map((c) => (
          <div
            key={c}
            className="bg-white px-4 py-2 rounded-full shadow text-sm"
          >
            {c}
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <h2 className="font-semibold mb-3">Products</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((p, i) => (
          <div
            key={i}
            onClick={() => setSelected(p)}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-2 cursor-pointer"
          >
            {/* Image */}
            <img
              src={p.image}
              alt="product"
              className="w-full h-32 object-cover rounded"
            />

            {/* Info */}
            <div className="mt-2">
              <h3 className="text-sm font-semibold truncate">
                {p.name}
              </h3>

              {/* Price + Shop */}
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{p.shops[0].name}</span>
                <span>{p.shops[0].dist} km</span>
              </div>

              <div className="flex justify-between items-center mt-1">
                <p className="text-green-600 font-bold text-sm">
                  ₹{p.shops[0].price}
                </p>
                <span className="text-yellow-500 text-xs">
                  ⭐ {p.shops[0].rating}
                </span>
              </div>
            </div>

            {/* Add to Cart */}
           <button
  onClick={(e) => {
    e.stopPropagation();

    setCart((prev) => {
      const exist = prev.find((item) => item.name === p.name);

      if (exist) {
        return prev.map((item) =>
          item.name === p.name
            ? { ...item, qty: (item.qty || 1) + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          name: p.name,
          price: p.shops[0].price,
          qty: 1,
        },
      ];
    });

    alert("Added to cart");
  }}
  className="w-full mt-2 bg-blue-500 text-white py-1 rounded hover:bg-blue-600 text-sm"
>
  Add to Cart
</button>
          </div>
        ))}
      </div>
    </div>
  );
}
