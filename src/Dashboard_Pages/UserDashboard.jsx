import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import Layout from "../Shared/Layout";
import { baseUrl } from "../App";
import { ProductContext } from "../Context/ProductContext";

export default function UserDash() {
  // Fix 1: read from correct key "user" (matches what LoginPage saves)
  const { token } = useContext(ProductContext);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [userInfo, setUserInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  });

  const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    // Fix 1: correct localStorage key is "user"
    const storedData = JSON.parse(localStorage.getItem("user") || "null");
    if (storedData) {
      setUserInfo({
        firstname: storedData.firstname || "",
        lastname: storedData.lastname || "",
        email: storedData.email || "",
        phone: storedData.phone || "",
        address: storedData.address || "",
        image: storedData.image || "",
      });
    }
  }, []);

  // Fix 4: fetch real orders from receipts API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${baseUrl}my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data?.data) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Fix 2: correct endpoint to match your router
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}users/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userInfo),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server responded with:", text);
        throw new Error("Failed to update profile.");
      }

      const data = await res.json();

      // Update localStorage with the correct key
      localStorage.setItem("user", JSON.stringify(data.user));
      setUserInfo({
        firstname: data.user.firstname || "",
        lastname: data.user.lastname || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
        image: data.user.image || "",
      });

      alert("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings.");
    }
  };

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 text-slate-800">
        <div className="max-w-[1400px] mx-auto p-4 md:p-6">
          <header className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              {/* Fix 3: show real user image or fallback */}
              <img
                src={userInfo.image || `https://ui-avatars.com/api/?name=${userInfo.firstname}+${userInfo.lastname}&background=000&color=fff`}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <h1 className="text-lg font-semibold">
                  Welcome Back{userInfo.firstname ? `, ${userInfo.firstname}` : ""}
                </h1>
                <p className="text-sm text-slate-500">Your dashboard overview</p>
              </div>
            </div>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1 bg-white border rounded-xl p-4 shadow-sm">
              <nav className="space-y-2">
                {["Dashboard", "My Orders", "Account Settings"].map((label) => (
                  <NavItem
                    key={label}
                    label={label}
                    active={activeTab === label}
                    onClick={() => setActiveTab(label)}
                  />
                ))}
              </nav>
            </aside>

            <section className="lg:col-span-3 space-y-6">
              {activeTab === "Dashboard" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <div className="bg-white border rounded-xl p-4 shadow-sm text-center">
                    <div className="text-xs text-slate-500">Pending Orders</div>
                    <div className="text-2xl font-semibold mt-1">{pendingCount}</div>
                  </div>
                  <div className="bg-white border rounded-xl p-4 shadow-sm text-center">
                    <div className="text-xs text-slate-500">Total Orders</div>
                    <div className="text-2xl font-semibold mt-1">{orders.length}</div>
                  </div>
                  <div className="bg-white border rounded-xl p-4 shadow-sm text-center">
                    <div className="text-xs text-slate-500">Total Spent</div>
                    <div className="text-2xl font-semibold mt-1">
                      ₦{orders.reduce((sum, o) => sum + (o.amount || 0), 0).toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "My Orders" && (
                <div className="bg-white border rounded-xl p-4 shadow-sm overflow-x-auto">
                  <h3 className="text-sm font-medium mb-3">My Orders</h3>
                  {ordersLoading ? (
                    <p className="text-center text-gray-400 py-4">Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <p className="text-center text-gray-400 py-4">No orders yet.</p>
                  ) : (
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-slate-500">
                          <th className="px-3 py-2">Order ID</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2">Amount</th>
                          <th className="px-3 py-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-t">
                            <td className="px-3 py-3 font-medium">{order.orderId}</td>
                            <td className="px-3 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === "success"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-3 py-3">₦{(order.amount / 100).toLocaleString()}</td>
                            <td className="px-3 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {activeTab === "Account Settings" && (
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <h3 className="text-sm font-medium mb-3">Account Settings</h3>
                  <form className="space-y-4" onSubmit={handleSaveSettings}>
                    {[
                      { key: "firstname", label: "First Name" },
                      { key: "lastname", label: "Last Name" },
                      { key: "email", label: "Email" },
                      { key: "phone", label: "Phone" },
                      { key: "address", label: "Address" },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="block text-sm font-medium mb-1">{label}</label>
                        <input
                          type={key === "email" ? "email" : "text"}
                          name={key}
                          value={userInfo[key]}
                          onChange={handleChange}
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                    ))}
                    <button
                      type="submit"
                      className="bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </Layout>
  );
}

function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${
        active ? "bg-black text-white font-medium" : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span className="text-sm">{label}</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400"
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}