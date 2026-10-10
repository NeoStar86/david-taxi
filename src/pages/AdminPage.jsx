import { useState } from "react";
import AdminDashboard from "../admin/AdminDashboard";
import AdminLogin from "../admin/AdminLogin";
import { isAdminAuthenticated } from "../admin/auth";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminAuthenticated());

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <AdminDashboard
      onLogout={() => {
        setIsAuthenticated(false);
      }}
    />
  );
}
