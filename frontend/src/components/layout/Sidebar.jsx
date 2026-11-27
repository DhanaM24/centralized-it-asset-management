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
  Package
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "User Management", icon: Users },
  { name: "Organization", icon: Building2 },
  { name: "Branches", icon: GitBranch },
  { name: "Assets", icon: Monitor },
  { name: "Issue Management", icon: ClipboardList },
  { name: "Repairs", icon: Wrench },
  { name: "Reports", icon: BarChart3 },
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Package size={24} />
          </div>

          <div>
            <h1 className="font-bold text-lg">IT Asset</h1>
            <p className="text-xs text-slate-400">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <p className="text-xs uppercase text-slate-500 mb-4">
          Main Menu
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-sm transition
                ${
                  item.name === "Dashboard"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
            >
              <Icon size={19} />
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 text-slate-300 hover:text-white px-4 py-3">
          <Settings size={19} />
          Settings
        </button>

        <button className="flex items-center gap-3 text-red-400 hover:text-red-300 px-4 py-3">
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

