import { Bell, CheckCheck, AlertTriangle, Info, CheckCircle, Trash2 } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";

const notifications = [
  {
    id: 1, type: "alert", read: false,
    title: "High Priority Issue Reported",
    message: "Kandy Branch reported a network connectivity issue on Cisco Switch.",
    time: "10 minutes ago",
  },
  {
    id: 2, type: "info", read: false,
    title: "New Asset Registered",
    message: "A new Dell Desktop has been registered at Gampaha Branch.",
    time: "1 hour ago",
  },
  {
    id: 3, type: "success", read: true,
    title: "Issue Resolved",
    message: "Issue ISS-020 (Screen flickering – HP Monitor) has been marked resolved.",
    time: "3 hours ago",
  },
  {
    id: 4, type: "alert", read: true,
    title: "Repair Scheduled",
    message: "Repair for Lenovo Laptop at Negombo Branch scheduled for tomorrow.",
    time: "Yesterday",
  },
  {
    id: 5, type: "info", read: true,
    title: "Monthly Report Ready",
    message: "November 2026 asset inventory report is ready to download.",
    time: "2 days ago",
  },
];

const typeConfig = {
  alert:   { icon: AlertTriangle, bg: "bg-red-100",    text: "text-red-500"   },
  info:    { icon: Info,          bg: "bg-blue-100",   text: "text-blue-500"  },
  success: { icon: CheckCircle,   bg: "bg-green-100",  text: "text-green-500" },
};

function Notifications() {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              Notifications
              {unread > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unread} new
                </span>
              )}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">System alerts and activity updates.</p>
          </div>
          <button className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm px-4 py-2.5 rounded-lg hover:bg-slate-50 transition">
            <CheckCheck size={15} /> Mark all as read
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          {notifications.map((n) => {
            const cfg = typeConfig[n.type];
            const Icon = cfg.icon;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 px-6 py-5 hover:bg-slate-50 transition ${
                  !n.read ? "bg-blue-50/40" : ""
                }`}
              >
                <div className={`${cfg.bg} ${cfg.text} p-2.5 rounded-xl shrink-0 mt-0.5`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1.5">{n.time}</p>
                </div>
                <button className="text-slate-300 hover:text-red-400 transition shrink-0 mt-1">
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center py-20 text-slate-400">
            <Bell size={48} className="mb-3 text-slate-200" />
            <p className="text-sm font-medium">No notifications</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Notifications;

