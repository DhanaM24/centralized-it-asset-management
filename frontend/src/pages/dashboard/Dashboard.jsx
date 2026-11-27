import {
  Users,
  Building2,
  Monitor,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Zap,
  Plus,
  FileText,
  Wrench,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import MainLayout from "../../components/layout/MainLayout";

/* ─── Sample data ─────────────────────────────────────────── */

const statistics = [
  {
    title: "Total Users",
    value: "125",
    change: "+8%",
    up: true,
    description: "Registered employees",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
    ring: "ring-blue-200",
  },
  {
    title: "Total Branches",
    value: "20",
    change: "+0",
    up: true,
    description: "Island-wide ETFB offices",
    icon: Building2,
    color: "bg-purple-100 text-purple-600",
    ring: "ring-purple-200",
  },
  {
    title: "Total Assets",
    value: "340",
    change: "+12%",
    up: true,
    description: "Registered hardware",
    icon: Monitor,
    color: "bg-green-100 text-green-600",
    ring: "ring-green-200",
  },
  {
    title: "Open Issues",
    value: "24",
    change: "-3",
    up: false,
    description: "Hardware issues",
    icon: ClipboardList,
    color: "bg-orange-100 text-orange-600",
    ring: "ring-orange-200",
  },
];

const issueTrend = [
  { month: "Jun", submitted: 12, resolved: 9 },
  { month: "Jul", submitted: 18, resolved: 14 },
  { month: "Aug", submitted: 15, resolved: 12 },
  { month: "Sep", submitted: 22, resolved: 18 },
  { month: "Oct", submitted: 19, resolved: 16 },
  { month: "Nov", submitted: 24, resolved: 18 },
];

const assetByType = [
  { name: "Desktops", count: 120 },
  { name: "Laptops", count: 95 },
  { name: "Printers", count: 48 },
  { name: "Monitors", count: 60 },
  { name: "Others", count: 17 },
];

const assetStatus = [
  { name: "Active", value: 280, color: "#22c55e" },
  { name: "Under Repair", value: 35, color: "#f59e0b" },
  { name: "Retired", value: 25, color: "#ef4444" },
];

const branchStats = [
  { branch: "Head Office – Narahenpita", district: "Colombo",      assets: 85, issues: 3, status: "Normal"  },
  { branch: "Colombo 1–7",               district: "Colombo",      assets: 54, issues: 5, status: "Warning" },
  { branch: "Colombo 8–15",              district: "Colombo",      assets: 48, issues: 2, status: "Normal"  },
  { branch: "Colombo District",          district: "Colombo",      assets: 41, issues: 4, status: "Normal"  },
  { branch: "Gampaha",                   district: "Gampaha",      assets: 36, issues: 7, status: "Alert"   },
  { branch: "Kalutara",                  district: "Kalutara",     assets: 29, issues: 1, status: "Normal"  },
  { branch: "Galle",                     district: "Galle",        assets: 33, issues: 2, status: "Normal"  },
  { branch: "Matara",                    district: "Matara",       assets: 27, issues: 6, status: "Alert"   },
  { branch: "Hambantota",                district: "Hambantota",   assets: 22, issues: 0, status: "Normal"  },
  { branch: "Kandy",                     district: "Kandy",        assets: 42, issues: 8, status: "Alert"   },
  { branch: "Kurunegala",                district: "Kurunegala",   assets: 31, issues: 3, status: "Normal"  },
  { branch: "Anuradhapura",              district: "Anuradhapura", assets: 28, issues: 1, status: "Normal"  },
  { branch: "Kegalle",                   district: "Kegalle",      assets: 19, issues: 2, status: "Normal"  },
  { branch: "Ratnapura",                 district: "Ratnapura",    assets: 21, issues: 4, status: "Warning" },
  { branch: "Badulla",                   district: "Badulla",      assets: 18, issues: 3, status: "Warning" },
  { branch: "Nuwara Eliya",              district: "Nuwara Eliya", assets: 15, issues: 1, status: "Normal"  },
  { branch: "Jaffna",                    district: "Jaffna",       assets: 24, issues: 5, status: "Warning" },
  { branch: "Vavuniya",                  district: "Vavuniya",     assets: 16, issues: 2, status: "Normal"  },
  { branch: "Trincomalee",               district: "Trincomalee",  assets: 20, issues: 3, status: "Normal"  },
  { branch: "Ampara",                    district: "Ampara",       assets: 17, issues: 2, status: "Normal"  },
];

const recentIssues = [
  {
    id: "ISS-024",
    branch: "Kandy Branch",
    asset: "Dell Desktop",
    issue: "Computer not starting",
    priority: "High",
    status: "Submitted",
    date: "2026-11-27",
  },
  {
    id: "ISS-023",
    branch: "Galle Branch",
    asset: "HP Printer",
    issue: "Printer paper jam",
    priority: "Medium",
    status: "In Progress",
    date: "2026-11-26",
  },
  {
    id: "ISS-022",
    branch: "Negombo Branch",
    asset: "Lenovo Laptop",
    issue: "Battery draining fast",
    priority: "Low",
    status: "Resolved",
    date: "2026-11-25",
  },
  {
    id: "ISS-021",
    branch: "Matara Branch",
    asset: "Cisco Switch",
    issue: "Network connectivity issue",
    priority: "High",
    status: "In Progress",
    date: "2026-11-25",
  },
  {
    id: "ISS-020",
    branch: "Head Office",
    asset: "HP Monitor",
    issue: "Screen flickering",
    priority: "Medium",
    status: "Submitted",
    date: "2026-11-24",
  },
];

const quickActions = [
  {
    label: "Report Issue",
    icon: Plus,
    color: "bg-blue-600 hover:bg-blue-700",
    desc: "Log a new hardware issue",
  },
  {
    label: "Add Asset",
    icon: Monitor,
    color: "bg-green-600 hover:bg-green-700",
    desc: "Register new hardware",
  },
  {
    label: "New Report",
    icon: FileText,
    color: "bg-purple-600 hover:bg-purple-700",
    desc: "Generate asset report",
  },
  {
    label: "Schedule Repair",
    icon: Wrench,
    color: "bg-orange-500 hover:bg-orange-600",
    desc: "Book a repair slot",
  },
];

/* ─── Helper badge components ─────────────────────────────── */

const priorityBadge = (priority) => {
  const cls =
    priority === "High"
      ? "bg-red-100 text-red-700"
      : priority === "Medium"
      ? "bg-orange-100 text-orange-700"
      : "bg-green-100 text-green-700";
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      {priority}
    </span>
  );
};

