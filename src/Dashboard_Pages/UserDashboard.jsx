import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "../Shared/Layout";
import { baseUrl } from "../App";


export default function UserDash() {
  const recentOrders = [
    {
      id: "ORD-20251",
      item: "Nike Air Max",
      status: "Delivered",
      amount: "₦45,000",
      img: "https://source.unsplash.com/80x80/?nike,sneakers",
    },
    {
      id: "ORD-20250",
      item: "Samsung A14",
      status: "Processing",
      amount: "₦120,000",
      img: "https://source.unsplash.com/80x80/?phone,samsung",
    },
    {
      id: "ORD-20249",
      item: "Laptop Bag",
      status: "Pending",
      amount: "₦9,500",
      img: "https://source.unsplash.com/80x80/?bag,laptop",
    },
    {
      id: "ORD-20248",
      item: "PS5 Controller",
      status: "Refunded",
      amount: "₦28,000",
      img: "https://source.unsplash.com/80x80/?ps5,controller",
    },
  ];

  const savedItems = [
    {
      id: 1,
      item: "Black Hoodie",
      price: "₦15,000",
      img: "https://source.unsplash.com/60x60/?hoodie,black",
    },
    {
      id: 2,
      item: "Wireless Earbuds",
      price: "₦19,500",
      img: "https://source.unsplash.com/60x60/?earbuds,wireless",
    },
  ];

  // User info state
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [activeTab, setActiveTab] = useState("Dashboard");

  // Load user data from localStorage once
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData) {
      setUserInfo({
        firstName: storedData.firstname || "",
        lastName: storedData.lastname || "",
        email: storedData.email || "",
        phone: storedData.phone || "",
        address: storedData.address || "",
      });
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle saving settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${baseUrl}update-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userInfo),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server responded with:", text);
        throw new Error("Failed to update user.");
      }

      const data = await res.json();
      console.log("Updated user:", data);

      // Update localStorage and state
      localStorage.setItem("userData", JSON.stringify(data.user));
      setUserInfo({
        firstName: data.user.firstname || "",
        lastName: data.user.lastname || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
      });

      alert("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings. Check console for details.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 text-slate-800">
        <div className="max-w-[1400px] mx-auto p-4 md:p-6">
          {/* Header */}
          <header className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/60?img=12"
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <h1 className="text-lg font-semibold">
                  Welcome Back
                  {userInfo.firstName ? `, ${userInfo.firstName}` : ""}
                </h1>
                <p className="text-sm text-slate-500">
                  Your dashboard overview
                </p>
              </div>
            </div>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1 bg-white border rounded-xl p-4 shadow-sm">
              <nav className="space-y-2">
                {[
                  "Dashboard",
                  "My Orders",
                  "Saved Items",
                  "Account Settings",
                ].map((label) => (
                  <NavItem
                    key={label}
                    label={label}
                    active={activeTab === label}
                    onClick={() => setActiveTab(label)}
                  />
                ))}
              </nav>
            </aside>

            {/* Main Section */}
            <section className="lg:col-span-3 space-y-6">
              {activeTab === "Dashboard" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <div className="bg-white border rounded-xl p-4 shadow-sm text-center">
                    <div className="text-xs text-slate-500">
                      Pending Deliveries
                    </div>
                    <div className="text-2xl font-semibold mt-1">3</div>
                  </div>
                  <div className="bg-white border rounded-xl p-4 shadow-sm text-center">
                    <div className="text-xs text-slate-500">Total Orders</div>
                    <div className="text-2xl font-semibold mt-1">18</div>
                  </div>
                  <div className="bg-white border rounded-xl p-4 shadow-sm text-center">
                    <div className="text-xs text-slate-500">Saved Items</div>
                    <div className="text-2xl font-semibold mt-1">
                      {savedItems.length}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "Saved Items" && (
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <h3 className="text-sm font-medium mb-2">Saved Items</h3>
                  <div className="space-y-2">
                    {savedItems.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={s.img}
                            alt={s.item}
                            className="w-10 h-10 rounded object-cover filter grayscale hover:grayscale-0 transition-all"
                          />
                          <span className="text-sm font-medium">{s.item}</span>
                        </div>
                        <div className="text-sm text-slate-600">{s.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "My Orders" && (
                <div className="bg-white border rounded-xl p-4 shadow-sm overflow-x-auto">
                  <h3 className="text-sm font-medium mb-3">Recent Orders</h3>
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-slate-500">
                        <th className="px-3 py-2">Item</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((r) => (
                        <tr key={r.id} className="border-t">
                          <td className="px-3 py-3 flex items-center gap-3">
                            <img
                              src={r.img}
                              alt={r.item}
                              className="w-10 h-10 rounded object-cover filter grayscale hover:grayscale-0 transition-all"
                            />
                            <span className="font-medium">{r.item}</span>
                          </td>
                          <td className="px-3 py-3">{r.status}</td>
                          <td className="px-3 py-3">{r.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "Account Settings" && (
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <h3 className="text-sm font-medium mb-3">Account Settings</h3>
                  <form className="space-y-4" onSubmit={handleSaveSettings}>
                    {["firstName", "lastName", "email", "phone", "address"].map(
                      (field) => (
                        <div key={field}>
                          <label className="block text-sm font-medium mb-1 capitalize">
                            {field.replace(/([A-Z])/g, " $1")}
                          </label>
                          <input
                            type={field === "email" ? "email" : "text"}
                            name={field}
                            value={userInfo[field]}
                            onChange={handleChange}
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      )
                    )}
                    <button
                      type="submit"
                      className="bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all"
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
        active
          ? "bg-black text-white font-medium"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span className="text-sm">{label}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}
