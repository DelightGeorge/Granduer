import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaSignOutAlt,
  FaPlusCircle,
  FaEdit,
  FaList,
} from "react-icons/fa";
import Layout from "../Shared/Layout";


const Dashboard = () => {
  return (
    <Layout>
      <div className="md:min-h-screen md:flex bg-gray-100">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-primary text-white flex flex-col p-4 md:p-6 items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl font-bold mb-6">Granduer Admin</h2>

          <nav className="flex flex-col gap-3 w-full">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 hover:text-black hover:bg-white p-3 rounded-md transition w-full justify-center md:justify-start"
            >
              <FaTachometerAlt /> Dashboard
            </Link>

            <Link
              to="/all-products"
              className="flex items-center gap-3 hover:text-black hover:bg-white p-3 rounded-md transition w-full justify-center md:justify-start"
            >
              <FaBox /> Manage Products
            </Link>

            <Link
              to="/users"
              className="flex items-center gap-3 hover:text-black hover:bg-white p-3 rounded-md transition w-full justify-center md:justify-start"
            >
              <FaUsers /> Users
            </Link>

            <Link
              to="/orders"
              className="flex items-center gap-3 hover:text-black hover:bg-white p-3 rounded-md transition w-full justify-center md:justify-start"
            >
              <FaShoppingCart /> Orders
            </Link>
          </nav>

          <button className="mt-8 md:mt-auto flex items-center gap-3 text-red-300 hover:text-red-600 transition pt-4 w-full justify-center md:justify-start">
            <FaSignOutAlt /> Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 mb-10">
            Manage products, orders, users & settings.
          </p>

          {/* Quick Product Actions */}
          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <Link
              to="/products/create"
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-xl transition"
            >
              <FaPlusCircle className="text-primary text-4xl mb-3" />
              <h3 className="text-xl font-semibold">Add Product</h3>
              <p className="text-gray-600 text-sm mt-1">
                Create a new product for the store.
              </p>
            </Link>

            <Link
              to="/all-products"
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-xl transition"
            >
              <FaList className="text-primary text-4xl mb-3" />
              <h3 className="text-xl font-semibold">View All Products</h3>
              <p className="text-gray-600 text-sm mt-1">
                See all products and manage them.
              </p>
            </Link>

            <Link
              to="/products"
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-xl transition"
            >
              <FaEdit className="text-primary text-4xl mb-3" />
              <h3 className="text-xl font-semibold">Update / Edit Product</h3>
              <p className="text-gray-600 text-sm mt-1">
                Edit product details or update pricing.
              </p>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold">Total Products</h3>
              <p className="text-3xl font-bold text-primary">120</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold">Orders</h3>
              <p className="text-3xl font-bold text-primary">89</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold">Users</h3>
              <p className="text-3xl font-bold text-primary">342</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold">Revenue</h3>
              <p className="text-3xl font-bold text-primary">$45,200</p>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Dashboard;
