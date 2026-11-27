import { Wrench, Plus, Search, Filter } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";

function Repairs() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Repairs</h1>
            <p className="text-slate-500 text-sm mt-0.5">Inspection and repair records for all branches.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-sm">
            <Plus size={16} /> Schedule Repair
          </button>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Scheduled: 8",    color: "bg-blue-100 text-blue-700" },
            { label: "In Progress: 4",  color: "bg-yellow-100 text-yellow-700" },
            { label: "Completed: 20",   color: "bg-green-100 text-green-700" },
            { label: "Cancelled: 2",    color: "bg-red-100 text-red-700" },
          ].map((c) => (
            <span key={c.label} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${c.color}`}>{c.label}</span>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 gap-2 flex-1 min-w-48">
            <Search size={16} className="text-slate-400" />
            <input placeholder="Search repairs..." className="bg-transparent outline-none text-sm w-full" />
          </div>
          <button className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm px-4 py-2 rounded-lg hover:bg-slate-50 transition">
            <Filter size={15} /> Status
          </button>
        </div>

        {/* Table placeholder */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Wrench size={18} className="text-blue-500" /> Repair Records
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3">Repair ID</th>
                  <th className="px-5 py-3">Issue ID</th>
                  <th className="px-5 py-3">Asset</th>
                  <th className="px-5 py-3">Assigned To</th>
                  <th className="px-5 py-3">Scheduled</th>
                  <th className="px-5 py-3">Cost</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-400">
                    <Wrench size={40} className="mx-auto mb-2 text-slate-200" />
                    <p className="text-sm font-medium">Repair records will appear here</p>
                    <p className="text-xs mt-1">Connect the backend API to load repair data.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Repairs;

