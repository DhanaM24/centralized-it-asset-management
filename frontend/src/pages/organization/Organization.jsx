import { useEffect, useState } from "react";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Organization() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("Admin");

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [orgName, setOrgName] = useState("");
  const [saving, setSaving] = useState(false);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.get("/api/organizations");
      setOrganizations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  const openCreateModal = () => {
    setEditingOrg(null);
    setOrgName("");
    setModalOpen(true);
  };

  const openEditModal = (org) => {
    setEditingOrg(org);
    setOrgName(org.organization_name);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    setSaving(true);
    setError("");
    try {
      if (editingOrg) {
        await api.put(`/api/organizations/${editingOrg.organization_id}`, {
          organization_name: orgName.trim(),
        });
      } else {
        await api.post("/api/organizations", {
          organization_name: orgName.trim(),
        });
      }
      setModalOpen(false);
      await loadOrganizations();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (org) => {
    if (!window.confirm(`Delete "${org.organization_name}"?`)) return;
    try {
      setError("");
      await api.delete(`/api/organizations/${org.organization_id}`);
      await loadOrganizations();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Organization</h1>
            <p className="text-slate-500 text-sm mt-0.5">Company information and settings.</p>
          </div>
          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-sm"
            >
              <Plus size={16} /> Add Organization
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading organizations...</div>
          ) : organizations.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">No organizations found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {organizations.map((org) => (
                <div
                  key={org.organization_id}
                  className="p-6 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-3.5 rounded-xl">
                      <Building2 size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">{org.organization_name}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        ID: #{org.organization_id} • Created{" "}
                        {org.created_at ? new Date(org.created_at).toLocaleDateString() : "—"}
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(org)}
                        className="flex items-center gap-1.5 border border-slate-200 text-slate-600 text-xs font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(org)}
                        className="flex items-center gap-1.5 border border-red-200 text-red-600 text-xs font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        title={editingOrg ? "Edit Organization" : "Add Organization"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. Employees' Trust Fund Board (ETFB)"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {saving ? "Saving..." : editingOrg ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default Organization;
