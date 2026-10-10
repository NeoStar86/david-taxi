import { Navigate, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import LandingApp from "./pages/LandingApp";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingApp />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