const statusBadge = (status) => {
  const cls =
    status === "Resolved"
      ? "bg-green-100 text-green-700"
      : status === "In Progress"
      ? "bg-blue-100 text-blue-700"
      : "bg-orange-100 text-orange-700";
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs ${cls}`}>{status}</span>
  );
};

const branchStatusBadge = (status) => {
  const cls =
    status === "Normal"
      ? "bg-green-100 text-green-700"
      : status === "Warning"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
};

/* ─── Custom tooltip for recharts ─────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ─── Dashboard ───────────────────────────────────────────── */
function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">

        {/* Page heading */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Monitor your company's IT assets and hardware issues.
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            Last updated: Nov 27, 2026
          </span>
        </div>

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statistics.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm ring-1 ${item.ring}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      {item.title}
                    </p>
                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                      {item.value}
                    </h2>
                    <div className="flex items-center gap-1 mt-1.5">
                      {item.up ? (
                        <ArrowUpRight size={14} className="text-green-500" />
                      ) : (
                        <ArrowDownRight size={14} className="text-red-400" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          item.up ? "text-green-500" : "text-red-400"
                        }`}
                      >
                        {item.change} this month
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${item.color}`}>
                    <Icon size={22} />
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* ── Issue summary mini-cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Clock className="text-orange-500" size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Pending</p>
              <h2 className="text-2xl font-bold text-slate-800">12</h2>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertTriangle className="text-red-500" size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">High Priority</p>
              <h2 className="text-2xl font-bold text-slate-800">05</h2>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="text-green-500" size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Resolved</p>
              <h2 className="text-2xl font-bold text-slate-800">18</h2>
            </div>
          </div>
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Area chart – Issue trend */}
          <div className="xl:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-500" />
                  Issue Trend
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Submitted vs Resolved — last 6 months</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={issueTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gSubmitted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="submitted" name="Submitted" stroke="#3b82f6" strokeWidth={2} fill="url(#gSubmitted)" />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={2} fill="url(#gResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart – Asset status */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Zap size={18} className="text-purple-500" />
                Asset Status
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">340 total assets</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={assetStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {assetStatus.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {assetStatus.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-slate-600">{s.name}</span>
                  </div>
                  <span className="font-semibold text-slate-700">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bar chart – Assets by type ── */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Monitor size={18} className="text-green-500" />
              Assets by Type
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution of hardware across all branches</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={assetByType} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Assets" radius={[6, 6, 0, 0]} fill="#6366f1" maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Bottom row: Branch stats + Recent issues + Quick actions ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Branch statistics */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Building2 size={18} className="text-purple-500" />
                  Branch Statistics
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">All 20 ETFB offices island-wide</p>
              </div>
              <span className="text-xs bg-purple-100 text-purple-600 font-semibold px-2.5 py-1 rounded-full">
                20 offices
              </span>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 420 }}>
              {branchStats.map((b, idx) => (
                <div key={b.branch} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-slate-400 font-mono w-5 shrink-0">{idx + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{b.branch}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {b.district} · {b.assets} assets · {b.issues} issues
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 ml-2">
                    {branchStatusBadge(b.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent issues */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <ClipboardList size={18} className="text-orange-500" />
                  Recent Hardware Issues
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Latest reported problems from branches</p>
              </div>
              <button className="text-xs text-blue-600 hover:underline">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Branch</th>
                    <th className="px-5 py-3">Issue</th>
                    <th className="px-5 py-3">Priority</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIssues.map((issue) => (
                    <tr key={issue.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-5 py-3 font-mono text-xs text-slate-500">{issue.id}</td>
                      <td className="px-5 py-3 text-slate-700">{issue.branch}</td>
                      <td className="px-5 py-3 text-slate-600 max-w-[160px] truncate">{issue.issue}</td>
                      <td className="px-5 py-3">{priorityBadge(issue.priority)}</td>
                      <td className="px-5 py-3">{statusBadge(issue.status)}</td>
                      <td className="px-5 py-3 text-xs text-slate-400">{issue.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick actions pinned at bottom of this card */}
            <div className="p-5 border-t border-slate-100">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-3">
                Quick Actions
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.label}
                      className={`${a.color} text-white rounded-lg px-3 py-3 text-xs font-medium
                                  flex flex-col items-center gap-1.5 transition shadow-sm hover:shadow-md`}
                    >
                      <Icon size={18} />
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

export default Dashboard;
