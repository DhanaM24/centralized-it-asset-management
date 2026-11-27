import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  GitBranch,
  Monitor,
  ClipboardList,
  Wrench,
  BarChart3,
  Settings,
  LogOut,
  Package,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard",        path: "/",             icon: LayoutDashboard, end: true },
  { name: "User Management",  path: "/users",        icon: Users },
  { name: "Organization",     path: "/organization", icon: Building2 },
  { name: "Branches",         path: "/branches",     icon: GitBranch },
  { name: "Assets",           path: "/assets",       icon: Monitor },
  { name: "Issue Management", path: "/issues",       icon: ClipboardList },
  { name: "Repairs",          path: "/repairs",      icon: Wrench },
  { name: "Reports",          path: "/reports",      icon: BarChart3 },
];

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">IT Asset</h1>
            <p className="text-xs text-slate-400">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="text-xs uppercase text-slate-500 mb-3 px-1 tracking-wider">Main Menu</p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-2.5 mb-1 rounded-lg text-sm transition-all
                 ${isActive
                   ? "bg-blue-600 text-white shadow-sm"
                   : "text-slate-400 hover:bg-slate-800 hover:text-white"
                 }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-slate-800 space-y-1">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all w-full
             ${isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`
          }
        >
          <Settings size={18} />
          Settings / Profile
        </NavLink>

        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-slate-800
                     px-4 py-2.5 rounded-lg text-sm transition-all w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
