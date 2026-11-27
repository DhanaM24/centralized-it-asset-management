import { useParams } from "react-router-dom";
import {
  ArrowLeft, ClipboardList, Monitor, Building2,
  User, Clock, Wrench, AlertTriangle, CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";

function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Back + header */}
        <div>
          <button
            onClick={() => navigate("/issues")}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4 transition"
          >
            <ArrowLeft size={16} /> Back to Issues
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Issue Details</h1>
              <p className="text-slate-500 text-sm mt-0.5">Issue ID: <span className="font-mono">{id}</span></p>
            </div>
            <div className="flex gap-2">
              <button className="text-sm border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 transition">
                Edit
              </button>
              <button className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
                Mark Resolved
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main details */}
          <div className="xl:col-span-2 space-y-5">
            {/* Issue info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-5">
                <ClipboardList size={18} className="text-orange-500" /> Issue Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Issue Title",   value: "—", icon: ClipboardList },
                  { label: "Priority",      value: "—", icon: AlertTriangle },
                  { label: "Status",        value: "—", icon: CheckCircle },
                  { label: "Reported Date", value: "—", icon: Clock },
                  { label: "Branch",        value: "—", icon: Building2 },
                  { label: "Reported By",   value: "—", icon: User },
                ].map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="bg-slate-50 rounded-lg p-4">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <Icon size={12} /> {f.label}
                      </p>
                      <p className="text-sm font-medium text-slate-700">{f.value}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Description</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Connect the backend API to load issue details.
                </p>
              </div>
            </div>

            {/* Asset info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-5">
                <Monitor size={18} className="text-green-500" /> Related Asset
              </h2>
              <div className="flex flex-col items-center py-6 text-slate-400">
                <Monitor size={36} className="mb-2 text-slate-200" />
                <p className="text-sm">Asset details will appear here</p>
              </div>
            </div>
          </div>

          {/* Sidebar: Repair history */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-5">
                <Wrench size={18} className="text-blue-500" /> Repair History
              </h2>
              <div className="flex flex-col items-center py-8 text-slate-400">
                <Wrench size={36} className="mb-2 text-slate-200" />
                <p className="text-sm text-center">No repair records yet</p>
              </div>
              <button className="w-full mt-2 border border-dashed border-slate-300 text-slate-500 text-sm py-2.5 rounded-lg hover:bg-slate-50 transition">
                + Schedule Repair
              </button>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-5">
                <Clock size={18} className="text-purple-500" /> Activity Timeline
              </h2>
              <div className="flex flex-col items-center py-6 text-slate-400">
                <Clock size={36} className="mb-2 text-slate-200" />
                <p className="text-sm">Activity will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default IssueDetails;

