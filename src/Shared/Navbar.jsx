import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { FaShoppingCart, FaUser } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navlinks = [
    { name: "New Arrivals", id: 3, path: "/newarrivals" },
    { name: "Men", id: 4, path: "/men" },
    { name: "Women", id: 5, path: "/women" },
    { name: "Children", id: 6, path: "/children" },
    { name: "About", id: 1, path: "/about" },
    { name: "Contact", id: 2, path: "/contact" },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-primary text-white">
      <div className="flex justify-between items-center py-5 px-6 lg:px-16 relative">
        {/*  Mobile & Tablet Left: Menu Icon  */}
        <div className="flex lg:hidden items-center gap-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Logo  */}
        <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
          <Link
            to={"/"}
            className="logo rounded-full text-white bg-black p-2 font-bold text-2xl font-serif"
          >
            <i>Granduer</i>
          </Link>
        </div>

        {/* Right: Search + Cart + User (Mobile & Tablet) */}
        <div className="flex lg:hidden items-center gap-2 text-sm">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="border-[1px] border-white bg-black p-[7px] rounded-3xl text-sm"
          >
            <FiSearch />
          </button>
          <NavLink
            to={"/cart"}
            className="border-[1px] border-white bg-black p-[7px] rounded-3xl text-sm"
          >
            <FaShoppingCart />
          </NavLink>
          <NavLink
            to={"/login"} // ✅ New link to login page
            className="border-[1px] border-white bg-black p-[7px] rounded-3xl text-sm"
          >
            <FaUser />
          </NavLink>
        </div>

        {/* Desktop Navlinks */}
        <div className="hidden lg:flex justify-between items-center gap-4">
          {navlinks.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "border-[1px] bg-white text-black rounded-3xl p-[10px] text-sm"
                  : "p-[10px] text-sm hover:bg-white hover:text-black transition ease-in-out duration-300 rounded-3xl"
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* === Desktop Icons === */}
        <div className="hidden lg:flex justify-center items-center gap-2 text-sm">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="border-[1px] border-white bg-black p-[7px] text-sm hover:bg-white hover:text-black transition ease-in-out duration-300 rounded-3xl"
          >
            <FiSearch />
          </button>
          <NavLink
            to={"/cart"}
            className={({ isActive }) =>
              isActive
                ? "border-[1px] bg-white text-black rounded-3xl p-[10px] text-sm"
                : "border-[1px] border-white bg-black p-[7px] text-sm hover:bg-white hover:text-black transition ease-in-out duration-300 rounded-3xl"
            }
          >
            <FaShoppingCart />
          </NavLink>
          <NavLink
            to={"/login"}
            className={({ isActive }) =>
              isActive
                ? "border-[1px] bg-white text-black rounded-3xl p-[10px] text-sm"
                : "border-[1px] border-white bg-black p-[7px] text-sm hover:bg-white hover:text-black transition ease-in-out duration-300 rounded-3xl"
            }
          >
            <FaUser />
          </NavLink>
        </div>
      </div>

      {/* Search Input */}
      {searchOpen && (
        <div className="bg-primary py-3 flex justify-center items-center">
          <div className="flex items-center bg-black border border-gray-600 rounded-3xl overflow-hidden w-[85%] lg:w-[40%]">
            <input
              type="text"
              placeholder="Search..."
              className="flex-grow px-4 py-2 text-white text-sm outline-none bg-black placeholder-gray-300"
            />
            <button className="px-3 text-white">
              <FiSearch />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-primary text-white flex flex-col items-center gap-4 py-4">
          {navlinks.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className="text-sm hover:bg-white hover:text-black transition ease-in-out duration-300 rounded-3xl px-4 py-2"
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;