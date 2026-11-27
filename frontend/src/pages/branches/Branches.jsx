import { useEffect, useState } from "react";
import { GitBranch, Plus, Search, Pencil, Trash2 } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const INITIAL_FORM = {
  organization_id: "",
  branch_name: "",
  branch_code: "",
  branch_type: "Branch",
  address: "",
  contact_number: "",
};

function Branches() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("Admin");

  const [branches, setBranches] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [branchData, orgData] = await Promise.all([
        api.get("/api/branches"),
        api.get("/api/organizations"),
      ]);
      setBranches(branchData);
      setOrganizations(orgData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = branches.filter((b) => {
    const matchesSearch =
      !search.trim() ||
      b.branch_name.toLowerCase().includes(search.toLowerCase()) ||
      b.branch_code.toLowerCase().includes(search.toLowerCase()) ||
      (b.district || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" || b.branch_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const openCreateModal = () => {
    setEditingBranch(null);
    setForm({
      ...INITIAL_FORM,
      organization_id: organizations[0]?.organization_id || "",
    });
    setModalOpen(true);
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setForm({
      organization_id: branch.organization_id,
      branch_name: branch.branch_name,
      branch_code: branch.branch_code,
      branch_type: branch.branch_type,
      address: branch.address || "",
      contact_number: branch.contact_number || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingBranch) {
        await api.put(`/api/branches/${editingBranch.branch_id}`, form);
      } else {
        await api.post("/api/branches", form);
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (branch) => {
    if (!window.confirm(`Delete branch "${branch.branch_name}"?`)) return;
    try {
      setError("");
      await api.delete(`/api/branches/${branch.branch_id}`);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Branches</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage Head Office and branch locations.</p>
          </div>
          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-sm"
            >
              <Plus size={16} /> Add Branch
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 gap-2 flex-1 min-w-48">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search branches by name, code, or district..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-slate-200 text-slate-600 text-sm px-3 py-2 rounded-lg bg-white"
          >
            <option value="ALL">All Types</option>
            <option value="Head Office">Head Office</option>
            <option value="Branch">Branch</option>
          </select>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <GitBranch size={18} className="text-blue-500" /> All Branches ({filtered.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading branches...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">No branches found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3">Code</th>
                    <th className="px-5 py-3">Branch Name</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">District</th>
                    <th className="px-5 py-3">Contact</th>
                    {isAdmin && <th className="px-5 py-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((b) => (
                    <tr key={b.branch_id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-600">
                        {b.branch_code}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">{b.branch_name}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            b.branch_type === "Head Office"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {b.branch_type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{b.district || "—"}</td>
                      <td className="px-5 py-3.5 text-slate-600">{b.contact_number || "—"}</td>
                      {isAdmin && (
                        <td className="px-5 py-3.5 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(b)}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(b)}
                            className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline"
                          >
                            <Trash2 size={13} /> Delete
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
        title={editingBranch ? "Edit Branch" : "Add Branch"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Organization</label>
            <select
              required
              value={form.organization_id}
              onChange={(e) => setForm({ ...form, organization_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
            >
              <option value="">Select organization</option>
              {organizations.map((o) => (
                <option key={o.organization_id} value={o.organization_id}>
                  {o.organization_name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Branch Name</label>
              <input
                type="text"
                required
                value={form.branch_name}
                onChange={(e) => setForm({ ...form, branch_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Branch Code</label>
              <input
                type="text"
                required
                value={form.branch_code}
                onChange={(e) => setForm({ ...form, branch_code: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Branch Type</label>
              <select
                value={form.branch_type}
                onChange={(e) => setForm({ ...form, branch_type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="Head Office">Head Office</option>
                <option value="Branch">Branch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
              <input
                type="text"
                value={form.contact_number}
                onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
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
              {saving ? "Saving..." : editingBranch ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default Branches;
