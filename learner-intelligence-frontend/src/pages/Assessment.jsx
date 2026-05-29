import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Assessment() {
  const navigate = useNavigate();
  const [learners, setLearners] = useState([]);
  const [selectedLearnerId, setSelectedLearnerId] = useState("");
  const [score, setScore] = useState("");
  const [type, setType] = useState("Coding");
  
  const [loadingLearners, setLoadingLearners] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLearners = async () => {
    try {
      setLoadingLearners(true);
      const response = await api.get("/api/learners");
      setLearners(response.data || []);
      if (response.data?.length > 0) {
        setSelectedLearnerId(response.data[0].learnerId.toString());
      }
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch learners registry.");
    } finally {
      setLoadingLearners(false);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLearnerId || !score || !type) {
      setError("All fields are required.");
      return;
    }

    setLoadingSubmit(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        learnerId: parseInt(selectedLearnerId),
        score: parseInt(score),
        type: type
      };

      await api.post("/api/assessments", payload);
      setSuccess(`Assessment record created successfully for Student #${selectedLearnerId}!`);
      setScore("");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to create assessment score. Please try again."
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="screen">
        <div className="section-title">Assessment Management</div>
        <div className="section-sub">
          Log test scores and assignment grades for active learners in the system
        </div>

        <form className="card" onSubmit={handleSubmit} style={{ maxWidth: "560px" }}>
          {success && (
            <div
              style={{
                background: "rgba(0, 227, 140, 0.15)",
                color: "#00e38c",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px",
                border: "1px solid rgba(0, 227, 140, 0.3)"
              }}
            >
              {success}
            </div>
          )}

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

          <div className="form-row">
            <label>Select Learner *</label>
            {loadingLearners ? (
              <p style={{ color: "var(--text2)" }}>Loading registry...</p>
            ) : (
              <select
                className="form-select"
                value={selectedLearnerId}
                onChange={(e) => setSelectedLearnerId(e.target.value)}
                disabled={loadingSubmit}
              >
                {learners.map((l) => (
                  <option key={l.learnerId} value={l.learnerId}>
                    Student #{l.learnerId} ({l.batch})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-row">
            <label>Assessment Type *</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={loadingSubmit}
            >
              <option value="Coding">Coding Test</option>
              <option value="Aptitude">Aptitude Test</option>
              <option value="Communication">Communication Assessment</option>
            </select>
          </div>

          <div className="form-row">
            <label>Obtained Score (0 - 100) *</label>
            <input
              className="form-input"
              type="number"
              min="0"
              max="100"
              placeholder="85"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              disabled={loadingSubmit}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loadingSubmit || !selectedLearnerId}
            >
              {loadingSubmit ? "Submitting Record..." : "Log Assessment Grade"}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => navigate(localStorage.getItem("role") === "ADMIN" ? "/admin" : "/mentor")}
              style={{ background: "#25294a", color: "#fff" }}
              disabled={loadingSubmit}
            >
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Assessment;