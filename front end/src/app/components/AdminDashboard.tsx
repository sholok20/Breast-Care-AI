import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Users,
  FileText,
  Activity,
  Hospital,
  UserRound,
  Trash2,
} from "lucide-react";

export function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  const loadAdminData = async () => {
    try {
      const [usersRes, logsRes, patientsRes, hospitalsRes, reportsRes] =
        await Promise.all([
          API.get("/admin/users"),
          API.get("/admin/logs"),
          API.get("/admin/patients"),
          API.get("/admin/hospitals"),
          API.get("/admin/reports"),
        ]);

      setUsers(usersRes.data);
      setLogs(logsRes.data);
      setPatients(patientsRes.data);
      setHospitals(hospitalsRes.data);
      setReports(reportsRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load admin data");
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const deleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/admin/users/${userId}`);
      alert("User deleted");
      loadAdminData();
    } catch (error: any) {
      alert(error?.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-pink-600 text-3xl mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg shadow">
          <Users className="text-pink-600 mb-2" />
          <p>Users</p>
          <h2>{users.length}</h2>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <Activity className="text-pink-600 mb-2" />
          <p>Logs</p>
          <h2>{logs.length}</h2>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <UserRound className="text-pink-600 mb-2" />
          <p>Patients</p>
          <h2>{patients.length}</h2>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <Hospital className="text-pink-600 mb-2" />
          <p>Hospitals</p>
          <h2>{hospitals.length}</h2>
        </div>

        <div className="bg-white p-5 rounded-lg shadow">
          <FileText className="text-pink-600 mb-2" />
          <p>Reports</p>
          <h2>{reports.length}</h2>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-pink-600 text-2xl mb-4">Users</h2>

        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
              </div>

              {user.role !== "admin" && (
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-pink-600 text-2xl mb-4">System Logs</h2>

        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="border rounded-lg p-4">
              <p>
                <strong>Action:</strong> {log.action}
              </p>
              <p>
                <strong>User ID:</strong> {log.user_id}
              </p>
              <p>
                <strong>Details:</strong> {log.details}
              </p>
              <p>
                <strong>IP:</strong> {log.ip_address}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(log.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}