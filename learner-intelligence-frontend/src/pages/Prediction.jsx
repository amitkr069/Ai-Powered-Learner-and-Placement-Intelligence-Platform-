import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Prediction() {
  const [learners, setLearners] = useState([]);
  const [selectedLearnerId, setSelectedLearnerId] = useState("");
  const [prediction, setPrediction] = useState(null);
  
  const [loadingLearners, setLoadingLearners] = useState(true);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  
  const [error, setError] = useState("");
  const [predictionError, setPredictionError] = useState("");

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
      setError("Failed to load learners list.");
    } finally {
      setLoadingLearners(false);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, []);

  const fetchExistingPrediction = async (learnerId) => {
    if (!learnerId) return;
    setLoadingPrediction(true);
    setPredictionError("");
    setPrediction(null);
    try {
      const response = await api.get(`/api/prediction/learner/${learnerId}`);
      setPrediction(response.data);
    } catch (err) {
      console.log("No existing prediction found:", err);
      // Don't show error, just keep prediction null so they can trigger a new one
    } finally {
      setLoadingPrediction(false);
    }
  };

  useEffect(() => {
    if (selectedLearnerId) {
      fetchExistingPrediction(selectedLearnerId);
    }
  }, [selectedLearnerId]);

  const handleGeneratePrediction = async () => {
    if (!selectedLearnerId) return;

    setLoadingPrediction(true);
    setPredictionError("");

    try {
      const response = await api.post(`/api/prediction/${selectedLearnerId}`);
      setPrediction(response.data);
      alert("AI Placement Prediction generated and saved successfully!");
    } catch (err) {
      console.error(err);
      setPredictionError(
        err.response?.data?.message ||
        err.response?.data ||
        "ML server returned an error. Ensure your FastAPI Python app is running on port 8000."
      );
    } finally {
      setLoadingPrediction(false);
    }
  };

  const getRecommendationStyle = (rec) => {
    const r = rec?.toLowerCase() || "";
    if (r.includes("ready") || r.includes("high") || r.includes("excellent")) {
      return { badge: "badge-green", color: "#00e38c", bg: "rgba(0, 227, 140, 0.1)" };
    }
    if (r.includes("moderate") || r.includes("medium")) {
      return { badge: "badge-yellow", color: "#ffb800", bg: "rgba(255, 184, 0, 0.1)" };
    }
    return { badge: "badge-red", color: "#ff4d7d", bg: "rgba(255, 77, 125, 0.1)" };
  };

  const selectedLearnerDetails = learners.find((l) => l.learnerId.toString() === selectedLearnerId);

  return (
    <>
      <Navbar />

      <div className="screen">
        <div className="section-title">AI Placement Analytics</div>
        <div className="section-sub">
          Generate real-time machine learning predictions on student placement readiness
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

        <div className="two-grid">
          {/* Controls Card */}
          <div className="card" style={{ height: "fit-content" }}>
            <h2 style={{ marginBottom: "20px" }}>Placement Analytics Engine</h2>
            
            <div className="form-row">
              <label>Select Student Registry ID *</label>
              {loadingLearners ? (
                <p style={{ color: "var(--text2)" }}>Loading students...</p>
              ) : (
                <select
                  className="form-select"
                  value={selectedLearnerId}
                  onChange={(e) => setSelectedLearnerId(e.target.value)}
                  disabled={loadingPrediction}
                >
                  {learners.map((l) => (
                    <option key={l.learnerId} value={l.learnerId}>
                      Student #{l.learnerId} ({l.batch})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedLearnerDetails && (
              <div
                style={{
                  background: "#181c36",
                  padding: "16px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  border: "1px solid var(--border)",
                  fontSize: "14px"
                }}
              >
                <h4 style={{ marginBottom: "12px", color: "#fff" }}>Current Student Profile Metrics</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", color: "var(--text2)" }}>
                  <div>Attendance: <span style={{ color: "#fff", fontWeight: "600" }}>{selectedLearnerDetails.attendance || 0}%</span></div>
                  <div>Coding score: <span style={{ color: "#fff", fontWeight: "600" }}>{selectedLearnerDetails.codingScore || 0}/100</span></div>
                  <div>Aptitude score: <span style={{ color: "#fff", fontWeight: "600" }}>{selectedLearnerDetails.aptitudeScore || 0}/100</span></div>
                  <div>Comm score: <span style={{ color: "#fff", fontWeight: "600" }}>{selectedLearnerDetails.communicationScore || 0}/100</span></div>
                </div>
              </div>
            )}

            <button
              className="btn btn-primary"
              onClick={handleGeneratePrediction}
              style={{ width: "100%" }}
              disabled={loadingPrediction || !selectedLearnerId}
            >
              {loadingPrediction ? "Querying ML Model..." : "Generate AI Placement Prediction"}
            </button>
          </div>

          {/* Results Dashboard Card */}
          <div className="card" style={{ minHeight: "300px", display: "flex", flexDirection: "column" }}>
            <h2 style={{ marginBottom: "20px" }}>AI Placement Verdict</h2>

            {predictionError && (
              <div
                style={{
                  background: "rgba(255, 77, 125, 0.15)",
                  color: "#ff4d7d",
                  padding: "16px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  border: "1px solid rgba(255, 77, 125, 0.3)"
                }}
              >
                {predictionError}
              </div>
            )}

            {loadingPrediction ? (
              <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "4px solid rgba(108, 99, 255, 0.1)",
                    borderTop: "4px solid #6c63ff",
                    borderRadius: "50%",
                    animation: "spin 1s infinite linear"
                  }}
                />
                <p style={{ color: "var(--text2)" }}>Retrieving metrics from Python ML server...</p>
              </div>
            ) : prediction ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                <div
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    background: getRecommendationStyle(prediction.recommendation).bg,
                    border: `4px solid ${getRecommendationStyle(prediction.recommendation).color}`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "42px",
                    fontWeight: "800",
                    color: getRecommendationStyle(prediction.recommendation).color,
                    marginBottom: "16px",
                    boxShadow: "0px 0px 20px rgba(108, 99, 255, 0.1)"
                  }}
                >
                  {Math.round(prediction.readinessScore || 0)}%
                </div>
                <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>
                  Placement Readiness Score
                </h3>
                <span className={`badge ${getRecommendationStyle(prediction.recommendation).badge}`} style={{ fontSize: "16px", padding: "8px 16px" }}>
                  {prediction.recommendation}
                </span>
                <p style={{ color: "var(--text2)", fontSize: "14px", marginTop: "16px", maxWidth: "340px" }}>
                  This student has been analyzed by the Random Forest Classifier based on attendance, coding aptitude, and soft skills profiles.
                </p>
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", color: "var(--text2)" }}>
                <div>
                  <p style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "#fff" }}>
                    No Placement Prediction Generated
                  </p>
                  <p style={{ fontSize: "14px", maxWidth: "320px", margin: "0 auto" }}>
                    Select a student and click "Generate AI Placement Prediction" to execute the Random Forest Classifier on the FastAPI server!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export default Prediction;