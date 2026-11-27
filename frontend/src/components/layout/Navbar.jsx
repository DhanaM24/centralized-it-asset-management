import { Bell, Search, UserCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const pageTitles = {
  "/":             { title: "Dashboard",        sub: "System overview and statistics" },
  "/users":        { title: "User Management",  sub: "Admin and staff accounts" },
  "/organization": { title: "Organization",     sub: "Company information" },
  "/branches":     { title: "Branches",         sub: "Head Office and branch offices" },
  "/assets":       { title: "Assets",           sub: "Company hardware inventory" },
  "/issues":       { title: "Issue Management", sub: "Hardware issue reports" },
  "/repairs":      { title: "Repairs",          sub: "Inspection and repair records" },
  "/reports":      { title: "Reports",          sub: "Asset and issue reports" },
  "/profile":      { title: "My Profile",       sub: "Account settings" },
  "/notifications":{ title: "Notifications",    sub: "System alerts and updates" },
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const path = location.pathname.startsWith("/issues/")
    ? "/issues"
    : location.pathname;

  const { title, sub } = pageTitles[path] || { title: "IT Asset Management", sub: "" };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 leading-tight">{title}</h2>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 gap-2">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-36"
          />
        </div>

        {/* Notifications bell */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative text-slate-500 hover:text-slate-700 transition"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 hover:opacity-80 transition"
          title="Profile"
        >
          <UserCircle size={32} className="text-blue-600" />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {user?.full_name || "User"}
            </p>
            <p className="text-xs text-slate-400">{user?.role || ""}</p>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
