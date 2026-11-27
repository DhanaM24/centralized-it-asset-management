import {
  Users,
  Building2,
  Monitor,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";

const statistics = [
  {
    title: "Total Users",
    value: "125",
    description: "Registered employees",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Total Branches",
    value: "08",
    description: "Company locations",
    icon: Building2,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Total Assets",
    value: "340",
    description: "Registered hardware",
    icon: Monitor,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Reported Issues",
    value: "24",
    description: "Hardware issues",
    icon: ClipboardList,
    color: "bg-orange-100 text-orange-600",
  },
];

const issues = [
  {
    id: "ISS-001",
    branch: "Kandy Branch",
    asset: "Dell Desktop",
    issue: "Computer not starting",
    priority: "High",
    status: "Submitted",
  },
  {
    id: "ISS-002",
    branch: "Galle Branch",
    asset: "HP Printer",
    issue: "Printer paper jam",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: "ISS-003",
    branch: "Negombo Branch",
    asset: "Lenovo Laptop",
    issue: "Battery problem",
    priority: "Low",
    status: "Resolved",
  },
];

function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Overview
          </h1>
          <p className="text-slate-500 mt-1">
            Monitor your company's IT assets and hardware issues.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statistics.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-500">
                      {item.title}
                    </p>

                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                      {item.value}
                    </h2>
                  </div>

                  <div className={`p-3 rounded-xl ${item.color}`}>
                    <Icon size={25} />
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-4">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Issue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <Clock className="text-orange-500" />
              <span className="text-slate-600">Pending Issues</span>
            </div>
            <h2 className="text-2xl font-bold mt-3">12</h2>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-500" />
              <span className="text-slate-600">High Priority</span>
            </div>
            <h2 className="text-2xl font-bold mt-3">05</h2>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-500" />
              <span className="text-slate-600">Resolved Issues</span>
            </div>
            <h2 className="text-2xl font-bold mt-3">18</h2>
          </div>

        </div>

        {/* Recent Issues */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">

          <div className="p-5 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              Recent Hardware Issues
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Latest reported hardware problems from branches.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4">Issue ID</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4">Asset</th>
                  <th className="p-4">Issue</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {issues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium">{issue.id}</td>
                    <td className="p-4">{issue.branch}</td>
                    <td className="p-4">{issue.asset}</td>
                    <td className="p-4">{issue.issue}</td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        issue.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : issue.priority === "Medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {issue.priority}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        issue.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : issue.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {issue.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Dashboard;

