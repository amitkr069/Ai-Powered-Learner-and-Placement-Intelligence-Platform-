import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function AdminDashboard() {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLearners = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/learners");
      setLearners(response.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch learners data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete learner with ID: ${id}?`)) {
      return;
    }
    try {
      await api.delete(`/api/learners/${id}`);
      setLearners(learners.filter((l) => l.learnerId !== id));
      alert("Learner deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete learner. Please try again.");
    }
  };

  // 1. Calculate dynamic statistics
  const totalLearners = learners.length;
  
  const placementReadyCount = learners.filter(
    (l) =>
      (l.codingScore || 0) >= 70 &&
      (l.attendance || 0) >= 80 &&
      (l.communicationScore || 0) >= 70
  ).length;

  const uniqueMentors = new Set(learners.map((l) => l.mentorId).filter(Boolean)).size;

  const avgAttendance = totalLearners
    ? Math.round(learners.reduce((acc, curr) => acc + (curr.attendance || 0), 0) / totalLearners)
    : 0;

  // 2. Group by batch for Batch Overview
  const batchDataMap = learners.reduce((acc, curr) => {
    const b = curr.batch || "UNASSIGNED";
    if (!acc[b]) {
      acc[b] = { batchName: b, total: 0, ready: 0 };
    }
    acc[b].total += 1;
    const isReady =
      (curr.codingScore || 0) >= 70 &&
      (curr.attendance || 0) >= 80 &&
      (curr.communicationScore || 0) >= 70;
    if (isReady) {
      acc[b].ready += 1;
    }
    return acc;
  }, {});

  const batchOverviewList = Object.values(batchDataMap);

  // 3. Prepare data for Recharts chart (average scores per batch)
  const batchAveragesMap = learners.reduce((acc, curr) => {
    const b = curr.batch || "UNASSIGNED";
    if (!acc[b]) {
      acc[b] = { batch: b, coding: 0, aptitude: 0, comm: 0, count: 0 };
    }
    acc[b].coding += curr.codingScore || 0;
    acc[b].aptitude += curr.aptitudeScore || 0;
    acc[b].comm += curr.communicationScore || 0;
    acc[b].count += 1;
    return acc;
  }, {});

  const chartData = Object.values(batchAveragesMap).map((item) => ({
    name: item.batch,
    Coding: Math.round(item.coding / item.count),
    Aptitude: Math.round(item.aptitude / item.count),
    Communication: Math.round(item.comm / item.count)
  }));

  return (
    <>
      <Navbar />

      <div className="screen">
        <div className="section-title">Admin Dashboard</div>
        <div className="section-sub">
          Live overview of all learners, metrics, and placement trends
        </div>

        {error && (
          <div
            style={{
              background: "rgba(255, 77, 125, 0.15)",
              color: "#ff4d7d",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "25px",
              border: "1px solid rgba(255, 77, 125, 0.3)"
            }}
          >
            {error}
          </div>
        )}

        {/* Dynamic Statistics Widgets */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-num">{loading ? "..." : totalLearners}</div>
            <div className="stat-label">Total Learners</div>
          </div>

          <div className="stat-card">
            <div className="stat-num" style={{ color: "#00e38c" }}>
              {loading ? "..." : placementReadyCount}
            </div>
            <div className="stat-label">Placement Ready</div>
          </div>

          <div className="stat-card">
            <div className="stat-num" style={{ color: "#ffb800" }}>
              {loading ? "..." : uniqueMentors}
            </div>
            <div className="stat-label">Active Mentors</div>
          </div>

          <div className="stat-card">
            <div className="stat-num" style={{ color: "#6c63ff" }}>
              {loading ? "..." : `${avgAttendance}%`}
            </div>
            <div className="stat-label">Avg Attendance</div>
          </div>
        </div>

        {/* Dual Grid - Batch Table and Visual Chart */}
        <div className="two-grid" style={{ marginBottom: "25px" }}>
          <div className="card">
            <h2 style={{ marginBottom: "20px" }}>Batch Overview</h2>
            {loading ? (
              <p style={{ color: "#9ca3d5" }}>Loading batches...</p>
            ) : batchOverviewList.length === 0 ? (
              <p style={{ color: "#9ca3d5" }}>No batches found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Batch</th>
                    <th>Total Learners</th>
                    <th>Ready Learners</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {batchOverviewList.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: "600" }}>{item.batchName}</td>
                      <td>{item.total}</td>
                      <td style={{ color: "#00e38c", fontWeight: "600" }}>{item.ready}</td>
                      <td>
                        <span className="badge badge-green">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <h2 style={{ marginBottom: "20px" }}>Skills Analysis by Batch</h2>
            <div style={{ width: "100%", height: "260px" }}>
              {loading ? (
                <div className="chart-box">Loading analytics...</div>
              ) : chartData.length === 0 ? (
                <div className="chart-box">No batch data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#25294a" />
                    <XAxis dataKey="name" stroke="#9ca3d5" />
                    <YAxis stroke="#9ca3d5" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        background: "#111325",
                        borderColor: "#25294a",
                        borderRadius: "8px",
                        color: "#fff"
                      }}
                    />
                    <Legend />
                    <Bar dataKey="Coding" fill="#6c63ff" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Aptitude" fill="#ffb800" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Communication" fill="#00e38c" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Master Learners List */}
        <div className="card">
          <h2 style={{ marginBottom: "20px" }}>Master Learners Registry</h2>
          {loading ? (
            <p style={{ color: "#9ca3d5" }}>Loading learner database...</p>
          ) : learners.length === 0 ? (
            <p style={{ color: "#9ca3d5" }}>No learners registered yet. Click "Add Learner" to get started.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Learner ID</th>
                    <th>Batch</th>
                    <th>Mentor ID</th>
                    <th>Attendance</th>
                    <th>Coding Score</th>
                    <th>Aptitude Score</th>
                    <th>Comm Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {learners.map((learner) => (
                    <tr key={learner.learnerId}>
                      <td style={{ fontWeight: "700" }}>#{learner.learnerId}</td>
                      <td>{learner.batch}</td>
                      <td>{learner.mentorId || "N/A"}</td>
                      <td>
                        <span
                          style={{
                            fontWeight: "600",
                            color: (learner.attendance || 0) < 75 ? "#ff4d7d" : "#fff"
                          }}
                        >
                          {learner.attendance || 0}%
                        </span>
                      </td>
                      <td>
                        <div className="progress" style={{ width: "80px", display: "inline-block", marginRight: "8px", verticalAlign: "middle" }}>
                          <div
                            className="progress-bar blue"
                            style={{ width: `${learner.codingScore || 0}%` }}
                          ></div>
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: "600" }}>{learner.codingScore || 0}</span>
                      </td>
                      <td>
                        <div className="progress" style={{ width: "80px", display: "inline-block", marginRight: "8px", verticalAlign: "middle" }}>
                          <div
                            className="progress-bar yellow"
                            style={{ width: `${learner.aptitudeScore || 0}%` }}
                          ></div>
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: "600" }}>{learner.aptitudeScore || 0}</span>
                      </td>
                      <td>
                        <div className="progress" style={{ width: "80px", display: "inline-block", marginRight: "8px", verticalAlign: "middle" }}>
                          <div
                            className="progress-bar green"
                            style={{ width: `${learner.communicationScore || 0}%` }}
                          ></div>
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: "600" }}>{learner.communicationScore || 0}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleDelete(learner.learnerId)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "13px",
                            borderRadius: "6px",
                            background: "rgba(255, 77, 125, 0.15)",
                            color: "#ff4d7d",
                            border: "1px solid rgba(255, 77, 125, 0.3)"
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;