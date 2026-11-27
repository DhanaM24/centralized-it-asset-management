import { useEffect, useState } from "react";
import { Monitor, Plus, Search, Pencil, Trash2 } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ASSET_TYPES = ["Desktop", "Laptop", "Printer", "Monitor", "Switch", "Router", "UPS", "Other"];
const ASSET_STATUSES = ["Active", "Under Repair", "Retired"];

const INITIAL_FORM = {
  branch_id: "",
  asset_name: "",
  asset_type: "Desktop",
  serial_number: "",
  brand: "",
  model: "",
  purchase_date: "",
  warranty_until: "",
  status: "Active",
  notes: "",
};

function Assets() {
  const { hasRole } = useAuth();
  const canManage = hasRole("Admin", "IT Staff");
  const isAdmin = hasRole("Admin");

  const [assets, setAssets] = useState([]);
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (typeFilter) params.set("asset_type", typeFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());

      const query = params.toString() ? `?${params.toString()}` : "";
      const data = await api.get(`/api/assets${query}`);
      setAssets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [typeFilter, statusFilter]);

  useEffect(() => {
    if (canManage) {
      api.get("/api/branches").then(setBranches).catch(() => {});
    }
  }, [canManage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadAssets();
  };

  const openCreateModal = () => {
    setEditingAsset(null);
    setForm({
      ...INITIAL_FORM,
      branch_id: branches[0]?.branch_id || "",
    });
    setModalOpen(true);
  };

  const openEditModal = (asset) => {
    setEditingAsset(asset);
    setForm({
      branch_id: asset.branch_id,
      asset_name: asset.asset_name,
      asset_type: asset.asset_type || "Other",
      serial_number: asset.serial_number || "",
      brand: asset.brand || "",
      model: asset.model || "",
      purchase_date: asset.purchase_date ? asset.purchase_date.slice(0, 10) : "",
      warranty_until: asset.warranty_until ? asset.warranty_until.slice(0, 10) : "",
      status: asset.status || "Active",
      notes: asset.notes || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingAsset) {
        await api.put(`/api/assets/${editingAsset.asset_id}`, form);
      } else {
        await api.post("/api/assets", form);
      }
      setModalOpen(false);
      await loadAssets();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (asset) => {
    if (!window.confirm(`Delete asset "${asset.asset_name}"?`)) return;
    try {
      setError("");
      await api.delete(`/api/assets/${asset.asset_id}`);
      await loadAssets();
    } catch (err) {
      setError(err.message);
    }
  };

  const statusBadge = (status) => {
    if (status === "Active") return "bg-green-100 text-green-700";
    if (status === "Under Repair") return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Asset Management</h1>
            <p className="text-slate-500 text-sm mt-0.5">Company hardware and IT inventory.</p>
          </div>
          {canManage && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-sm"
            >
              <Plus size={16} /> Add Asset
            </button>
          )}
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
              placeholder="Search by name, serial number, brand, or model..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-slate-200 text-slate-600 text-sm px-3 py-2 rounded-lg bg-white"
          >
            <option value="">All Types</option>
            {ASSET_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 text-slate-600 text-sm px-3 py-2 rounded-lg bg-white"
          >
            <option value="">All Statuses</option>
            {ASSET_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
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
              <Monitor size={18} className="text-blue-500" /> All Assets ({assets.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading assets...</div>
          ) : assets.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">No assets found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3">Asset Name</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Serial Number</th>
                    <th className="px-5 py-3">Branch</th>
                    <th className="px-5 py-3">Status</th>
                    {canManage && <th className="px-5 py-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assets.map((a) => (
                    <tr key={a.asset_id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-800">{a.asset_name}</div>
                        {(a.brand || a.model) && (
                          <div className="text-xs text-slate-400">
                            {[a.brand, a.model].filter(Boolean).join(" • ")}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{a.asset_type}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-600">
                        {a.serial_number || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{a.branch_name}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(a.status)}`}>
                          {a.status}
                        </span>
                      </td>
                      {canManage && (
                        <td className="px-5 py-3.5 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(a)}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(a)}
                              className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline"
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          )}
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
        title={editingAsset ? "Edit Asset" : "Add Asset"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name</label>
              <input
                type="text"
                required
                value={form.asset_name}
                onChange={(e) => setForm({ ...form, asset_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
              <select
                required
                value={form.branch_id}
                onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
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
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Asset Type</label>
              <select
                value={form.asset_type}
                onChange={(e) => setForm({ ...form, asset_type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                {ASSET_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
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
                {ASSET_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Serial Number</label>
              <input
                type="text"
                value={form.serial_number}
                onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Date</label>
              <input
                type="date"
                value={form.purchase_date}
                onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Warranty Until</label>
              <input
                type="date"
                value={form.warranty_until}
                onChange={(e) => setForm({ ...form, warranty_until: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
              {saving ? "Saving..." : editingAsset ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default Assets;
