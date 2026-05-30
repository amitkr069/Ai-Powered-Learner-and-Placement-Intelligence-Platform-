import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AddLearner() {
  const navigate = useNavigate();
  const [batch, setBatch] = useState("JAVA_FS_2026");
  const [mentorId, setMentorId] = useState("");
  const [attendance, setAttendance] = useState("");
  const [codingScore, setCodingScore] = useState("");
  const [aptitudeScore, setAptitudeScore] = useState("");
  const [communicationScore, setCommunicationScore] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!batch || !mentorId) {
      setError("Batch and Mentor ID are required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        batch,
        mentorId: mentorId ? parseInt(mentorId) : null,
        attendance: attendance ? parseInt(attendance) : 0,
        codingScore: codingScore ? parseInt(codingScore) : 0,
        aptitudeScore: aptitudeScore ? parseInt(aptitudeScore) : 0,
        communicationScore: communicationScore ? parseInt(communicationScore) : 0
      };

      await api.post("/api/learners", payload);
      alert("Learner added successfully!");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to add learner. Please verify your fields."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="screen">
        <div className="section-title">Add Learner</div>
        <div className="section-sub" style={{ marginBottom: "20px" }}>
          Register a new student with baseline profiles and metrics in the database
        </div>

        <form className="card" onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                background: "rgba(255, 77, 125, 0.15)",
                color: "#ff4d7d",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px",
                border: "1px solid rgba(255, 77, 125, 0.3)"
              }}
            >
              {error}
            </div>
          )}

          <div className="input-group">
            <div className="form-row">
              <label>Batch Name *</label>
              <select
                className="form-select"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                disabled={loading}
              >
                <option value="JAVA_FS_2026">JAVA_FS_2026</option>
                <option value="REACT_2026">REACT_2026</option>
                <option value="PYTHON_ML_2026">PYTHON_ML_2026</option>
                <option value="DATA_ENG_2026">DATA_ENG_2026</option>
              </select>
            </div>

            <div className="form-row">
              <label>Mentor ID *</label>
              <input
                className="form-input"
                type="number"
                placeholder="101"
                value={mentorId}
                onChange={(e) => setMentorId(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="form-row">
              <label>Attendance (%)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                max="100"
                placeholder="90"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <label>Coding Score (0 - 100)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                max="100"
                placeholder="85"
                value={codingScore}
                onChange={(e) => setCodingScore(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="input-group">
            <div className="form-row">
              <label>Aptitude Score (0 - 100)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                max="100"
                placeholder="78"
                value={aptitudeScore}
                onChange={(e) => setAptitudeScore(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <label>Communication Score (0 - 100)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                max="100"
                placeholder="88"
                value={communicationScore}
                onChange={(e) => setCommunicationScore(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <button
              className="btn btn-success"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving Student..." : "Save Learner"}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => navigate("/admin")}
              style={{ background: "#25294a", color: "#fff" }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddLearner;