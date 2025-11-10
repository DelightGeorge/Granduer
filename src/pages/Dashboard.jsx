import { Link } from "react-router-dom";
import { FaTachometerAlt, FaBox, FaUsers, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">Granduer Admin</h2>

        <nav className="flex flex-col gap-4">
          <Link to="/dashboard" className="flex items-center gap-3 hover:text-black hover:bg-white p-3 rounded-md transition">
            <FaTachometerAlt /> Dashboard
          </Link>
          <Link to="/newarrivals" className="flex items-center gap-3 hover:text-black hover:bg-white p-3 rounded-md transition">
            <FaBox /> Products
          </Link>
          <Link to="/" className="flex items-center gap-3 hover:text-black hover:bg-white p-3 rounded-md transition">
            <FaUsers /> Users
          </Link>
          <Link to="/cart" className="flex items-center gap-3 hover:text-black hover:bg-white p-3 rounded-md transition">
            <FaShoppingCart /> Orders
          </Link>
        </nav>

        <button className="mt-auto flex items-center gap-3 text-red-300 hover:text-red-600 transition pt-10">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>
        <p className="text-gray-600 mb-6">Manage products, orders, users & settings.</p>

        {/* Dashboard Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold">Total Products</h3>
            <p className="text-3xl font-bold text-primary">120</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold">Orders</h3>
            <p className="text-3xl font-bold text-primary">89</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold">Users</h3>
            <p className="text-3xl font-bold text-primary">342</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold">Revenue</h3>
            <p className="text-3xl font-bold text-primary">$45,200</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
