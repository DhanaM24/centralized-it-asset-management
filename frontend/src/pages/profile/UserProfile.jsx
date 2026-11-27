import { UserCircle, Camera, Mail, Phone, Building2, Shield } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";

function UserProfile() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 text-sm mt-0.5">View and update your account details.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Avatar card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <UserCircle size={80} className="text-blue-600" />
              <button className="absolute bottom-0 right-0 bg-white border border-slate-200 rounded-full p-1.5 shadow-sm hover:bg-slate-50 transition">
                <Camera size={14} className="text-slate-500" />
              </button>
            </div>
            <h2 className="font-bold text-slate-800 text-lg">Admin User</h2>
            <p className="text-slate-500 text-sm">admin@etfb.lk</p>
            <span className="mt-3 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <Shield size={11} /> Administrator
            </span>
            <div className="w-full mt-6 pt-5 border-t border-slate-100 text-left space-y-2">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-3">Branch</p>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Building2 size={15} className="text-slate-400" />
                Head Office – Narahenpita
              </div>
            </div>
          </div>

          {/* Edit form */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-6">Account Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Full Name",   placeholder: "Admin User",    icon: UserCircle, type: "text" },
                { label: "Email",       placeholder: "admin@etfb.lk", icon: Mail,       type: "email" },
                { label: "Phone",       placeholder: "+94 11 000 0000",icon: Phone,      type: "tel" },
                { label: "Role",        placeholder: "Administrator",  icon: Shield,     type: "text" },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label}>
                    <label className="block text-xs text-slate-500 font-medium mb-1.5 uppercase tracking-wide">
                      {f.label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Icon size={15} />
                      </span>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm
                                   bg-slate-50 text-slate-700 focus:outline-none focus:ring-2
                                   focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Change password */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h3 className="font-semibold text-slate-700 mb-4">Change Password</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {["Current Password", "New Password", "Confirm New Password"].map((lbl) => (
                  <div key={lbl} className={lbl === "Confirm New Password" ? "sm:col-span-2 sm:max-w-sm" : ""}>
                    <label className="block text-xs text-slate-500 font-medium mb-1.5 uppercase tracking-wide">{lbl}</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm
                                 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2
                                 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition shadow-sm">
                Save Changes
              </button>
              <button className="border border-slate-200 text-slate-600 text-sm px-5 py-2.5 rounded-lg hover:bg-slate-50 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default UserProfile;

