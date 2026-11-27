import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login        from "./pages/auth/Login";
import Dashboard    from "./pages/dashboard/Dashboard";
import Users        from "./pages/users/Users";
import Organization from "./pages/organization/Organization";
import Branches     from "./pages/branches/Branches";
import Assets       from "./pages/assets/Assets";
import Issues       from "./pages/issues/Issues";
import IssueDetails from "./pages/issues/IssueDetails";
import Repairs      from "./pages/repairs/Repairs";
import Reports      from "./pages/reports/Reports";
import UserProfile  from "./pages/profile/UserProfile";
import Notifications from "./pages/notifications/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login"         element={<Login />} />

        {/* Main pages */}
        <Route path="/"              element={<Dashboard />} />
        <Route path="/users"         element={<Users />} />
        <Route path="/organization"  element={<Organization />} />
        <Route path="/branches"      element={<Branches />} />
        <Route path="/assets"        element={<Assets />} />
        <Route path="/issues"        element={<Issues />} />
        <Route path="/issues/:id"    element={<IssueDetails />} />
        <Route path="/repairs"       element={<Repairs />} />
        <Route path="/reports"       element={<Reports />} />

        {/* Additional pages */}
        <Route path="/profile"       element={<UserProfile />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Fallback */}
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
