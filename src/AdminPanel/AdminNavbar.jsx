import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  Menu,
  X
} from "lucide-react";

const AdminNavbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const linkClasses = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
      isActive(path)
        ? "bg-red-600 text-white shadow"
        : "bg-gray-900 text-red-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <>
      {/* Toggle Button for Mobile */}
      <div className="md:hidden flex justify-between items-center bg-gray-950 p-4 shadow-lg">
        <h2 className="text-xl font-bold text-red-500">Admin Panel</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <nav
        className={`${
          isOpen ? "block" : "hidden"
        } md:block bg-gray-950 text-white p-4 shadow-lg md:min-h-screen transition-all duration-300 md:w-64 w-full`}
      >
        <h2 className="text-2xl font-bold text-red-500 mb-6 text-center hidden md:block">
          Admin Panel
        </h2>
        <div className="flex flex-col space-y-3">
          <Link
            to="/admin-dashboard"
            className={linkClasses("/admin-dashboard")}
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link
            to="/admin/products"
            className={linkClasses("/admin/products")}
            onClick={() => setIsOpen(false)}
          >
            <Package size={20} /> Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className={linkClasses("/admin/orders")}
            onClick={() => setIsOpen(false)}
          >
            <ClipboardList size={20} /> Manage Orders
          </Link>
          <Link
            to="/admin/users"
            className={linkClasses("/admin/users")}
            onClick={() => setIsOpen(false)}
          >
            <Users size={20} /> Manage Users
          </Link>
        </div>
      </nav>
    </>
  );
};

export default AdminNavbar;
