import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import FeedbackModal from "../components/FeedbackModal";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

function AdminDashboard() {
  const [learners, setLearners] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("learners"); // "learners" | "mentors"

  // Feedback Modal
  const [selectedFeedbackLearner, setSelectedFeedbackLearner] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Assign Mentor Modal
  const [assigningLearner, setAssigningLearner] = useState(null);
  const [assignMentorId, setAssignMentorId] = useState("");
  const [assignBatch, setAssignBatch] = useState("JAVA_FS_2026");
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState("");

  const openFeedbackModal = (learner) => {
    setSelectedFeedbackLearner(learner);
    setIsFeedbackOpen(true);
  };
  const closeFeedbackModal = () => {
    setSelectedFeedbackLearner(null);
    setIsFeedbackOpen(false);
  };

  const openAssignModal = (learner) => {
    setAssigningLearner(learner);
    setAssignMentorId(learner.mentorId || "");
    setAssignBatch(learner.batch || "JAVA_FS_2026");
    setAssignError("");
  };
  const closeAssignModal = () => {
    setAssigningLearner(null);
    setAssignError("");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [learnersRes, mentorsRes] = await Promise.all([
        api.get("/api/learners"),
        api.get("/api/mentors")
      ]);
      setLearners(learnersRes.data || []);
      setMentors(mentorsRes.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete learner #${id}?`)) return;
    try {
      await api.delete(`/api/learners/${id}`);
      setLearners(learners.filter((l) => l.learnerId !== id));
      alert("Learner deleted successfully!");
    } catch (err) {
      alert("Failed to delete learner.");
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignMentorId || !assignBatch) {
      setAssignError("Both Mentor ID and Batch are required.");
      return;
    }
    setAssignLoading(true);
    setAssignError("");
    try {
      const res = await api.put(`/api/learners/${assigningLearner.learnerId}/assign`, {
        mentorId: parseInt(assignMentorId),
        batch: assignBatch
      });
      setLearners(learners.map((l) => l.learnerId === assigningLearner.learnerId ? res.data : l));
      alert(`Mentor assigned to ${assigningLearner.name || `#${assigningLearner.learnerId}`} successfully!`);
      closeAssignModal();
    } catch (err) {
      setAssignError(err.response?.data?.message || err.response?.data || "Assignment failed.");
    } finally {
      setAssignLoading(false);
    }
  };

  // Stats
  const totalLearners = learners.length;
  const totalMentors = mentors.length;
  const placementReadyCount = learners.filter(
    (l) => (l.codingScore || 0) >= 70 && (l.attendance || 0) >= 80 && (l.communicationScore || 0) >= 70
  ).length;
  const avgAttendance = totalLearners
    ? Math.round(learners.reduce((acc, curr) => acc + (curr.attendance || 0), 0) / totalLearners) : 0;

  // Chart data
  const batchAveragesMap = learners.reduce((acc, curr) => {
    const b = curr.batch || "UNASSIGNED";
    if (!acc[b]) acc[b] = { batch: b, coding: 0, aptitude: 0, comm: 0, count: 0 };
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

  const tabStyle = (tab) => ({
    padding: "8px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    border: "none",
    background: activeTab === tab ? "var(--primary)" : "#25294a",
    color: activeTab === tab ? "#fff" : "var(--text2)",
    transition: "all 0.2s"
  });

  return (
    <>
      <Navbar />
      <div className="screen">
        <div className="section-title">Admin Dashboard</div>
        <div className="section-sub">Live overview of all learners, mentors, and placement trends</div>

        {error && (
          <div style={{ background: "rgba(255,77,125,0.15)", color: "#ff4d7d", padding: "16px", borderRadius: "12px", marginBottom: "25px", border: "1px solid rgba(255,77,125,0.3)" }}>
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-num">{loading ? "..." : totalLearners}</div>
            <div className="stat-label">Total Learners</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: "#00e38c" }}>{loading ? "..." : placementReadyCount}</div>
            <div className="stat-label">Placement Ready</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: "#ffb800" }}>{loading ? "..." : totalMentors}</div>
            <div className="stat-label">Active Mentors</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: "#6c63ff" }}>{loading ? "..." : `${avgAttendance}%`}</div>
            <div className="stat-label">Avg Attendance</div>
          </div>
        </div>

        {/* Chart */}
        <div className="card" style={{ marginBottom: "25px" }}>
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
                  <Tooltip contentStyle={{ background: "#111325", borderColor: "#25294a", borderRadius: "8px", color: "#fff" }} />
                  <Legend />
                  <Bar dataKey="Coding" fill="#6c63ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Aptitude" fill="#ffb800" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Communication" fill="#00e38c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button style={tabStyle("learners")} onClick={() => setActiveTab("learners")}>Learners Registry</button>
          <button style={tabStyle("mentors")} onClick={() => setActiveTab("mentors")}>Mentors Registry</button>
        </div>

        {/* Learners Table */}
        {activeTab === "learners" && (
          <div className="card">
            <h2 style={{ marginBottom: "20px" }}>Master Learners Registry</h2>
            {loading ? (
              <p style={{ color: "#9ca3d5" }}>Loading learner database...</p>
            ) : learners.length === 0 ? (
              <p style={{ color: "#9ca3d5" }}>No learners registered yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Batch</th>
                      <th>Mentor ID</th>
                      <th>Attendance</th>
                      <th>Coding</th>
                      <th>Aptitude</th>
                      <th>Comm</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {learners.map((learner) => (
                      <tr key={learner.learnerId}>
                        <td style={{ fontWeight: "700" }}>#{learner.learnerId}</td>
                        <td>{learner.name || "—"}</td>
                        <td style={{ fontSize: "13px", color: "var(--text2)" }}>{learner.email || "—"}</td>
                        <td>
                          {learner.batch
                            ? <span className="badge badge-green">{learner.batch}</span>
                            : <span className="badge badge-yellow">Unassigned</span>}
                        </td>
                        <td>{learner.mentorId || <span style={{ color: "#ff4d7d" }}>Not Assigned</span>}</td>
                        <td>
                          <span style={{ fontWeight: "600", color: (learner.attendance || 0) < 75 ? "#ff4d7d" : "#fff" }}>
                            {learner.attendance != null ? `${learner.attendance}%` : "—"}
                          </span>
                        </td>
                        <td>{learner.codingScore != null ? learner.codingScore : "—"}</td>
                        <td>{learner.aptitudeScore != null ? learner.aptitudeScore : "—"}</td>
                        <td>{learner.communicationScore != null ? learner.communicationScore : "—"}</td>
                        <td style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          <button
                            className="btn"
                            onClick={() => openAssignModal(learner)}
                            style={{ padding: "5px 10px", fontSize: "12px", borderRadius: "6px", background: "rgba(108,99,255,0.15)", color: "#6c63ff", border: "1px solid rgba(108,99,255,0.3)" }}
                          >
                            Assign
                          </button>
                          <button
                            className="btn"
                            onClick={() => openFeedbackModal(learner)}
                            style={{ padding: "5px 10px", fontSize: "12px", borderRadius: "6px", background: "rgba(0,227,140,0.15)", color: "#00e38c", border: "1px solid rgba(0,227,140,0.3)" }}
                          >
                            Feedback
                          </button>
                          <button
                            className="btn btn-warning"
                            onClick={() => handleDelete(learner.learnerId)}
                            style={{ padding: "5px 10px", fontSize: "12px", borderRadius: "6px", background: "rgba(255,77,125,0.15)", color: "#ff4d7d", border: "1px solid rgba(255,77,125,0.3)" }}
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
        )}

        {/* Mentors Table */}
        {activeTab === "mentors" && (
          <div className="card">
            <h2 style={{ marginBottom: "20px" }}>Mentors Registry</h2>
            {loading ? (
              <p style={{ color: "#9ca3d5" }}>Loading mentor list...</p>
            ) : mentors.length === 0 ? (
              <p style={{ color: "#9ca3d5" }}>No mentors added yet. Use "Add Mentor" to create one.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Mentor ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Batch</th>
                      <th>Learners</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mentors.map((mentor) => (
                      <tr key={mentor.mentorId}>
                        <td style={{ fontWeight: "700" }}>#{mentor.mentorId}</td>
                        <td>{mentor.name}</td>
                        <td style={{ fontSize: "13px", color: "var(--text2)" }}>{mentor.email}</td>
                        <td><span className="badge badge-green">{mentor.batch || "N/A"}</span></td>
                        <td style={{ color: "#ffb800", fontWeight: "600" }}>
                          {learners.filter((l) => l.mentorId === mentor.mentorId).length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Assign Mentor Modal */}
      {assigningLearner && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(7,8,22,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
          <form
            className="card"
            onSubmit={handleAssignSubmit}
            style={{ width: "460px", boxShadow: "0px 10px 30px rgba(0,0,0,0.5)", border: "1px solid var(--border)" }}
          >
            <h2 style={{ marginBottom: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Assign Mentor</span>
              <button type="button" onClick={closeAssignModal} style={{ background: "none", border: "none", color: "var(--text2)", fontSize: "24px", cursor: "pointer" }}>&times;</button>
            </h2>
            <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "20px" }}>
              Learner: <strong>{assigningLearner.name || `#${assigningLearner.learnerId}`}</strong> ({assigningLearner.email})
            </p>

            {assignError && (
              <div style={{ background: "rgba(255,77,125,0.15)", color: "#ff4d7d", padding: "10px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", border: "1px solid rgba(255,77,125,0.3)" }}>
                {assignError}
              </div>
            )}

            <div className="form-row">
              <label>Mentor ID *</label>
              <input
                className="form-input"
                type="number"
                placeholder="e.g. 1"
                value={assignMentorId}
                onChange={(e) => setAssignMentorId(e.target.value)}
                disabled={assignLoading}
                required
              />
              {mentors.length > 0 && (
                <div style={{ marginTop: "6px", fontSize: "12px", color: "var(--text2)" }}>
                  Available: {mentors.map((m) => `#${m.mentorId} ${m.name}`).join(", ")}
                </div>
              )}
            </div>

            <div className="form-row">
              <label>Batch *</label>
              <select className="form-select" value={assignBatch} onChange={(e) => setAssignBatch(e.target.value)} disabled={assignLoading}>
                <option value="JAVA_FS_2026">JAVA_FS_2026</option>
                <option value="REACT_2026">REACT_2026</option>
                <option value="PYTHON_ML_2026">PYTHON_ML_2026</option>
                <option value="DATA_ENG_2026">DATA_ENG_2026</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "20px", justifyContent: "flex-end" }}>
              <button className="btn" type="button" onClick={closeAssignModal} style={{ background: "#25294a", color: "#fff" }} disabled={assignLoading}>Cancel</button>
              <button className="btn btn-success" type="submit" disabled={assignLoading}>
                {assignLoading ? "Assigning..." : "Assign Mentor"}
              </button>
            </div>
          </form>
        </div>
      )}

      <FeedbackModal learner={selectedFeedbackLearner} isOpen={isFeedbackOpen} onClose={closeFeedbackModal} />
    </>
  );
}

export default AdminDashboard;