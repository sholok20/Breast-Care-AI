import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Activity,
  Calendar,
  Search,
  History,
  Pill,
  Stethoscope,
  Plus,
  ClipboardList,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { BreastCancerLogo } from "./BreastCancerLogo";

const API_URL = "http://127.0.0.1:8000";

type ProcedureType =
  | "Mammogram"
  | "Ultrasound"
  | "Biopsy"
  | "MRI"
  | "Consultation"
  | "Blood Test"
  | "Other";

const PROCEDURE_OPTIONS: ProcedureType[] = [
  "Mammogram",
  "Ultrasound",
  "Biopsy",
  "MRI",
  "Consultation",
  "Blood Test",
  "Other",
];

interface PatientRecord {
  id: number;
  national_id: string;
  name: string;
  date_of_birth: string;
  gender: string;
  contact_number: string;
  email: string;
  address: string;
  created_at: string;
}

interface Visit {
  id: number;
  patient_id: number;
  visit_date: string;
  doctor_name: string | null;
  notes: string | null;
}

interface Procedure {
  id: number;
  visit_id: number;
  procedure_type: string;
  description: string | null;
  status: string;
}

export function HospitalDashboard() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"choose" | "new" | "existing" | "profile">(
    "choose"
  );

  const [searchId, setSearchId] = useState("");
  const [patientRecord, setPatientRecord] = useState<PatientRecord | null>(
    null
  );

  const [visits, setVisits] = useState<Visit[]>([]);
  const [proceduresByVisit, setProceduresByVisit] = useState<{
    [key: number]: Procedure[];
  }>({});

  const [newPatient, setNewPatient] = useState({
    nationalId: "",
    name: "",
    dateOfBirth: "",
    gender: "Female",
    phone: "",
    email: "",
    address: "",
  });

  const [newVisit, setNewVisit] = useState({
    doctor: "",
    procedures: [] as ProcedureType[],
    notes: "",
  });

  const resetNewPatientForm = () => {
    setNewPatient({
      nationalId: "",
      name: "",
      dateOfBirth: "",
      gender: "Female",
      phone: "",
      email: "",
      address: "",
    });
  };

  const resetNewVisitForm = () => {
    setNewVisit({
      doctor: "",
      procedures: [],
      notes: "",
    });
  };

  const toggleProcedure = (procedure: ProcedureType) => {
    setNewVisit((prev) => {
      const exists = prev.procedures.includes(procedure);

      return {
        ...prev,
        procedures: exists
          ? prev.procedures.filter((p) => p !== procedure)
          : [...prev.procedures, procedure],
      };
    });
  };

  const loadProceduresForVisit = async (visitId: number) => {
    try {
      const response = await fetch(`${API_URL}/procedures/visit/${visitId}`);

      if (!response.ok) {
        setProceduresByVisit((prev) => ({
          ...prev,
          [visitId]: [],
        }));
        return;
      }

      const data = await response.json();

      setProceduresByVisit((prev) => ({
        ...prev,
        [visitId]: data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const loadPatientVisits = async (patientId: number) => {
    try {
      const response = await fetch(`${API_URL}/visits/patient/${patientId}`);

      if (!response.ok) {
        setVisits([]);
        return;
      }

      const data = await response.json();
      setVisits(data);

      data.forEach((visit: Visit) => {
        loadProceduresForVisit(visit.id);
      });
    } catch (error) {
      console.error(error);
      alert("Failed to load patient visits");
    }
  };

  const handleCreatePatient = async () => {
    if (
      !newPatient.nationalId ||
      !newPatient.name ||
      !newPatient.dateOfBirth ||
      !newPatient.gender ||
      !newPatient.phone
    ) {
      alert("Please fill all required patient information");
      return;
    }

    if (newPatient.nationalId.length !== 14) {
      alert("National ID must be 14 digits");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/patients/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          national_id: newPatient.nationalId,
          name: newPatient.name,
          date_of_birth: newPatient.dateOfBirth,
          gender: newPatient.gender,
          contact_number: newPatient.phone,
          email: newPatient.email,
          address: newPatient.address,
          user_id: null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail || "Failed to create patient");
        return;
      }

      const patient = await response.json();

      setPatientRecord(patient);
      setVisits([]);
      setProceduresByVisit({});
      resetNewPatientForm();
      setMode("profile");

      alert("Patient created successfully");
    } catch (error) {
      console.error(error);
      alert("Error creating patient");
    }
  };

  const handleSearchPatient = async () => {
    if (!searchId.trim()) {
      alert("Please enter National ID");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/patients/national/${searchId}`);

      if (!response.ok) {
        alert("Patient not found");
        return;
      }

      const patient = await response.json();

      setPatientRecord(patient);
      setMode("profile");
      loadPatientVisits(patient.id);
    } catch (error) {
      console.error(error);
      alert("Search failed");
    }
  };

  const handleAddVisit = async () => {
    if (!patientRecord) {
      alert("Please select patient first");
      return;
    }

    if (!newVisit.doctor || !newVisit.notes || newVisit.procedures.length === 0) {
      alert("Please enter doctor name, notes, and select at least one procedure");
      return;
    }

    try {
      const visitResponse = await fetch(`${API_URL}/visits/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: patientRecord.id,
          doctor_name: newVisit.doctor,
          notes: newVisit.notes,
        }),
      });

      if (!visitResponse.ok) {
        alert("Failed to create visit");
        return;
      }

      const visit = await visitResponse.json();

      for (const procedure of newVisit.procedures) {
        const procedureResponse = await fetch(`${API_URL}/procedures/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visit_id: visit.id,
            procedure_type: procedure,
            description: newVisit.notes,
          }),
        });

        if (!procedureResponse.ok) {
          alert(`Failed to save procedure: ${procedure}`);
        }
      }

      resetNewVisitForm();
      await loadPatientVisits(patientRecord.id);

      alert("Visit and procedures added successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to add visit");
    }
  };

  const handleMammogramUpload = async () => {
    if (!patientRecord) {
      alert("Please select patient first");
      return;
    }

    const doctorName = newVisit.doctor.trim() || "Hospital Doctor";

    try {
      const visitResponse = await fetch(`${API_URL}/visits/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: patientRecord.id,
          doctor_name: doctorName,
          notes: "Mammogram scan visit created from hospital dashboard",
        }),
      });

      if (!visitResponse.ok) {
        alert("Failed to create mammogram visit");
        return;
      }

      const visit = await visitResponse.json();

      await fetch(`${API_URL}/procedures/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visit_id: visit.id,
          procedure_type: "Mammogram",
          description: "Mammogram scan procedure",
        }),
      });

      localStorage.setItem("current_patient_id", String(patientRecord.id));
      localStorage.setItem("current_visit_id", String(visit.id));

      navigate("/upload");
    } catch (error) {
      console.error(error);
      alert("Failed to start mammogram upload");
    }
  };

  const goBackToChoose = () => {
    setMode("choose");
    setPatientRecord(null);
    setSearchId("");
    setVisits([]);
    setProceduresByVisit({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BreastCancerLogo className="w-16 h-16" />
            <div>
              <h1 className="text-pink-600 mb-1">Hospital Dashboard</h1>
              <p className="text-gray-600">
                Patient Visits, Medical Records & Mammogram Analysis
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-gray-600">Cairo Medical Center</p>
            <p className="text-gray-500">Egypt Breast Cancer Detection</p>
          </div>
        </div>
      </div>

      {mode === "choose" && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-pink-600 text-3xl text-center mb-8">
            Choose Patient Type
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              type="button"
              onClick={() => setMode("new")}
              className="border-2 border-pink-200 rounded-lg p-8 hover:bg-pink-50 transition-all text-center"
            >
              <Plus className="w-16 h-16 text-pink-600 mx-auto mb-4" />
              <h3 className="text-2xl text-pink-600 mb-2">New Patient</h3>
              <p className="text-gray-600">
                Register a new patient using National ID and personal information.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode("existing")}
              className="border-2 border-blue-200 rounded-lg p-8 hover:bg-blue-50 transition-all text-center"
            >
              <Search className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl text-blue-600 mb-2">Old Patient</h3>
              <p className="text-gray-600">
                Search existing patient by National ID and open medical record.
              </p>
            </button>
          </div>
        </div>
      )}

      {mode === "new" && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <button
            onClick={goBackToChoose}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-pink-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h2 className="text-pink-600 text-2xl mb-6">Register New Patient</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              value={newPatient.nationalId}
              onChange={(e) =>
                setNewPatient({ ...newPatient, nationalId: e.target.value })
              }
              maxLength={14}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="National ID"
            />

            <input
              type="text"
              value={newPatient.name}
              onChange={(e) =>
                setNewPatient({ ...newPatient, name: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Full Name"
            />

            <input
              type="date"
              value={newPatient.dateOfBirth}
              onChange={(e) =>
                setNewPatient({ ...newPatient, dateOfBirth: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg"
            />

            <select
              value={newPatient.gender}
              onChange={(e) =>
                setNewPatient({ ...newPatient, gender: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>

            <input
              type="text"
              value={newPatient.phone}
              onChange={(e) =>
                setNewPatient({ ...newPatient, phone: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Phone"
            />

            <input
              type="email"
              value={newPatient.email}
              onChange={(e) =>
                setNewPatient({ ...newPatient, email: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Email"
            />

            <input
              type="text"
              value={newPatient.address}
              onChange={(e) =>
                setNewPatient({ ...newPatient, address: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg md:col-span-2"
              placeholder="Address"
            />
          </div>

          <button
            onClick={handleCreatePatient}
            className="mt-8 bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700"
          >
            Save Patient
          </button>
        </div>
      )}

      {mode === "existing" && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <button
            onClick={goBackToChoose}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-pink-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h2 className="text-pink-600 text-2xl mb-6">Search Existing Patient</h2>

          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchPatient()}
            maxLength={14}
            className="w-full max-w-2xl px-4 py-3 border rounded-lg mb-6"
            placeholder="Enter 14-digit National ID"
          />

          <button
            onClick={handleSearchPatient}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search Patient
          </button>
        </div>
      )}

      {mode === "profile" && patientRecord && (
        <>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-pink-600 text-3xl mb-2">
                  {patientRecord.name}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                  <div>National ID: {patientRecord.national_id}</div>
                  <div>Phone: {patientRecord.contact_number}</div>
                  <div>Email: {patientRecord.email}</div>
                </div>

                <div className="mt-3 text-gray-500">
                  Registered:{" "}
                  {new Date(patientRecord.created_at).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={goBackToChoose}
                className="border px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Change Patient
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-pink-600 text-xl mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Visit / Procedures
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                value={newVisit.doctor}
                onChange={(e) =>
                  setNewVisit({ ...newVisit, doctor: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="Doctor Name"
              />

              <div className="border rounded-lg p-3">
                <p className="text-gray-700 mb-2">Procedure Types</p>

                <div className="grid grid-cols-1 gap-2">
                  {PROCEDURE_OPTIONS.map((procedure) => (
                    <label key={procedure} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newVisit.procedures.includes(procedure)}
                        onChange={() => toggleProcedure(procedure)}
                      />
                      {procedure}
                    </label>
                  ))}
                </div>
              </div>

              <input
                type="text"
                value={newVisit.notes}
                onChange={(e) =>
                  setNewVisit({ ...newVisit, notes: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="Visit notes"
              />
            </div>

            <button
              onClick={handleAddVisit}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
            >
              Add Visit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-pink-600 text-xl mb-3 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Mammogram Procedure
              </h3>

              <button
                onClick={handleMammogramUpload}
                className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
              >
                Upload Mammogram
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-blue-600 text-xl mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Latest AI Report
              </h3>

              <button
                onClick={() => navigate("/report")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                View Latest Report
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-pink-600 text-xl mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              Patient Visits
            </h3>

            {visits.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-600">
                No visits recorded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {visits.map((visit) => (
                  <div key={visit.id} className="border rounded-lg p-4">
                    <div className="flex justify-between mb-3">
                      <div>
                        <p>
                          <strong>Visit ID:</strong> {visit.id}
                        </p>

                        <p>
                          <strong>Doctor:</strong> {visit.doctor_name || "N/A"}
                        </p>

                        <p>
                          <strong>Notes:</strong> {visit.notes}
                        </p>
                      </div>

                      <div className="text-gray-500">
                        {new Date(visit.visit_date).toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="font-bold mb-2">Procedures:</p>

                      {(proceduresByVisit[visit.id] || []).length === 0 ? (
                        <p className="text-gray-500">No procedures recorded.</p>
                      ) : (
                        <div className="space-y-2">
                          {(proceduresByVisit[visit.id] || []).map(
                            (procedure) => (
                              <div
                                key={procedure.id}
                                className="border bg-white rounded p-3"
                              >
                                <p>
                                  <strong>Type:</strong>{" "}
                                  {procedure.procedure_type}
                                </p>
                                <p>
                                  <strong>Description:</strong>{" "}
                                  {procedure.description}
                                </p>
                                <p>
                                  <strong>Status:</strong> {procedure.status}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-pink-600 text-xl mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Medical Records
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-pink-600" />
                  Visits
                </h4>

                <p className="text-gray-600">{visits.length} visit(s)</p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-pink-600" />
                  Procedures
                </h4>

                <p className="text-gray-600">
                  {Object.values(proceduresByVisit).flat().length} procedure(s)
                </p>
              </div>

              <div className="border rounded-lg p-4 md:col-span-2">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-pink-600" />
                  Clinical Summary
                </h4>

                <p className="text-gray-600">
                  This section loads patient visits and procedures from PostgreSQL.
                  Doctor name is stored in the doctor_name column.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}