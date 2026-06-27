import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { UploadPage } from "./components/UploadPage";
import { ReportPage } from "./components/ReportPage";
import { HospitalDashboard } from "./components/HospitalDashboard";
import { PatientDashboard } from "./components/PatientDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { Navigation } from "./components/Navigation";

type UserType = "patient" | "hospital" | "admin";

export default function App() {
  const savedToken = localStorage.getItem("token");
  const savedRole = localStorage.getItem("role") as UserType | null;

  const [isAuthenticated, setIsAuthenticated] = useState(!!savedToken);
  const [userType, setUserType] = useState<UserType | null>(savedRole);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleLogin = (type: UserType) => {
    setIsAuthenticated(true);
    setUserType(type);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("latest_ai_result");

    setIsAuthenticated(false);
    setUserType(null);
    setUploadedImage(null);
  };

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
  };

  const getDashboardRoute = () => {
    if (userType === "admin") return "/admin-dashboard";
    if (userType === "hospital") return "/hospital-dashboard";
    return "/patient-dashboard";
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <Navigation
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          userType={userType}
        />

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to={getDashboardRoute()} />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/patient-dashboard"
            element={
              isAuthenticated && userType === "patient" ? (
                <PatientDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/hospital-dashboard"
            element={
              isAuthenticated && userType === "hospital" ? (
                <HospitalDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              isAuthenticated && userType === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/upload"
            element={
              isAuthenticated && userType !== "admin" ? (
                <UploadPage onImageUpload={handleImageUpload} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/report"
            element={
              isAuthenticated ? (
                <ReportPage
                  imageUrl={uploadedImage || ""}
                  userType={userType}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}