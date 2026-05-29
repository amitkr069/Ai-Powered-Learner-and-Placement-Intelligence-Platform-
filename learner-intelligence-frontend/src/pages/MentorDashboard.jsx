import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import FeedbackModal from "../components/FeedbackModal";

function MentorDashboard() {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get mentorId from localStorage (stored at login)
  const mentorId = localStorage.getItem("mentorId");
  const mentorName = localStorage.getItem("name") || "Mentor";

  // Feedback Modal
  const [selectedFeedbackLearner, setSelectedFeedbackLearner] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Score Update Modal
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [attendance, setAttendance] = useState("");
  const [codingScore, setCodingScore] = useState("");
  const [aptitudeScore, setAptitudeScore] = useState("");
  const [communicationScore, setCommunicationScore] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const openFeedbackModal = (learner) => {
    setSelectedFeedbackLearner(learner);
    setIsFeedbackOpen(true);
  };
  const closeFeedbackModal = () => {
    setSelectedFeedbackLearner(null);
    setIsFeedbackOpen(false);
  };

  const fetchLearners = async () => {
    if (!mentorId) {
      setError("Mentor session not found. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // Fetch ONLY this mentor's learners
      const response = await api.get(`/api/learners/mentor/${mentorId}`);
      setLearners(response.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch your learners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLearners(); }, [mentorId]);

  const openUpdateModal = (learner) => {
    setSelectedLearner(learner);
    setAttendance(learner.attendance ?? "");
    setCodingScore(learner.codingScore ?? "");
    setAptitudeScore(learner.aptitudeScore ?? "");
    setCommunicationScore(learner.communicationScore ?? "");
    setModalError("");
  };
  const closeUpdateModal = () => setSelectedLearner(null);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLearner) return;
    setModalLoading(true);
    setModalError("");
    try {
      const payload = {
        attendance: attendance !== "" ? parseInt(attendance) : null,
        codingScore: codingScore !== "" ? parseInt(codingScore) : null,
        aptitudeScore: aptitudeScore !== "" ? parseInt(aptitudeScore) : null,
        communicationScore: communicationScore !== "" ? parseInt(communicationScore) : null
      };
      // Use dedicated scores endpoint
      const response = await api.put(`/api/learners/${selectedLearner.learnerId}/scores`, payload);
      setLearners(learners.map((l) => l.learnerId === selectedLearner.learnerId ? response.data : l));
      alert("Student metrics updated successfully!");
      closeUpdateModal();
    } catch (err) {
      console.error(err);
      setModalError(err.response?.data?.message || err.response?.data || "Failed to update metrics.");
    } finally {
      setModalLoading(false);
    }
  };

  // Stats for this mentor only
  const totalLearners = learners.length;
  const placementReady = learners.filter(
    (l) => (l.codingScore || 0) >= 70 && (l.attendance || 0) >= 80 && (l.communicationScore || 0) >= 70
  ).length;
  const uniqueBatches = new Set(learners.map((l) => l.batch).filter(Boolean)).size;

  return (
    <>
      <Navbar />
      <div className="screen">
        <div className="section-title">Welcome, {mentorName}!</div>
        <div className="section-sub">
          Manage and update performance metrics for your assigned learners
        </div>

        {error && (
          <div style={{ background: "rgba(255,77,125,0.15)", color: "#ff4d7d", padding: "16px", borderRadius: "12px", marginBottom: "25px", border: "1px solid rgba(255,77,125,0.3)" }}>
            {error}
          </div>
        )}

        {/* Mentor Stats */}
        <div className="stats-grid" style={{ marginBottom: "25px" }}>
          <div className="stat-card">
            <div className="stat-num">{loading ? "..." : totalLearners}</div>
            <div className="stat-label">My Learners</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: "#00e38c" }}>{loading ? "..." : placementReady}</div>
            <div className="stat-label">Placement Ready</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: "#ffb800" }}>{loading ? "..." : uniqueBatches}</div>
            <div className="stat-label">My Batches</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: "#6c63ff" }}>#{mentorId}</div>
            <div className="stat-label">My Mentor ID</div>
          </div>
        </div>

        {/* Learner Table */}
        <div className="card">
          <h2 style={{ marginBottom: "20px" }}>My Learners — Active Scoring Registry</h2>
          {loading ? (
            <p style={{ color: "#9ca3d5" }}>Loading your students...</p>
          ) : learners.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "42px", marginBottom: "12px" }}>📋</div>
              <p style={{ color: "#9ca3d5", fontSize: "15px" }}>No learners are assigned to you yet. Contact the administrator.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Batch</th>
                    <th>Attendance</th>
                    <th>Coding</th>
                    <th>Aptitude</th>
                    <th>Comm</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {learners.map((learner) => (
                    <tr key={learner.learnerId}>
                      <td style={{ fontWeight: "700" }}>#{learner.learnerId}</td>
                      <td>{learner.name || "—"}</td>
                      <td style={{ fontSize: "13px", color: "var(--text2)" }}>{learner.email || "—"}</td>
                      <td><span className="badge badge-green">{learner.batch || "N/A"}</span></td>
                      <td>
                        <span style={{ fontWeight: "600", color: (learner.attendance || 0) < 75 ? "#ff4d7d" : "#00e38c" }}>
                          {learner.attendance != null ? `${learner.attendance}%` : "—"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div className="progress" style={{ width: "60px", display: "inline-block" }}>
                            <div className="progress-bar blue" style={{ width: `${learner.codingScore || 0}%` }}></div>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: "600" }}>{learner.codingScore ?? "—"}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div className="progress" style={{ width: "60px", display: "inline-block" }}>
                            <div className="progress-bar yellow" style={{ width: `${learner.aptitudeScore || 0}%` }}></div>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: "600" }}>{learner.aptitudeScore ?? "—"}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div className="progress" style={{ width: "60px", display: "inline-block" }}>
                            <div className="progress-bar green" style={{ width: `${learner.communicationScore || 0}%` }}></div>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: "600" }}>{learner.communicationScore ?? "—"}</span>
                        </div>
                      </td>
                      <td style={{ display: "flex", gap: "6px" }}>
                        <button
                          className="btn btn-warning"
                          onClick={() => openUpdateModal(learner)}
                          style={{ padding: "6px 12px", fontSize: "13px", borderRadius: "6px", background: "linear-gradient(90deg, #6c63ff, #8f85ff)", color: "#fff", border: "none" }}
                        >
                          Update Scores
                        </button>
                        <button
                          className="btn"
                          onClick={() => openFeedbackModal(learner)}
                          style={{ padding: "6px 12px", fontSize: "13px", borderRadius: "6px", background: "rgba(0,227,140,0.15)", color: "#00e38c", border: "1px solid rgba(0,227,140,0.3)" }}
                        >
                          Feedback
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

      {/* Update Scores Modal */}
      {selectedLearner && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(7,8,22,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
          <form
            className="card"
            onSubmit={handleUpdateSubmit}
            style={{ width: "480px", boxShadow: "0px 10px 30px rgba(0,0,0,0.5)", border: "1px solid var(--border)" }}
          >
            <h2 style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Update Scores</span>
              <button type="button" onClick={closeUpdateModal} style={{ background: "none", border: "none", color: "var(--text2)", fontSize: "24px", cursor: "pointer" }}>&times;</button>
            </h2>
            <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "20px" }}>
              Learner: <strong>{selectedLearner.name || `#${selectedLearner.learnerId}`}</strong> | Batch: {selectedLearner.batch}
            </p>

            {modalError && (
              <div style={{ background: "rgba(255,77,125,0.15)", color: "#ff4d7d", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", border: "1px solid rgba(255,77,125,0.3)" }}>
                {modalError}
              </div>
            )}

            <div className="form-row">
              <label>Attendance (%)</label>
              <input className="form-input" type="number" min="0" max="100" value={attendance} onChange={(e) => setAttendance(e.target.value)} disabled={modalLoading} required />
            </div>
            <div className="form-row">
              <label>Coding Score (0-100)</label>
              <input className="form-input" type="number" min="0" max="100" value={codingScore} onChange={(e) => setCodingScore(e.target.value)} disabled={modalLoading} required />
            </div>
            <div className="form-row">
              <label>Aptitude Score (0-100)</label>
              <input className="form-input" type="number" min="0" max="100" value={aptitudeScore} onChange={(e) => setAptitudeScore(e.target.value)} disabled={modalLoading} required />
            </div>
            <div className="form-row">
              <label>Communication Score (0-100)</label>
              <input className="form-input" type="number" min="0" max="100" value={communicationScore} onChange={(e) => setCommunicationScore(e.target.value)} disabled={modalLoading} required />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px", justifyContent: "flex-end" }}>
              <button className="btn" type="button" onClick={closeUpdateModal} style={{ background: "#25294a", color: "#fff" }} disabled={modalLoading}>Cancel</button>
              <button className="btn btn-success" type="submit" disabled={modalLoading}>
                {modalLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      <FeedbackModal learner={selectedFeedbackLearner} isOpen={isFeedbackOpen} onClose={closeFeedbackModal} />
    </>
  );
}

export default MentorDashboard;