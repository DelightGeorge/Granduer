import React from 'react'
import { motion } from 'framer-motion'
import Layout from '../Shared/Layout'

// UserDash.jsx — User-focused Ecommerce Dashboard (NOT Admin)

export default function UserDash() {
  const recentOrders = [
    { id: 'ORD-20251', item: 'Nike Air Max', status: 'Delivered', amount: '₦45,000' },
    { id: 'ORD-20250', item: 'Samsung A14', status: 'Processing', amount: '₦120,000' },
    { id: 'ORD-20249', item: 'Laptop Bag', status: 'Pending', amount: '₦9,500' },
    { id: 'ORD-20248', item: 'PS5 Controller', status: 'Refunded', amount: '₦28,000' }
  ]

  const savedItems = [
    { id: 1, item: 'Black Hoodie', price: '₦15,000' },
    { id: 2, item: 'Wireless Earbuds', price: '₦19,500' }
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 text-slate-800">
        <div className="max-w-[1400px] mx-auto p-4 md:p-6">

          {/* Header with Profile Picture */}
          <header className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/60?img=12"
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <h1 className="text-lg font-semibold">Welcome Back</h1>
                <p className="text-sm text-slate-500">Your dashboard overview</p>
              </div>
            </div>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Sidebar */}
            <aside className="lg:col-span-1 bg-white border rounded-xl p-4 shadow-sm">
              <nav className="space-y-2">
                <NavItem label="Dashboard" active />
                <NavItem label="My Orders" />
                <NavItem label="Saved Items" />
                <NavItem label="Addresses" />
                <NavItem label="Account Settings" />
              </nav>
            </aside>

            {/* Main Section */}
            <section className="lg:col-span-3 space-y-6">

              {/* Quick Stats */}
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <div className="text-xs text-slate-500">Pending Deliveries</div>
                  <div className="text-2xl font-semibold mt-1">3</div>
                </div>

                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <div className="text-xs text-slate-500">Total Orders</div>
                  <div className="text-2xl font-semibold mt-1">18</div>
                </div>

                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <div className="text-xs text-slate-500">Saved Items</div>
                  <div className="text-2xl font-semibold mt-1">{savedItems.length}</div>
                </div>
              </motion.div>

              {/* Saved Items */}
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-medium mb-2">Saved Items</h3>
                <div className="space-y-2">
                  {savedItems.map(s => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="text-sm font-medium">{s.item}</div>
                      <div className="text-sm text-slate-600">{s.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white border rounded-xl p-4 shadow-sm overflow-x-auto">
                <h3 className="text-sm font-medium mb-3">Recent Orders</h3>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="px-3 py-2">Order ID</th>
                      <th className="px-3 py-2">Item</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(r => (
                      <tr key={r.id} className="border-t">
                        <td className="px-3 py-3 font-medium">{r.id}</td>
                        <td className="px-3 py-3">{r.item}</td>
                        <td className="px-3 py-3">{r.status}</td>
                        <td className="px-3 py-3">{r.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </section>
          </main>
        </div>
      </div>
    </Layout>
  )
}

function NavItem({ label, active }) {
  return (
    <button className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${active ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
      <span className="text-sm">{label}</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}
