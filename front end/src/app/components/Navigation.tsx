import { Link, useLocation } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { BreastCancerLogo } from "./BreastCancerLogo";

interface NavigationProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  userType: "patient" | "hospital" | "admin" | null;
}

export function Navigation({
  isAuthenticated,
  onLogout,
  userType,
}: NavigationProps) {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <BreastCancerLogo className="w-8 h-8" />
            <span className="text-pink-600">BreastCare AI - Egypt</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`transition-colors ${
                location.pathname === "/"
                  ? "text-pink-600"
                  : "text-gray-600 hover:text-pink-600"
              }`}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                {userType === "admin" ? (
                  <Link
                    to="/admin-dashboard"
                    className={`transition-colors ${
                      location.pathname === "/admin-dashboard"
                        ? "text-pink-600"
                        : "text-gray-600 hover:text-pink-600"
                    }`}
                  >
                    Admin Dashboard
                  </Link>
                ) : userType === "hospital" ? (
                  <>
                    <Link
                      to="/hospital-dashboard"
                      className={`transition-colors ${
                        location.pathname === "/hospital-dashboard"
                          ? "text-pink-600"
                          : "text-gray-600 hover:text-pink-600"
                      }`}
                    >
                      Hospital Dashboard
                    </Link>

                    <Link
                      to="/upload"
                      className={`transition-colors ${
                        location.pathname === "/upload"
                          ? "text-pink-600"
                          : "text-gray-600 hover:text-pink-600"
                      }`}
                    >
                      Upload Mammogram
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/patient-dashboard"
                    className={`transition-colors ${
                      location.pathname === "/patient-dashboard"
                        ? "text-pink-600"
                        : "text-gray-600 hover:text-pink-600"
                    }`}
                  >
                    Patient Dashboard
                  </Link>
                )}

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600 capitalize">
                    {userType}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`transition-colors ${
                  location.pathname === "/login"
                    ? "text-pink-600"
                    : "text-gray-600 hover:text-pink-600"
                }`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}