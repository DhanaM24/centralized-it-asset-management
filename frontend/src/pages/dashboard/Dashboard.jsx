import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

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
    status === "Resolved" || status === "Closed"
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

function Dashboard() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canViewAll = hasRole("Admin", "IT Staff");

  const [assets, setAssets] = useState([]);
  const [issues, setIssues] = useState([]);
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const requests = [
          api.get("/api/assets"),
          api.get("/api/issues"),
          canViewAll ? api.get("/api/branches") : Promise.resolve([]),
          canViewAll ? api.get("/api/users") : Promise.resolve([]),
        ];

        const [assetData, issueData, branchData, userData] = await Promise.all(requests);
        if (!cancelled) {
          setAssets(assetData);
          setIssues(issueData);
          setBranches(branchData);
          setUsers(userData);
        }
      } catch {
        // Keep empty arrays on error so dashboard remains usable
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [canViewAll]);

  const openIssuesCount = useMemo(
    () => issues.filter((i) => i.status === "Submitted" || i.status === "In Progress").length,
    [issues]
  );

  const pendingCount = useMemo(
    () => issues.filter((i) => i.status === "Submitted").length,
    [issues]
  );

  const highPriorityCount = useMemo(
    () => issues.filter((i) => i.priority === "High" && i.status !== "Closed" && i.status !== "Resolved").length,
    [issues]
  );

  const resolvedCount = useMemo(
    () => issues.filter((i) => i.status === "Resolved" || i.status === "Closed").length,
    [issues]
  );

  const statistics = [
    {
      title: "Total Users",
      value: canViewAll ? String(users.length) : "—",
      description: "Registered employees",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      ring: "ring-blue-200",
    },
    {
      title: "Total Branches",
      value: canViewAll ? String(branches.length) : "1",
      description: canViewAll ? "Head Office & branches" : "Your assigned branch",
      icon: Building2,
      color: "bg-purple-100 text-purple-600",
      ring: "ring-purple-200",
    },
    {
      title: "Total Assets",
      value: String(assets.length),
      description: "Registered hardware",
      icon: Monitor,
      color: "bg-green-100 text-green-600",
      ring: "ring-green-200",
    },
    {
      title: "Open Issues",
      value: String(openIssuesCount),
      description: "Active hardware issues",
      icon: ClipboardList,
      color: "bg-orange-100 text-orange-600",
      ring: "ring-orange-200",
    },
  ];

  const assetStatus = useMemo(() => {
    const active = assets.filter((a) => a.status === "Active").length;
    const underRepair = assets.filter((a) => a.status === "Under Repair").length;
    const retired = assets.filter((a) => a.status === "Retired").length;
    return [
      { name: "Active", value: active, color: "#22c55e" },
      { name: "Under Repair", value: underRepair, color: "#f59e0b" },
      { name: "Retired", value: retired, color: "#ef4444" },
    ];
  }, [assets]);

  const assetByType = useMemo(() => {
    const counts = {};
    for (const a of assets) {
      const key = a.asset_type || "Other";
      counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [assets]);

  const issueTrend = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let offset = 5; offset >= 0; offset -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("en-US", { month: "short" });
      months.push({ key, month: label, submitted: 0, resolved: 0 });
    }
    for (const issue of issues) {
      if (issue.reported_at) {
        const repKey = issue.reported_at.slice(0, 7);
        const bucket = months.find((m) => m.key === repKey);
        if (bucket) bucket.submitted += 1;
      }
      if (issue.resolved_at) {
        const resKey = issue.resolved_at.slice(0, 7);
        const bucket = months.find((m) => m.key === resKey);
        if (bucket) bucket.resolved += 1;
      }
    }
    return months;
  }, [issues]);

  const branchStats = useMemo(() => {
    return branches.map((b) => {
      const bAssets = assets.filter((a) => a.branch_id === b.branch_id).length;
      const bOpenIssues = issues.filter(
        (i) => i.branch_id === b.branch_id && (i.status === "Submitted" || i.status === "In Progress")
      ).length;
      const status = bOpenIssues >= 5 ? "Alert" : bOpenIssues >= 2 ? "Warning" : "Normal";
      return {
        branch_id: b.branch_id,
        branch: b.branch_name,
        district: b.district || b.branch_code,
        assets: bAssets,
        issues: bOpenIssues,
        status,
      };
    });
  }, [branches, assets, issues]);

  const recentIssues = useMemo(() => issues.slice(0, 5), [issues]);

  const quickActions = [
    {
      label: "Report Issue",
      icon: Plus,
      color: "bg-blue-600 hover:bg-blue-700",
      path: "/issues",
    },
    {
      label: "View Assets",
      icon: Monitor,
      color: "bg-green-600 hover:bg-green-700",
      path: "/assets",
    },
    {
      label: "Repairs",
      icon: Wrench,
      color: "bg-orange-500 hover:bg-orange-600",
      path: "/repairs",
    },
    ...(canViewAll
      ? [
          {
            label: "Reports",
            icon: FileText,
            color: "bg-purple-600 hover:bg-purple-700",
            path: "/reports",
          },
        ]
      : []),
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Monitor your company's IT assets and hardware issues.
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            {loading ? "Syncing..." : "Live data"}
          </span>
        </div>

        {/* Summary cards */}
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
                    <h2 className="text-3xl font-bold text-slate-800 mt-2">{item.value}</h2>
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

        {/* Issue summary mini-cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Clock className="text-orange-500" size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Pending</p>
              <h2 className="text-2xl font-bold text-slate-800">{pendingCount}</h2>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertTriangle className="text-red-500" size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">High Priority</p>
              <h2 className="text-2xl font-bold text-slate-800">{highPriorityCount}</h2>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="text-green-500" size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Resolved</p>
              <h2 className="text-2xl font-bold text-slate-800">{resolvedCount}</h2>
            </div>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
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
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="submitted" name="Submitted" stroke="#3b82f6" strokeWidth={2} fill="url(#gSubmitted)" />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={2} fill="url(#gResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Zap size={18} className="text-purple-500" />
                Asset Status
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{assets.length} total assets</p>
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

        {/* Bar chart – Assets by type */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Monitor size={18} className="text-green-500" />
              Assets by Type
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution of registered hardware</p>
          </div>
          {assetByType.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">No assets registered yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={assetByType} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Assets" radius={[6, 6, 0, 0]} fill="#6366f1" maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bottom row: Branch stats + Recent issues */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {canViewAll && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Building2 size={18} className="text-purple-500" />
                    Branch Statistics
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Head Office & branches</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-600 font-semibold px-2.5 py-1 rounded-full">
                  {branches.length} offices
                </span>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 420 }}>
                {branchStats.map((b, idx) => (
                  <div
                    key={b.branch_id}
                    className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition border-b border-slate-100 last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs text-slate-400 font-mono w-5 shrink-0">{idx + 1}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{b.branch}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {b.district} · {b.assets} assets · {b.issues} open issues
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-2">{branchStatusBadge(b.status)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={`${canViewAll ? "xl:col-span-2" : "xl:col-span-3"} bg-white rounded-xl border border-slate-200 shadow-sm`}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <ClipboardList size={18} className="text-orange-500" />
                  Recent Hardware Issues
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Latest reported problems</p>
              </div>
              <button
                onClick={() => navigate("/issues")}
                className="text-xs text-blue-600 hover:underline"
              >
                View all
              </button>
            </div>
            {recentIssues.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">No issues reported yet.</div>
            ) : (
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
                      <tr
                        key={issue.issue_id}
                        onClick={() => navigate(`/issues/${issue.issue_id}`)}
                        className="border-t border-slate-100 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <td className="px-5 py-3 font-mono text-xs text-slate-500">
                          #{issue.issue_id}
                        </td>
                        <td className="px-5 py-3 text-slate-700">{issue.branch_name}</td>
                        <td className="px-5 py-3 text-slate-600 max-w-[180px] truncate">
                          {issue.issue_title}
                        </td>
                        <td className="px-5 py-3">{priorityBadge(issue.priority)}</td>
                        <td className="px-5 py-3">{statusBadge(issue.status)}</td>
                        <td className="px-5 py-3 text-xs text-slate-400">
                          {issue.reported_at ? issue.reported_at.slice(0, 10) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

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
                      onClick={() => navigate(a.path)}
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
