import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function MentorDashboard() {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal State
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [attendance, setAttendance] = useState("");
  const [codingScore, setCodingScore] = useState("");
  const [aptitudeScore, setAptitudeScore] = useState("");
  const [communicationScore, setCommunicationScore] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchLearners = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/learners");
      setLearners(response.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch learners registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, []);

  const openUpdateModal = (learner) => {
    setSelectedLearner(learner);
    setAttendance(learner.attendance || 0);
    setCodingScore(learner.codingScore || 0);
    setAptitudeScore(learner.aptitudeScore || 0);
    setCommunicationScore(learner.communicationScore || 0);
    setModalError("");
  };

  const closeUpdateModal = () => {
    setSelectedLearner(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLearner) return;

    setModalLoading(true);
    setModalError("");

    try {
      const payload = {
        ...selectedLearner,
        attendance: parseInt(attendance),
        codingScore: parseInt(codingScore),
        aptitudeScore: parseInt(aptitudeScore),
        communicationScore: parseInt(communicationScore)
      };

      const response = await api.put(`/api/learners/${selectedLearner.learnerId}`, payload);
      
      // Update state
      setLearners(
        learners.map((l) =>
          l.learnerId === selectedLearner.learnerId ? response.data : l
        )
      );

      alert("Student metrics updated successfully!");
      closeUpdateModal();
    } catch (err) {
      console.error(err);
      setModalError(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to update metrics. Make sure scores are between 0 and 100."
      );
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="screen">
        <div className="section-title">Mentor Dashboard</div>
        <div className="section-sub">
          Review metrics and update performance metrics of learners
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

        <div className="card">
          <h2 style={{ marginBottom: "20px" }}>Active Learner Scoring Registry</h2>
          {loading ? (
            <p style={{ color: "#9ca3d5" }}>Loading student lists...</p>
          ) : learners.length === 0 ? (
            <p style={{ color: "#9ca3d5" }}>No students registered in the database.</p>
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
                    <th>Action</th>
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
                            color: (learner.attendance || 0) < 75 ? "#ff4d7d" : "#00e38c"
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
                          onClick={() => openUpdateModal(learner)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "13px",
                            borderRadius: "6px",
                            background: "linear-gradient(90deg, #6c63ff, #8f85ff)",
                            color: "#fff"
                          }}
                        >
                          Update Scores
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

      {/* UPDATE MODAL OVERLAY */}
      {selectedLearner && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(7, 8, 22, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)"
          }}
        >
          <form
            className="card"
            onSubmit={handleUpdateSubmit}
            style={{
              width: "480px",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
              border: "1px solid var(--border)",
              animation: "fadeIn 0.2s"
            }}
          >
            <h2 style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Update Student #{selectedLearner.learnerId}</span>
              <button
                type="button"
                onClick={closeUpdateModal}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text2)",
                  fontSize: "24px",
                  cursor: "pointer"
                }}
              >
                &times;
              </button>
            </h2>
            <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "20px" }}>
              Batch: {selectedLearner.batch} | Mentor: {selectedLearner.mentorId || "N/A"}
            </p>

            {modalError && (
              <div
                style={{
                  background: "rgba(255, 77, 125, 0.15)",
                  color: "#ff4d7d",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  border: "1px solid rgba(255, 77, 125, 0.3)"
                }}
              >
                {modalError}
              </div>
            )}

            <div className="form-row">
              <label>Attendance (%)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                max="100"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                disabled={modalLoading}
                required
              />
            </div>

            <div className="form-row">
              <label>Coding Score (0-100)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                max="100"
                value={codingScore}
                onChange={(e) => setCodingScore(e.target.value)}
                disabled={modalLoading}
                required
              />
            </div>

            <div className="form-row">
              <label>Aptitude Score (0-100)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                max="100"
                value={aptitudeScore}
                onChange={(e) => setAptitudeScore(e.target.value)}
                disabled={modalLoading}
                required
              />
            </div>

            <div className="form-row">
              <label>Communication Score (0-100)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                max="100"
                value={communicationScore}
                onChange={(e) => setCommunicationScore(e.target.value)}
                disabled={modalLoading}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px", justifyContent: "flex-end" }}>
              <button
                className="btn"
                type="button"
                onClick={closeUpdateModal}
                style={{ background: "#25294a", color: "#fff" }}
                disabled={modalLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                type="submit"
                disabled={modalLoading}
              >
                {modalLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default MentorDashboard;