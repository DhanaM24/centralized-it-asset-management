import { useEffect, useMemo, useState } from "react";
import { BarChart3, Download, Printer } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { api } from "../../services/api";

function Reports() {
  const [branches, setBranches] = useState([]);
  const [assets, setAssets] = useState([]);
  const [issues, setIssues] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");
        const [branchData, assetData, issueData, repairData] = await Promise.all([
          api.get("/api/branches"),
          api.get("/api/assets"),
          api.get("/api/issues"),
          api.get("/api/repairs"),
        ]);
        setBranches(branchData);
        setAssets(assetData);
        setIssues(issueData);
        setRepairs(repairData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const branchSummary = useMemo(() => {
    return branches.map((b) => {
      const bAssets = assets.filter((a) => a.branch_id === b.branch_id);
      const bIssues = issues.filter((i) => i.branch_id === b.branch_id);
      const bRepairs = repairs.filter((r) => r.branch_id === b.branch_id);
      const repairCost = bRepairs.reduce((sum, r) => sum + Number(r.cost || 0), 0);

      return {
        branch_id: b.branch_id,
        branch_code: b.branch_code,
        branch_name: b.branch_name,
        totalAssets: bAssets.length,
        underRepair: bAssets.filter((a) => a.status === "Under Repair").length,
        openIssues: bIssues.filter((i) => i.status === "Submitted" || i.status === "In Progress").length,
        resolvedIssues: bIssues.filter((i) => i.status === "Resolved" || i.status === "Closed").length,
        repairCost,
      };
    });
  }, [branches, assets, issues, repairs]);

  const totalRepairCost = useMemo(
    () => repairs.reduce((sum, r) => sum + Number(r.cost || 0), 0),
    [repairs]
  );

  const exportCsv = () => {
    const headers = [
      "Branch Code",
      "Branch Name",
      "Total Assets",
      "Under Repair",
      "Open Issues",
      "Resolved Issues",
      "Repair Cost (LKR)",
    ];
    const rows = branchSummary.map((r) => [
      r.branch_code,
      `"${r.branch_name.replaceAll('"', '""')}"`,
      r.totalAssets,
      r.underRepair,
      r.openIssues,
      r.resolvedIssues,
      r.repairCost.toFixed(2),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `it-asset-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Branch-wise asset, issue, and repair cost summary.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              disabled={loading || branchSummary.length === 0}
              className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              <Download size={16} /> Export CSV
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm"
            >
              <Printer size={16} /> Print
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 uppercase">Total Assets</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{assets.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 uppercase">Total Issues</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{issues.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 uppercase">Total Repairs</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{repairs.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 uppercase">Total Repair Cost</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              LKR {totalRepairCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-500" /> Branch Summary
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-400">Generating report...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3">Code</th>
                    <th className="px-5 py-3">Branch</th>
                    <th className="px-5 py-3 text-right">Assets</th>
                    <th className="px-5 py-3 text-right">Under Repair</th>
                    <th className="px-5 py-3 text-right">Open Issues</th>
                    <th className="px-5 py-3 text-right">Resolved</th>
                    <th className="px-5 py-3 text-right">Repair Cost (LKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {branchSummary.map((row) => (
                    <tr key={row.branch_id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-mono text-xs text-slate-500">{row.branch_code}</td>
                      <td className="px-5 py-3 font-medium text-slate-800">{row.branch_name}</td>
                      <td className="px-5 py-3 text-right">{row.totalAssets}</td>
                      <td className="px-5 py-3 text-right text-amber-600 font-medium">{row.underRepair}</td>
                      <td className="px-5 py-3 text-right text-orange-600 font-medium">{row.openIssues}</td>
                      <td className="px-5 py-3 text-right text-green-600 font-medium">{row.resolvedIssues}</td>
                      <td className="px-5 py-3 text-right font-mono text-slate-700">
                        {row.repairCost.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Reports;
