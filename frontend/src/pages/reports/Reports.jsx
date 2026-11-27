import { BarChart3, Download, Calendar } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";

const reportTypes = [
  {
    title: "Asset Inventory Report",
    desc: "Full list of all assets across all branches with status.",
    icon: "📦",
    color: "border-green-200 bg-green-50",
    btn: "bg-green-600 hover:bg-green-700",
  },
  {
    title: "Issue Summary Report",
    desc: "Overview of all hardware issues by branch and priority.",
    icon: "📋",
    color: "border-orange-200 bg-orange-50",
    btn: "bg-orange-500 hover:bg-orange-600",
  },
  {
    title: "Repair Cost Report",
    desc: "Total repair costs per branch and asset type.",
    icon: "🔧",
    color: "border-blue-200 bg-blue-50",
    btn: "bg-blue-600 hover:bg-blue-700",
  },
  {
    title: "Branch Performance Report",
    desc: "Issue resolution rate and asset health per branch.",
    icon: "🏢",
    color: "border-purple-200 bg-purple-50",
    btn: "bg-purple-600 hover:bg-purple-700",
  },
];

function Reports() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
            <p className="text-slate-500 text-sm mt-0.5">Generate and export asset and issue reports.</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm px-4 py-2.5 rounded-lg hover:bg-slate-50 transition">
              <Calendar size={15} /> Date Range
            </button>
          </div>
        </div>

        {/* Report cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {reportTypes.map((r) => (
            <div key={r.title} className={`bg-white rounded-xl border-2 ${r.color} p-6 shadow-sm`}>
              <div className="text-3xl mb-3">{r.icon}</div>
              <h3 className="font-semibold text-slate-800 text-base mb-1">{r.title}</h3>
              <p className="text-slate-500 text-sm mb-5">{r.desc}</p>
              <button className={`flex items-center gap-2 ${r.btn} text-white text-sm font-medium px-4 py-2 rounded-lg transition`}>
                <Download size={15} /> Generate Report
              </button>
            </div>
          ))}
        </div>

        {/* Recent exports */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-500" /> Recent Exports
            </h2>
          </div>
          <div className="flex flex-col items-center py-16 text-slate-400">
            <BarChart3 size={40} className="mb-2 text-slate-200" />
            <p className="text-sm font-medium">No reports generated yet</p>
            <p className="text-xs mt-1">Generated reports will appear here for download.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Reports;

