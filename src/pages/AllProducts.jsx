import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { ProductContext } from "../Context/ProductContext";
import Layout from "../Shared/Layout";

const AllProducts = () => {
  const { productData, HandleGetProducts, HandleAddTCart } = useContext(ProductContext);
  const [search, setSearch] = useState("");

  useEffect(() => { if (!productData?.length) HandleGetProducts(); }, []);

  const filtered = (productData || []).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">All products</h1>
            <p className="text-sm text-gray-500 mt-0.5">{filtered.length} items</p>
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:border-gray-400"
          />
        </div>

        {!productData ? (
          <div className="flex justify-center items-center h-64 text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-gray-400 text-sm">No products found.</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map(product => (
              <div key={product.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-300 transition group">
                <Link to={`/product/${product.id}`} className="block w-full h-60 bg-gray-50 overflow-hidden">
                  {product.image
                    ? <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    : <div className="w-full h-full flex items-center justify-center"><div className="w-10 h-10 rounded-full bg-gray-200" /></div>}
                </Link>
                <div className="p-4">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 mb-2 line-clamp-1">{product.description}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <FaStar size={11} className="text-yellow-400" />
                    <span className="text-xs text-gray-500">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">${product.price?.toFixed(2)}</span>
                    <button
                      onClick={() => HandleAddTCart(product, 1, product.defaultSize, product.defaultColor)}
                      className="w-8 h-8 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center hover:opacity-75 transition"
                    >
                      <FaShoppingCart size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllProducts;