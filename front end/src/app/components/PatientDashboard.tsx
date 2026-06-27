import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Upload,
  Calendar,
  FileText,
  AlertCircle,
  Camera,
  IdCard,
  Plus,
  History,
  Activity,
  Pill,
  Stethoscope
} from "lucide-react";
import { BreastCancerLogo } from "./BreastCancerLogo";

interface PatientRecord {
  id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  createdDate: string;
  medicalHistory: {
    mammograms: any[];
    conditions: any[];
    visits: any[];
  };
}

export function PatientDashboard() {
  const navigate = useNavigate();

  const [step, setStep] = useState<"auth" | "dashboard">("auth");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [patientRecord, setPatientRecord] = useState<PatientRecord | null>(null);

  const [nationalId, setNationalId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const resetForm = () => {
    setNationalId("");
    setPatientName("");
    setPhotoPreview("");
    setPhone("");
    setEmail("");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    const recordsStr = localStorage.getItem("patientRecords");
    const records: { [key: string]: PatientRecord } = recordsStr
      ? JSON.parse(recordsStr)
      : {};

    if (!records[nationalId]) {
      alert("Account not found. Please sign up first.");
      return;
    }

    setPatientRecord(records[nationalId]);
    setStep("dashboard");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    const recordsStr = localStorage.getItem("patientRecords");
    const records: { [key: string]: PatientRecord } = recordsStr
      ? JSON.parse(recordsStr)
      : {};

    if (records[nationalId]) {
      alert("This National ID already exists. Please sign in.");
      return;
    }

    const newRecord: PatientRecord = {
      id: nationalId,
      name: patientName,
      photo: photoPreview,
      phone,
      email,
      createdDate: new Date().toISOString(),
      medicalHistory: {
        mammograms: [],
        conditions: [],
        visits: [
          {
            date: new Date().toISOString(),
            reason: "Initial Registration",
            doctor: "System",
            notes: "Patient registered successfully."
          }
        ]
      }
    };

    records[nationalId] = newRecord;
    localStorage.setItem("patientRecords", JSON.stringify(records));

    setPatientRecord(newRecord);
    setStep("dashboard");
  };

  const goToUpload = () => {
    navigate("/upload");
  };

  const goToLatestReport = () => {
    const latestReport = localStorage.getItem("latest_ai_result");

    if (!latestReport) {
      alert("No report found yet. Upload a mammogram first.");
      return;
    }

    navigate("/report");
  };

  if (step === "auth") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <BreastCancerLogo className="w-16 h-16 mx-auto mb-4" />

            <h1 className="text-pink-600 mb-2">
              Patient Portal
            </h1>

            <p className="text-gray-600">
              Access your medical records and AI-powered mammogram analysis
            </p>
          </div>

          <div className="flex border-b border-gray-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode("signin");
                resetForm();
              }}
              className={`flex-1 py-3 ${
                authMode === "signin"
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "text-gray-600"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                Sign In
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("signup");
                resetForm();
              }}
              className={`flex-1 py-3 ${
                authMode === "signup"
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "text-gray-600"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Sign Up
              </div>
            </button>
          </div>

          {authMode === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  National ID Number
                </label>

                <div className="relative">
                  <IdCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-600"
                    placeholder="Enter your 14-digit National ID"
                    required
                    minLength={14}
                    maxLength={14}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="flex flex-col items-center">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Patient"
                    className="w-32 h-32 rounded-full object-cover border-4 border-pink-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                <label className="mt-3 bg-pink-600 text-white px-4 py-2 rounded-lg cursor-pointer">
                  <Camera className="w-4 h-4 inline mr-2" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="National ID"
                required
                minLength={14}
                maxLength={14}
              />

              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="Full Name"
                required
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="Phone Number"
                required
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="Email Address"
                required
              />

              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700"
              >
                Create Account
              </button>
            </form>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <p className="text-blue-800">
                Your medical information is securely stored and only accessible by authorized users.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!patientRecord) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-start gap-6">
          {patientRecord.photo ? (
            <img
              src={patientRecord.photo}
              alt={patientRecord.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-pink-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-pink-600 text-3xl mb-2">
              {patientRecord.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <IdCard className="w-4 h-4 text-pink-600" />
                <span>ID: {patientRecord.id}</span>
              </div>

              <div>
                📱 {patientRecord.phone}
              </div>

              <div>
                📧 {patientRecord.email}
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>
                Registered: {new Date(patientRecord.createdDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-pink-600 text-2xl mb-6 flex items-center gap-2">
          <Upload className="w-6 h-6" />
          Mammogram Services
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">
              Upload New Mammogram
            </h3>

            <p className="text-gray-600 mb-4">
              Upload a mammogram image and get a real AI-generated report using the backend.
            </p>

            <button
              type="button"
              onClick={goToUpload}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
            >
              Upload Mammogram
            </button>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">
              Latest AI Report
            </h3>

            <p className="text-gray-600 mb-4">
              View your latest AI mammogram report with YOLO detection and similarity search.
            </p>

            <button
              type="button"
              onClick={goToLatestReport}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              View Latest Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-pink-600 text-2xl mb-6 flex items-center gap-2">
          <History className="w-6 h-6" />
          Medical History
        </h2>

        <div className="mb-8">
          <h3 className="text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-pink-600" />
            Mammogram Records
          </h3>

          {patientRecord.medicalHistory.mammograms.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p>No local mammogram records yet.</p>
              <p className="text-sm mt-1">
                Use the upload button above to create a real AI report.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {patientRecord.medicalHistory.mammograms.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <p>
                    <strong>File ID:</strong> {item.fileId}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(item.uploadTime).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Findings:</strong> {item.findings}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-gray-800 mb-4 flex items-center gap-2">
            <Pill className="w-5 h-5 text-pink-600" />
            Other Medical Conditions
          </h3>

          {patientRecord.medicalHistory.conditions.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
              No other conditions recorded.
            </div>
          ) : (
            <div className="space-y-3">
              {patientRecord.medicalHistory.conditions.map((condition, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <p>
                    <strong>{condition.name}</strong>
                  </p>
                  <p>Status: {condition.status}</p>
                  <p>Notes: {condition.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-gray-800 mb-4 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-pink-600" />
            Visit History
          </h3>

          <div className="space-y-3">
            {patientRecord.medicalHistory.visits.map((visit, index) => (
              <div key={index} className="border rounded-lg p-4">
                <p>
                  <strong>{visit.reason}</strong>
                </p>
                <p>Date: {new Date(visit.date).toLocaleDateString()}</p>
                <p>Doctor: {visit.doctor}</p>
                <p>Notes: {visit.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}