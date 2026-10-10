import { useState } from "react";
import AdminDashboard from "../admin/AdminDashboard";
import AdminLogin from "../admin/AdminLogin";
import { isAdminAuthenticated } from "../admin/auth";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(() => isAdminAuthenticated());

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard />;
}
