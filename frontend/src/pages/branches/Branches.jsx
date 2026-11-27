import { GitBranch, Plus, Search, Filter, MapPin } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";

const branches = [
  { no: 1,  name: "Head Office – Narahenpita", code: "ETFB-HO",  district: "Colombo",      type: "Head Office" },
  { no: 2,  name: "Colombo 1–7",               code: "ETFB-C17", district: "Colombo",      type: "Branch" },
  { no: 3,  name: "Colombo 8–15",              code: "ETFB-C815",district: "Colombo",      type: "Branch" },
  { no: 4,  name: "Colombo District",          code: "ETFB-CDO", district: "Colombo",      type: "Branch" },
  { no: 5,  name: "Gampaha",                   code: "ETFB-GAM", district: "Gampaha",      type: "Branch" },
  { no: 6,  name: "Kalutara",                  code: "ETFB-KAL", district: "Kalutara",     type: "Branch" },
  { no: 7,  name: "Galle",                     code: "ETFB-GAL", district: "Galle",        type: "Branch" },
  { no: 8,  name: "Matara",                    code: "ETFB-MAT", district: "Matara",       type: "Branch" },
  { no: 9,  name: "Hambantota",                code: "ETFB-HAM", district: "Hambantota",   type: "Branch" },
  { no: 10, name: "Kandy",                     code: "ETFB-KAN", district: "Kandy",        type: "Branch" },
  { no: 11, name: "Kurunegala",                code: "ETFB-KUR", district: "Kurunegala",   type: "Branch" },
  { no: 12, name: "Anuradhapura",              code: "ETFB-ANU", district: "Anuradhapura", type: "Branch" },
  { no: 13, name: "Kegalle",                   code: "ETFB-KEG", district: "Kegalle",      type: "Branch" },
  { no: 14, name: "Ratnapura",                 code: "ETFB-RAT", district: "Ratnapura",    type: "Branch" },
  { no: 15, name: "Badulla",                   code: "ETFB-BAD", district: "Badulla",      type: "Branch" },
  { no: 16, name: "Nuwara Eliya",              code: "ETFB-NUW", district: "Nuwara Eliya", type: "Branch" },
  { no: 17, name: "Jaffna",                    code: "ETFB-JAF", district: "Jaffna",       type: "Branch" },
  { no: 18, name: "Vavuniya",                  code: "ETFB-VAV", district: "Vavuniya",     type: "Branch" },
  { no: 19, name: "Trincomalee",               code: "ETFB-TRI", district: "Trincomalee",  type: "Branch" },
  { no: 20, name: "Ampara",                    code: "ETFB-AMP", district: "Ampara",       type: "Branch" },
];

function Branches() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Branches</h1>
            <p className="text-slate-500 text-sm mt-0.5">All 20 ETFB offices across Sri Lanka.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-sm">
            <Plus size={16} /> Add Branch
          </button>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-3">
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">Total: 20 offices</span>
          <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full">1 Head Office</span>
          <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full">19 Branch Offices</span>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 gap-2 flex-1 min-w-48">
            <Search size={16} className="text-slate-400" />
            <input placeholder="Search branch or district..." className="bg-transparent outline-none text-sm w-full" />
          </div>
          <button className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm px-4 py-2 rounded-lg hover:bg-slate-50 transition">
            <Filter size={15} /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3">No.</th>
                <th className="px-5 py-3">Branch / Office</th>
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">District</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => (
                <tr key={b.code} className="border-t border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-5 py-3 text-slate-400 font-mono text-xs">{String(b.no).padStart(2, "0")}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <GitBranch size={15} className={b.type === "Head Office" ? "text-blue-500" : "text-slate-400"} />
                      <span className="font-medium text-slate-700">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{b.code}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin size={13} className="text-slate-400" />{b.district}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      b.type === "Head Office"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {b.type}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button className="text-xs text-blue-600 hover:underline mr-3">Edit</button>
                    <button className="text-xs text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}

export default Branches;

