import { useState, useContext, useEffect } from "react";
import { ProductContext } from "../Context/ProductContext";
import CreateProduct from "./CreateProduct";
import Layout from "../Shared/Layout";
import { useNavigate } from "react-router-dom";
import {
  FaPlusCircle, FaList, FaBox, FaShoppingCart,
  FaUsers, FaTachometerAlt, FaTrash, FaEdit,
} from "react-icons/fa";

const AdminDashboard = () => {
  const { filteredProducts = [], HandleGetProducts } = useContext(ProductContext);
  const navigate = useNavigate();

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAllProductsModal, setShowAllProductsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeNav, setActiveNav] = useState("Dashboard");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await HandleGetProducts();
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const recentProducts = (filteredProducts || []).slice(0, 5);

  const openEditModal = (prod) => {
    setSelectedProduct(prod);
    setShowEditModal(true);
    setShowAllProductsModal(false);
  };

  const navItems = [
    { label: "Dashboard", icon: FaTachometerAlt },
    { label: "Manage Products", icon: FaBox },
    { label: "Users", icon: FaUsers },
    { label: "Orders", icon: FaShoppingCart },
  ];

  return (
    <Layout>
      <div className="md:flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-primary text-white flex flex-col p-4 md:p-6">
          <h2 className="text-2xl font-bold mb-8 text-center md:text-left">Ikeyá Admin</h2>
          <nav className="flex flex-col gap-2 w-full">
            {/* Fix 9: use state-based active nav instead of dead href="#" */}
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={`flex items-center gap-3 p-3 rounded-md transition w-full justify-center md:justify-start ${
                  activeNav === label
                    ? "bg-white text-black font-semibold"
                    : "hover:bg-white hover:text-black"
                }`}
              >
                <Icon /> {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { title: "Total Products", icon: FaBox, value: filteredProducts?.length || 0 },
              { title: "Orders", icon: FaShoppingCart, value: 89 },
              { title: "Users", icon: FaUsers, value: 342 },
              // Fix 7: use ₦ not $
              { title: "Revenue", icon: FaTachometerAlt, value: "₦45,200" },
            ].map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className="bg-white shadow-md rounded-xl p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Icon className="text-primary text-3xl" />
                      <h3 className="font-semibold text-sm">{card.title}</h3>
                    </div>
                    <p className="text-xl font-bold">{card.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition"
            >
              <FaPlusCircle className="text-primary text-4xl mb-3" />
              <h3 className="text-xl font-semibold">Add Product</h3>
            </button>
            <button
              onClick={() => setShowAllProductsModal(true)}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition"
            >
              <FaList className="text-primary text-4xl mb-3" />
              <h3 className="text-xl font-semibold">View All Products</h3>
            </button>
          </div>

          {/* Recent Products Table */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Products</h2>
            {loadingProducts ? (
              <p className="text-center text-gray-500">Loading products...</p>
            ) : recentProducts.length === 0 ? (
              <p className="text-center text-gray-500">No products found.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-500 text-sm">
                    <th className="border-b p-2">Name</th>
                    {/* Fix 7: ₦ currency */}
                    <th className="border-b p-2">Price (₦)</th>
                    <th className="border-b p-2">Category</th>
                    <th className="border-b p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50 border-b">
                      <td className="p-2">{prod.name}</td>
                      <td className="p-2">₦{(prod.price / 100).toLocaleString()}</td>
                      <td className="p-2">{prod.subcategory}</td>
                      <td className="p-2">
                        {/* Fix 8: no "Add to Cart" in admin — View/Edit only */}
                        <button
                          onClick={() => openEditModal(prod)}
                          className="bg-primary text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                        >
                          <FaEdit size={12} /> View / Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>

        {/* Create Product Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto">
            <div className="bg-white w-full max-w-5xl rounded-xl p-6 relative">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-3 right-3 text-gray-600 font-bold text-xl hover:text-red-500"
              >
                ✕
              </button>
              <CreateProduct closeModal={() => {
                setShowCreateModal(false);
                HandleGetProducts(); // refresh product list after creation
              }} />
            </div>
          </div>
        )}

        {/* Edit Product Modal — admin view only, no cart action */}
        {showEditModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-50 overflow-auto pt-10">
            <div className="bg-white w-full max-w-3xl rounded-xl p-6 relative shadow-lg">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-3 right-3 text-gray-600 font-bold text-xl hover:text-red-500"
              >
                ✕
              </button>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square">
                  <img
                    src={selectedProduct.image || "/placeholder.png"}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
                  <p className="text-xl font-semibold">
                    ₦{(selectedProduct.price / 100).toLocaleString()}
                    {selectedProduct.discount > 0 && (
                      <span className="text-sm text-red-500 ml-2">
                        ({selectedProduct.discount}% off)
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">Category: {selectedProduct.subcategory}</p>
                  <p className="text-sm text-gray-500">
                    Sizes: {selectedProduct.sizes?.join(", ") || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Colors: {selectedProduct.colors?.join(", ") || "N/A"}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        // navigate to a dedicated edit page if you have one
                        // navigate(`/admin/products/${selectedProduct.id}/edit`);
                      }}
                      className="flex-1 py-2 rounded-md bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
                    >
                      <FaEdit /> Edit Product
                    </button>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View All Products Modal */}
        {showAllProductsModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-50 overflow-auto pt-10">
            <div className="bg-white w-full max-w-6xl rounded-xl p-6 relative shadow-lg">
              <button
                onClick={() => setShowAllProductsModal(false)}
                className="absolute top-3 right-3 text-gray-600 font-bold text-xl hover:text-red-500"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4">All Products</h2>
              {filteredProducts.length === 0 ? (
                <p className="text-center text-gray-500">No products available.</p>
              ) : (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="border-b p-2">Name</th>
                      <th className="border-b p-2">Price (₦)</th>
                      <th className="border-b p-2">Category</th>
                      <th className="border-b p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50 border-b">
                        <td className="p-2">{prod.name}</td>
                        <td className="p-2">₦{(prod.price / 100).toLocaleString()}</td>
                        <td className="p-2">{prod.subcategory}</td>
                        <td className="p-2 flex gap-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="bg-primary text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                          >
                            <FaEdit size={10} /> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;