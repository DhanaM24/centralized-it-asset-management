import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/users/Users";
import Organization from "./pages/organization/Organization";
import Branches from "./pages/branches/Branches";
import Assets from "./pages/assets/Assets";
import Issues from "./pages/issues/Issues";
import IssueDetails from "./pages/issues/IssueDetails";
import Repairs from "./pages/repairs/Repairs";
import Reports from "./pages/reports/Reports";
import UserProfile from "./pages/profile/UserProfile";
import Notifications from "./pages/notifications/Notifications";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          {/* Main pages */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["Admin", "IT Staff"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organization"
            element={
              <ProtectedRoute allowedRoles={["Admin", "IT Staff"]}>
                <Organization />
              </ProtectedRoute>
            }
          />
          <Route
            path="/branches"
            element={
              <ProtectedRoute allowedRoles={["Admin", "IT Staff"]}>
                <Branches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <Assets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/issues"
            element={
              <ProtectedRoute>
                <Issues />
              </ProtectedRoute>
            }
          />
          <Route
            path="/issues/:id"
            element={
              <ProtectedRoute>
                <IssueDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repairs"
            element={
              <ProtectedRoute>
                <Repairs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["Admin", "IT Staff"]}>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Additional pages */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
