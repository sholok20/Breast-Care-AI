import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Building2,
  KeyRound,
  IdCard,
  Calendar,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import API from "../../services/api";

interface LoginPageProps {
  onLogin: (type: "patient" | "hospital" | "admin") => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState<"patient" | "hospital" | "admin">(
    "hospital"
  );
  const [isRegister, setIsRegister] = useState(false);

  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPassword, setPatientPassword] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("Male");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");

  const [hospitalEmail, setHospitalEmail] = useState("");
  const [hospitalPassword, setHospitalPassword] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalPhone, setHospitalPhone] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const saveLoginData = (
    token: string,
    role: "patient" | "hospital" | "admin"
  ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  };

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email: adminEmail,
        password: adminPassword,
      });

      saveLoginData(response.data.access_token, "admin");
      onLogin("admin");
      navigate("/admin-dashboard");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.detail || "Admin login failed");
    }
  };

  const handlePatientLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email: patientEmail,
        password: patientPassword,
      });

      saveLoginData(response.data.access_token, "patient");
      onLogin("patient");
      navigate("/patient-dashboard");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.detail || "Patient login failed");
    }
  };

  const handleHospitalLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email: hospitalEmail,
        password: hospitalPassword,
      });

      saveLoginData(response.data.access_token, "hospital");
      onLogin("hospital");
      navigate("/hospital-dashboard");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.detail || "Hospital login failed");
    }
  };

  const handlePatientRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (nationalId.length !== 14) {
      alert("National ID must be 14 digits");
      return;
    }

    try {
      const response = await API.post("/auth/register/patient", {
        email: patientEmail,
        password: patientPassword,
        name: patientName,
        national_id: nationalId,
        date_of_birth: birthDate,
        gender,
        contact_number: contactNumber,
        address,
      });

      saveLoginData(response.data.access_token, "patient");
      onLogin("patient");
      navigate("/patient-dashboard");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.detail || "Patient registration failed");
    }
  };

  const handleHospitalRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/register/hospital", {
        email: hospitalEmail,
        password: hospitalPassword,
        hospital_name: hospitalName,
        phone: hospitalPhone,
        address: hospitalAddress,
      });

      saveLoginData(response.data.access_token, "hospital");
      onLogin("hospital");
      navigate("/hospital-dashboard");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.detail || "Hospital registration failed");
    }
  };

  const handleDemoPatientLogin = () => {
    setPatientName("Demo Patient");
    setPatientEmail("omar_patient@gmail.com");
    setPatientPassword("123456");
  };

  const switchAccountType = (type: "patient" | "hospital" | "admin") => {
    setLoginType(type);
    if (type === "admin") {
      setIsRegister(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-6">
        <h1 className="text-pink-600 mb-2">Login to BreastCare AI</h1>
        <p className="text-gray-600">Choose your account type to continue</p>
      </div>

      {loginType !== "admin" && (
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`px-6 py-2 rounded-lg transition-all ${
              !isRegister
                ? "bg-pink-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-pink-50"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`px-6 py-2 rounded-lg transition-all ${
              isRegister
                ? "bg-pink-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-pink-50"
            }`}
          >
            Register
          </button>
        </div>
      )}

      <div className="flex justify-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => switchAccountType("hospital")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            loginType === "hospital"
              ? "bg-pink-600 text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-pink-50"
          }`}
        >
          <Building2 className="w-5 h-5" />
          Hospital
        </button>

        <button
          type="button"
          onClick={() => switchAccountType("patient")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            loginType === "patient"
              ? "bg-pink-600 text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-pink-50"
          }`}
        >
          <User className="w-5 h-5" />
          Patient
        </button>

        <button
          type="button"
          onClick={() => switchAccountType("admin")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            loginType === "admin"
              ? "bg-pink-600 text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-pink-50"
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {loginType === "admin" ? (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="w-6 h-6 text-pink-600" />
                <h2 className="text-pink-600">Admin Login</h2>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="admin@test.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <KeyRound className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="123456"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink-600 text-white py-3 rounded-lg"
                >
                  Login as Admin
                </button>
              </form>
            </div>
          ) : loginType === "hospital" ? (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-6 h-6 text-pink-600" />
                <h2 className="text-pink-600">
                  {isRegister ? "Hospital Register" : "Hospital Login"}
                </h2>
              </div>

              <form
                onSubmit={
                  isRegister ? handleHospitalRegister : handleHospitalLogin
                }
                className="space-y-4"
              >
                {isRegister && (
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Hospital Name
                    </label>
                    <div className="relative">
                      <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Alex Medical Center"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 mb-2">
                    Hospital Email
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={hospitalEmail}
                      onChange={(e) => setHospitalEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="hospital@test.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <KeyRound className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={hospitalPassword}
                      onChange={(e) => setHospitalPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="123456"
                      required
                    />
                  </div>
                </div>

                {isRegister && (
                  <>
                    <div>
                      <label className="block text-gray-700 mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={hospitalPhone}
                          onChange={(e) => setHospitalPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="035555555"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        Address
                      </label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={hospitalAddress}
                          onChange={(e) =>
                            setHospitalAddress(e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="Alexandria"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-pink-600 text-white py-3 rounded-lg"
                >
                  {isRegister ? "Register Hospital" : "Login as Hospital"}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <User className="w-6 h-6 text-pink-600" />
                <h2 className="text-pink-600">
                  {isRegister ? "Patient Register" : "Patient Login"}
                </h2>
              </div>

              <form
                onSubmit={isRegister ? handlePatientRegister : handlePatientLogin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter your full name"
                      required={isRegister}
                    />
                  </div>
                </div>

                {isRegister && (
                  <>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        National ID
                      </label>
                      <div className="relative">
                        <IdCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={nationalId}
                          onChange={(e) => setNationalId(e.target.value)}
                          maxLength={14}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="30101011234567"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="patient@test.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <KeyRound className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={patientPassword}
                      onChange={(e) => setPatientPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>

                {isRegister && (
                  <>
                    <div>
                      <label className="block text-gray-700 mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="01000000000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        Address
                      </label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="Alexandria"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-pink-600 text-white py-3 rounded-lg"
                >
                  {isRegister ? "Register Patient" : "Login as Patient"}
                </button>

                {!isRegister && (
                  <button
                    type="button"
                    onClick={handleDemoPatientLogin}
                    className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg"
                  >
                    Auto-fill demo patient email
                  </button>
                )}
              </form>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg p-8">
          <h3 className="text-pink-600 mb-4">
            {loginType === "admin"
              ? "For System Administrators"
              : loginType === "hospital"
              ? "For Medical Facilities"
              : "For Patients"}
          </h3>

          <div className="space-y-4 text-gray-700">
            <p>
              {loginType === "admin"
                ? "As an administrator, you can:"
                : loginType === "hospital"
                ? "As a hospital, you can:"
                : "As a patient, you can:"}
            </p>

            {loginType === "admin" ? (
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-pink-600">•</span>
                  View system logs
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-600">•</span>
                  Manage users
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-600">•</span>
                  Review AI reports
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-600">•</span>
                  Monitor database activity
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span className="text-pink-600">•</span>
                  Upload and manage mammogram images
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-600">•</span>
                  Access AI-powered analysis results
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-600">•</span>
                  View reports and diagnostic support information
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-600">•</span>
                  Use the platform through a secure backend connection
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}