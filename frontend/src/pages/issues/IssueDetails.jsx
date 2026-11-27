import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Wrench, ClipboardList } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { api } from "../../services/api";

function IssueDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const [issueData, repairData] = await Promise.all([
          api.get(`/api/issues/${id}`),
          api.get(`/api/repairs?issue_id=${id}`),
        ]);
        setIssue(issueData);
        setRepairs(repairData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <Link
          to="/issues"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} /> Back to Issues
        </Link>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-sm text-slate-400">
            Loading issue details...
          </div>
        ) : issue ? (
          <>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                    <ClipboardList size={22} />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-800">{issue.issue_title}</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Issue #{issue.issue_id} • Reported {new Date(issue.reported_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    {issue.priority} Priority
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {issue.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase">Branch</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">{issue.branch_name}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase">Asset</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">
                    {issue.asset_name || "General / Unspecified"}
                    {issue.serial_number ? ` (${issue.serial_number})` : ""}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase">Reported By</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">
                    {issue.reported_by_name || "—"}
                  </p>
                </div>
              </div>

              {issue.description && (
                <div>
                  <p className="text-xs text-slate-400 uppercase mb-1">Description</p>
                  <p className="text-sm text-slate-700 whitespace-pre-line">{issue.description}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Wrench size={18} className="text-blue-500" /> Inspection & Repair History ({repairs.length})
                </h2>
              </div>
              {repairs.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-400">
                  No repairs scheduled or recorded for this issue yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {repairs.map((r) => (
                    <div key={r.repair_id} className="p-5 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Technician: {r.assigned_to_name || "Unassigned"}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">{r.repair_notes || "No notes"}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Scheduled: {r.scheduled_date ? r.scheduled_date.slice(0, 10) : "—"} •
                          Completed: {r.completed_date ? r.completed_date.slice(0, 10) : "—"} •
                          Cost: {r.cost ? `LKR ${r.cost}` : "—"}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </MainLayout>
  );
}

export default IssueDetails;
