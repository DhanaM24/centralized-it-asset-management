import { useState } from "react";
import { UserCircle, Lock, CheckCircle } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

function UserProfile() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSaving(true);
    try {
      const res = await api.put("/api/auth/password", {
        currentPassword,
        newPassword,
      });
      setSuccess(res.message || "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 text-sm mt-0.5">Account details and password settings.</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <UserCircle size={56} className="text-blue-600 shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-slate-800">{user?.full_name}</h2>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
              <p className="text-xs text-slate-400 uppercase">Role</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">{user?.role}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
              <p className="text-xs text-slate-400 uppercase">Branch</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">
                {user?.branch_name || "Unassigned"}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
              <p className="text-xs text-slate-400 uppercase">Account Status</p>
              <p className="text-sm font-semibold text-green-600 mt-1">
                {user?.is_active ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
              <p className="text-xs text-slate-400 uppercase">Member Since</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
            <Lock size={18} className="text-blue-500" /> Change Password
          </h3>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle size={16} /> {success}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60"
            >
              {saving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default UserProfile;
