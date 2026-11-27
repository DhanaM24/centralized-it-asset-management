import { useEffect, useState } from "react";
import { Wrench, Plus, Pencil } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const REPAIR_STATUSES = ["Scheduled", "In Progress", "Completed", "Cancelled"];

const INITIAL_FORM = {
  issue_id: "",
  assigned_to: "",
  repair_notes: "",
  cost: "",
  scheduled_date: "",
  completed_date: "",
  status: "Scheduled",
};

function Repairs() {
  const { hasRole } = useAuth();
  const canManage = hasRole("Admin", "IT Staff");

  const [repairs, setRepairs] = useState([]);
  const [issues, setIssues] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const loadRepairs = async () => {
    try {
      setLoading(true);
      setError("");
      const query = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const data = await api.get(`/api/repairs${query}`);
      setRepairs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepairs();
  }, [statusFilter]);

  useEffect(() => {
    if (canManage) {
      api.get("/api/issues").then(setIssues).catch(() => {});
      api
        .get("/api/users")
        .then((users) => setTechnicians(users.filter((u) => u.role === "IT Staff" || u.role === "Admin")))
        .catch(() => {});
    }
  }, [canManage]);

  const openCreateModal = () => {
    setEditingRepair(null);
    setForm({
      ...INITIAL_FORM,
      issue_id: issues[0]?.issue_id || "",
    });
    setModalOpen(true);
  };

  const openEditModal = (repair) => {
    setEditingRepair(repair);
    setForm({
      issue_id: repair.issue_id,
      assigned_to: repair.assigned_to || "",
      repair_notes: repair.repair_notes || "",
      cost: repair.cost || "",
      scheduled_date: repair.scheduled_date ? repair.scheduled_date.slice(0, 10) : "",
      completed_date: repair.completed_date ? repair.completed_date.slice(0, 10) : "",
      status: repair.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingRepair) {
        await api.put(`/api/repairs/${editingRepair.repair_id}`, form);
      } else {
        await api.post("/api/repairs", form);
      }
      setModalOpen(false);
      await loadRepairs();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const statusBadge = (s) => {
    if (s === "Completed") return "bg-green-100 text-green-700";
    if (s === "In Progress") return "bg-blue-100 text-blue-700";
    if (s === "Cancelled") return "bg-slate-100 text-slate-500";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Repairs & Inspections</h1>
            <p className="text-slate-500 text-sm mt-0.5">Assign technicians and track hardware repairs.</p>
          </div>
          {canManage && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-sm"
            >
              <Plus size={16} /> Schedule Repair
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
          <span className="text-sm text-slate-600 font-medium">Filter by Repair Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 text-slate-600 text-sm px-3 py-2 rounded-lg bg-white"
          >
            <option value="">All Statuses</option>
            {REPAIR_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Wrench size={18} className="text-blue-500" /> Repair Records ({repairs.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading repairs...</div>
          ) : repairs.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">No repair records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3">Issue / Asset</th>
                    <th className="px-5 py-3">Branch</th>
                    <th className="px-5 py-3">Technician</th>
                    <th className="px-5 py-3">Scheduled</th>
                    <th className="px-5 py-3">Cost</th>
                    <th className="px-5 py-3">Status</th>
                    {canManage && <th className="px-5 py-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {repairs.map((r) => (
                    <tr key={r.repair_id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-800">{r.issue_title}</div>
                        <div className="text-xs text-slate-400">{r.asset_name || "No asset linked"}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{r.branch_name}</td>
                      <td className="px-5 py-3.5 text-slate-600">{r.assigned_to_name || "Unassigned"}</td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {r.scheduled_date ? r.scheduled_date.slice(0, 10) : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{r.cost ? `LKR ${r.cost}` : "—"}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      {canManage && (
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => openEditModal(r)}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                          >
                            <Pencil size={13} /> Update
                          </button>
                        </td>
                      )}
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
        title={editingRepair ? "Update Repair" : "Schedule Repair"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingRepair && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reported Issue</label>
              <select
                required
                value={form.issue_id}
                onChange={(e) => setForm({ ...form, issue_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="">Select issue</option>
                {issues.map((i) => (
                  <option key={i.issue_id} value={i.issue_id}>
                    #{i.issue_id} - {i.issue_title} ({i.branch_name})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assign Technician</label>
              <select
                value={form.assigned_to}
                onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="">Unassigned</option>
                {technicians.map((t) => (
                  <option key={t.user_id} value={t.user_id}>
                    {t.full_name} ({t.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                {REPAIR_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Scheduled Date</label>
              <input
                type="date"
                value={form.scheduled_date}
                onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Completed Date</label>
              <input
                type="date"
                value={form.completed_date}
                onChange={(e) => setForm({ ...form, completed_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cost (LKR)</label>
              <input
                type="number"
                step="0.01"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Inspection / Repair Notes</label>
            <textarea
              rows={3}
              value={form.repair_notes}
              onChange={(e) => setForm({ ...form, repair_notes: e.target.value })}
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
              {saving ? "Saving..." : editingRepair ? "Update Repair" : "Schedule"}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default Repairs;
