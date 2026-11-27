import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, Plus, Search, Eye } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Submitted", "In Progress", "Resolved", "Closed"];

function Issues() {
  const { user, hasRole } = useAuth();
  const canManage = hasRole("Admin", "IT Staff");

  const [issues, setIssues] = useState([]);
  const [assets, setAssets] = useState([]);
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    branch_id: user?.branch_id || "",
    asset_id: "",
    issue_title: "",
    description: "",
    priority: "Medium",
  });
  const [saving, setSaving] = useState(false);

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (priorityFilter) params.set("priority", priorityFilter);
      if (search.trim()) params.set("search", search.trim());

      const query = params.toString() ? `?${params.toString()}` : "";
      const data = await api.get(`/api/issues${query}`);
      setIssues(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    api.get("/api/assets").then(setAssets).catch(() => {});
    if (canManage) {
      api.get("/api/branches").then(setBranches).catch(() => {});
    }
  }, [canManage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadIssues();
  };

  const openReportModal = () => {
    setForm({
      branch_id: user?.branch_id || branches[0]?.branch_id || "",
      asset_id: "",
      issue_title: "",
      description: "",
      priority: "Medium",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/api/issues", {
        ...form,
        asset_id: form.asset_id || null,
      });
      setModalOpen(false);
      await loadIssues();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatus = async (issueId, status) => {
    try {
      setError("");
      await api.patch(`/api/issues/${issueId}/status`, { status });
      await loadIssues();
    } catch (err) {
      setError(err.message);
    }
  };

  const priorityBadge = (p) => {
    if (p === "High") return "bg-red-100 text-red-700";
    if (p === "Medium") return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-600";
  };

  const statusBadge = (s) => {
    if (s === "Resolved" || s === "Closed") return "bg-green-100 text-green-700";
    if (s === "In Progress") return "bg-blue-100 text-blue-700";
    return "bg-orange-100 text-orange-700";
  };

  const branchAssets = assets.filter(
    (a) => !form.branch_id || String(a.branch_id) === String(form.branch_id)
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Issue Management</h1>
            <p className="text-slate-500 text-sm mt-0.5">Report and track branch hardware issues.</p>
          </div>
          <button
            onClick={openReportModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-sm"
          >
            <Plus size={16} /> Report Issue
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSearchSubmit} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 gap-2 flex-1 min-w-48">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search issues by title, asset, or serial..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 text-slate-600 text-sm px-3 py-2 rounded-lg bg-white"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-slate-200 text-slate-600 text-sm px-3 py-2 rounded-lg bg-white"
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-slate-800 text-white rounded-lg hover:bg-slate-700"
          >
            Search
          </button>
        </form>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <ClipboardList size={18} className="text-blue-500" /> Reported Issues ({issues.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading issues...</div>
          ) : issues.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">No issues reported yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3">Issue</th>
                    <th className="px-5 py-3">Branch</th>
                    <th className="px-5 py-3">Asset</th>
                    <th className="px-5 py-3">Priority</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {issues.map((issue) => (
                    <tr key={issue.issue_id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-800">{issue.issue_title}</div>
                        <div className="text-xs text-slate-400">
                          Reported by {issue.reported_by_name || "Unknown"} •{" "}
                          {new Date(issue.reported_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{issue.branch_name}</td>
                      <td className="px-5 py-3.5 text-slate-600">{issue.asset_name || "—"}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityBadge(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {canManage ? (
                          <select
                            value={issue.status}
                            onChange={(e) => handleQuickStatus(issue.issue_id, e.target.value)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer ${statusBadge(issue.status)}`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(issue.status)}`}>
                            {issue.status}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to={`/issues/${issue.issue_id}`}
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                        >
                          <Eye size={13} /> Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        title="Report Hardware Issue"
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {canManage && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
              <select
                required
                value={form.branch_id}
                onChange={(e) => setForm({ ...form, branch_id: e.target.value, asset_id: "" })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="">Select branch</option>
                {branches.map((b) => (
                  <option key={b.branch_id} value={b.branch_id}>
                    {b.branch_name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Affected Asset (optional)
            </label>
            <select
              value={form.asset_id}
              onChange={(e) => setForm({ ...form, asset_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
            >
              <option value="">General / No specific asset</option>
              {branchAssets.map((a) => (
                <option key={a.asset_id} value={a.asset_id}>
                  {a.asset_name} {a.serial_number ? `(${a.serial_number})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Issue Title</label>
            <input
              type="text"
              required
              value={form.issue_title}
              onChange={(e) => setForm({ ...form, issue_title: e.target.value })}
              placeholder="e.g. Printer paper jam / won't power on"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the hardware problem..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60"
            >
              {saving ? "Submitting..." : "Submit Issue"}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default Issues;
