import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Baby as BabyIcon,
  HeartPulse as HeartPulseIcon,
  BookOpen as BookOpenIcon,
  ListTodo as ListTodoIcon,
  Settings2 as Settings2Icon,
} from "lucide-react";
// import { useAuth } from "./context/AuthContext";
import LoadingPage from "./components/common/LoadingPage";

import Login from "./views/Login";
import ForgotPassword from "./views/ForgotPassword";
import Signup from "./views/Signup";

import Home from "./views/Home";

import Child from "./views/Child";
import Health from "./views/Health";
import Notes from "./views/Notes";
import NoteGenre from "./views/NoteGenre";
import Tasks from "./views/Tasks";
import AccountSettings from "./views/AccountSettings";
import FamilySettings from "./views/FamilySettings";
import FamilySettingsDetail from "./views/FamilySettingsDetail";
import NotificationSettings from "./views/NotificationSettings";
import NoteSettings from "./views/NoteSettings";
import Terms from "./views/Terms";
import Privacy from "./views/Privacy";
import FAQ from "./views/FAQ";
import AdminDashboard from "./views/admin/Dashboard";
import Settings from "./views/Settings";
import GrowthRecord from "./views/GrowthRecord";
import DevelopmentRecord from "./views/DevelopmentRecord";
import IllnessManagement from "./views/IllnessManagement";
import CheckupRecord from "./views/CheckupRecord";
import VaccinationRecord from "./views/VaccinationRecord";
import MedicationRecord from "./views/MedicationRecord";
import UserDetail from "./views/admin/UserDetail";
import { useAuthStore } from "./lib/auth";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loading, initialize } = useAuthStore();
  // const { user, profile, session, loading } = useAuth();

  console.log(user, "isuser");

  useEffect(() => {
    if (loading) {
      <div>
        <LoadingPage />
      </div>;
    } else if (!profile) {
      console.log("no user");
      navigate("/login");
    }
  }, [profile]);

  // Check if current path is admin route
  const isAdminRoute = location.pathname.startsWith("/admin");
  const loginRoute = location.pathname.startsWith("/login");
  const signupRoute = location.pathname.startsWith("/signup");

  
  // useEffect(()=>{
  //   if (location.pathname === "/") {
  //     navigate("/login");
  //   }
  // }, [location.pathname])

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/home" element={<Home />} />
        <Route path="/child" element={<Child />} />
        <Route path="/child/growth" element={<GrowthRecord />} />
        <Route path="/child/development" element={<DevelopmentRecord />} />
        <Route path="/health" element={<Health />} />
        <Route path="/health/illness" element={<IllnessManagement />} />
        <Route path="/health/checkup" element={<CheckupRecord />} />
        <Route path="/health/vaccination" element={<VaccinationRecord />} />
        <Route path="/health/medication" element={<MedicationRecord />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/:genre" element={<NoteGenre />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/account" element={<AccountSettings />} />
        <Route path="/settings/family" element={<FamilySettings />} />
        <Route
          path="/settings/family/detail"
          element={<FamilySettingsDetail />}
        />
        <Route
          path="/settings/notifications"
          element={<NotificationSettings />}
        />
        <Route path="/settings/notes" element={<NoteSettings />} />
        <Route path="/settings/faq" element={<FAQ />} />
        <Route path="/settings/terms" element={<Terms />} />
        <Route path="/settings/privacy" element={<Privacy />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users/:id" element={<UserDetail />} />
      </Routes>

      {/* Only show footer navigation for non-admin routes */}
      {user && !loginRoute && !signupRoute && !isAdminRoute && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40">
          <div className="flex justify-around items-center h-16 px-2">
            <button
              onClick={() => handleNavigation("/child")}
              className={`nav-link ${
                location.pathname === "/child" ? "active" : ""
              }`}
            >
              <BabyIcon className="w-6 h-6" />
              <span className="text-xs mt-1">子供</span>
            </button>
            <button
              onClick={() => handleNavigation("/health")}
              className={`nav-link ${
                location.pathname === "/health" ? "active" : ""
              }`}
            >
              <HeartPulseIcon className="w-6 h-6" />
              <span className="text-xs mt-1">健康</span>
            </button>
            <button
              onClick={() => handleNavigation("/notes")}
              className={`nav-link ${
                location.pathname === "/notes" ? "active" : ""
              }`}
            >
              <BookOpenIcon className="w-6 h-6" />
              <span className="text-xs mt-1">メモ</span>
            </button>
            <button
              onClick={() => handleNavigation("/tasks")}
              className={`nav-link ${
                location.pathname === "/tasks" ? "active" : ""
              }`}
            >
              <ListTodoIcon className="w-6 h-6" />
              <span className="text-xs mt-1">タスク</span>
            </button>
            <button
              onClick={() => handleNavigation("/settings")}
              className={`nav-link ${
                location.pathname === "/settings" ? "active" : ""
              }`}
            >
              <Settings2Icon className="w-6 h-6" />
              <span className="text-xs mt-1">設定</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;
