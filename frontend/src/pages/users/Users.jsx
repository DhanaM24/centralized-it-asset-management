import { Users as UsersIcon, Plus, Search, Filter } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";

function Users() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage admin and staff accounts.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-sm">
            <Plus size={16} /> Add User
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 gap-2 flex-1 min-w-48">
            <Search size={16} className="text-slate-400" />
            <input placeholder="Search users..." className="bg-transparent outline-none text-sm w-full" />
          </div>
          <button className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm px-4 py-2 rounded-lg hover:bg-slate-50 transition">
            <Filter size={15} /> Filter by Role
          </button>
        </div>

        {/* Table placeholder */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <UsersIcon size={18} className="text-blue-500" /> All Users
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <UsersIcon size={48} className="mb-3 text-slate-200" />
            <p className="text-sm font-medium">User list will appear here</p>
            <p className="text-xs mt-1">Connect the backend API to load users.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Users;

