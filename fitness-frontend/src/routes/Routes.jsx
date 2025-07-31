import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegistrationPage";
import DashboardPage from "../pages/DashboardPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import RulesPage from "../pages/RulesPage";
import AuthWrapper from "../components/AuthWrapper";
import RoleWrapper from "../components/RoleWrapper";
import Navbar from "../components/Navbar"; // ✅ Make sure this exists

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<AuthWrapper />}>
        <Route path="/change-password" element={<ChangePasswordPage />} />

        <Route
          element={
            <>
              <Navbar /> {/* ✅ Navbar shown only for role-restricted pages */}
              <RoleWrapper />
            </>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/rules" element={<RulesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
