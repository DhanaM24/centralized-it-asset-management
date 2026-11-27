import { useEffect, useState } from "react";
import { Users as UsersIcon, Plus, Search, Pencil, UserX } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const INITIAL_FORM = {
  full_name: "",
  email: "",
  password: "",
  role: "Branch User",
  branch_id: "",
  is_active: true,
};

function Users() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("Admin");

  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [userData, branchData] = await Promise.all([
        api.get("/api/users"),
        api.get("/api/branches"),
      ]);
      setUsers(userData);
      setBranches(branchData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = users.filter((u) => {
    const matchesSearch =
      !search.trim() ||
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.branch_name || "").toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({
      ...INITIAL_FORM,
      branch_id: branches[0]?.branch_id || "",
    });
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      full_name: user.full_name,
      email: user.email,
      password: "",
      role: user.role,
      branch_id: user.branch_id || "",
      is_active: user.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingUser) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await api.put(`/api/users/${editingUser.user_id}`, payload);
      } else {
        await api.post("/api/users", form);
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (user) => {
    if (!window.confirm(`Deactivate user "${user.full_name}"?`)) return;
    try {
      setError("");
      await api.delete(`/api/users/${user.user_id}`);
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
            <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage admin and staff accounts.</p>
          </div>
          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-sm"
            >
              <Plus size={16} /> Add User
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
              placeholder="Search users by name, email, or branch..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-slate-200 text-slate-600 text-sm px-3 py-2 rounded-lg bg-white"
          >
            <option value="ALL">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="IT Staff">IT Staff</option>
            <option value="Branch User">Branch User</option>
          </select>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <UsersIcon size={18} className="text-blue-500" /> All Users ({filtered.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading users...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Branch</th>
                    <th className="px-5 py-3">Status</th>
                    {isAdmin && <th className="px-5 py-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((u) => (
                    <tr key={u.user_id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5 font-medium text-slate-800">{u.full_name}</td>
                      <td className="px-5 py-3.5 text-slate-600">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{u.branch_name || "—"}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            u.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-3.5 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          {u.is_active && (
                            <button
                              onClick={() => handleDeactivate(u)}
                              className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline"
                            >
                              <UserX size={13} /> Deactivate
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
        title={editingUser ? "Edit User" : "Add User"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {editingUser ? "New Password (leave blank to keep current)" : "Password"}
            </label>
            <input
              type="password"
              required={!editingUser}
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="Admin">Admin</option>
                <option value="IT Staff">IT Staff</option>
                <option value="Branch User">Branch User</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
              <select
                value={form.branch_id}
                onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                <option value="">None</option>
                {branches.map((b) => (
                  <option key={b.branch_id} value={b.branch_id}>
                    {b.branch_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {editingUser && (
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              Account is active
            </label>
          )}
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
              {saving ? "Saving..." : editingUser ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default Users;
