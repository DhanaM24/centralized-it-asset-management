import { Building2, Pencil } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";

function Organization() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Organization</h1>
            <p className="text-slate-500 text-sm mt-0.5">Company information and settings.</p>
          </div>
          <button className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm px-4 py-2.5 rounded-lg hover:bg-slate-50 transition">
            <Pencil size={15} /> Edit
          </button>
        </div>

        {/* Organization card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-5 mb-8">
            <div className="bg-blue-600 p-5 rounded-2xl">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Employees' Trust Fund Board</h2>
              <p className="text-slate-500 text-sm mt-1">ETFB — Government Institution, Sri Lanka</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Organization Name",  value: "Employees' Trust Fund Board (ETFB)" },
              { label: "Short Name",         value: "ETFB" },
              { label: "Country",            value: "Sri Lanka" },
              { label: "Head Office",        value: "Narahenpita, Colombo" },
              { label: "Total Branches",     value: "20 offices island-wide" },
              { label: "System Admin Email", value: "admin@etfb.lk" },
            ].map((item) => (
              <div key={item.label} className="border border-slate-100 rounded-lg p-4 bg-slate-50">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-slate-700">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Organization;

