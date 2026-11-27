import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, AlertTriangle, Clock, Wrench } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { api } from "../../services/api";

function Notifications() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        setError("");
        const [issueData, repairData] = await Promise.all([
          api.get("/api/issues"),
          api.get("/api/repairs"),
        ]);
        setIssues(issueData);
        setRepairs(repairData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  const alerts = useMemo(() => {
    const items = [];

    for (const issue of issues) {
      if (issue.status === "Submitted" || (issue.priority === "High" && issue.status !== "Closed" && issue.status !== "Resolved")) {
        items.push({
          id: `issue-${issue.issue_id}`,
          type: issue.priority === "High" ? "high" : "submitted",
          title: `${issue.priority === "High" ? "High Priority Issue" : "New Issue Submitted"}: ${issue.issue_title}`,
          subtitle: `${issue.branch_name}${issue.asset_name ? ` • ${issue.asset_name}` : ""}`,
          date: issue.reported_at,
          path: `/issues/${issue.issue_id}`,
        });
      }
    }

    for (const repair of repairs) {
      if (repair.status === "Scheduled" || repair.status === "In Progress") {
        items.push({
          id: `repair-${repair.repair_id}`,
          type: "repair",
          title: `Repair ${repair.status}: ${repair.issue_title}`,
          subtitle: `${repair.branch_name} • Technician: ${repair.assigned_to_name || "Unassigned"}`,
          date: repair.created_at,
          path: "/repairs",
        });
      }
    }

    return items.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [issues, repairs]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Active alerts for pending issues and ongoing repairs.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Bell size={18} className="text-blue-500" /> Active Alerts ({alerts.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">
              All caught up — no pending alerts.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {alerts.map((alert) => {
                const Icon =
                  alert.type === "high"
                    ? AlertTriangle
                    : alert.type === "repair"
                    ? Wrench
                    : Clock;
                const iconCls =
                  alert.type === "high"
                    ? "bg-red-100 text-red-600"
                    : alert.type === "repair"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-orange-100 text-orange-600";

                return (
                  <button
                    key={alert.id}
                    onClick={() => navigate(alert.path)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${iconCls}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{alert.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">
                      {alert.date ? new Date(alert.date).toLocaleDateString() : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Notifications;
