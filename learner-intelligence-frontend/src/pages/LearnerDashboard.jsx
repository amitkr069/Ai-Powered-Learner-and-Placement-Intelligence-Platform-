import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function LearnerDashboard() {
  const [learner, setLearner] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(true);

  const userName = localStorage.getItem("name") || "Student";
  const userEmail = localStorage.getItem("email") || "";
  const userId = localStorage.getItem("id");

  const fetchLearnerData = async () => {
    if (!userId) {
      setError("User session not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 1. Fetch Learner Metrics
      let learnerData = null;
      try {
        const learnerRes = await api.get(`/api/learners/${userId}`);
        learnerData = learnerRes.data;
        setLearner(learnerData);
        setInitialized(true);
      } catch (err) {
        if (err.response?.status === 404) {
          // Learner profile not initialized yet by admin/mentor
          setInitialized(false);
        } else {
          throw err;
        }
      }

      // If learner metrics exist, fetch predictions and feedback
      if (learnerData) {
        // 2. Fetch AI Placement Prediction
        try {
          const predRes = await api.get(`/api/prediction/learner/${userId}`);
          setPrediction(predRes.data);
        } catch (predErr) {
          console.warn("No prediction record found for this learner yet.", predErr);
        }

        // 3. Fetch Mentor Feedback
        try {
          const feedbackRes = await api.get(`/api/feedback/learner/${userId}`);
          setFeedbackList(feedbackRes.data || []);
        } catch (fbErr) {
          console.warn("Could not retrieve mentor feedback logs.", fbErr);
        }
      }

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to load academic profile. Please verify connection to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearnerData();
  }, [userId]);

  // Determine readiness display class and badge
  const getReadinessConfig = (score) => {
    if (score >= 80) {
      return {
        label: "High Placement Readiness",
        desc: "Excellent metric standings! You meet top recruiting tiers.",
        color: "var(--green)",
        badgeClass: "badge-green"
      };
    } else if (score >= 60) {
      return {
        label: "Moderate Placement Readiness",
        desc: "Good standing. Focus on bolstering your weaker skill domains to ensure placement.",
        color: "var(--yellow)",
        badgeClass: "badge-yellow"
      };
    } else {
      return {
        label: "Awaiting Placement Skill-up",
        desc: "Metrics are currently below placement benchmarks. Engage with your mentor to plan a path forward.",
        color: "var(--red)",
        badgeClass: "badge-red"
      };
    }
  };

  return (
    <>
      <Navbar />

      <div className="screen">
        <div className="section-title">Welcome back, {userName}!</div>
        <div className="section-sub">
          Your personalized AI-Powered Learner & Placement Intelligence Dashboard
        </div>

        {error && (
          <div
            style={{
              background: "rgba(255, 77, 125, 0.15)",
              color: "#ff4d7d",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "25px",
              border: "1px solid rgba(255, 77, 125, 0.3)",
              fontSize: "15px"
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "18px", color: "var(--text2)" }}>Analyzing academic metrics & AI model states...</div>
          </div>
        ) : !initialized ? (
          /* Awaiting Initialization UI State */
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <div className="card" style={{ borderLeft: "4px solid var(--yellow)" }}>
              <h2 style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "var(--yellow)", fontSize: "28px" }}>⚠️</span> 
                Academic Profile Uninitialized
              </h2>
              <p style={{ color: "var(--text2)", fontSize: "15px", lineHeight: "1.6" }}>
                Welcome to the platform! Your academic profiles, batch alignment, and performance metrics are currently awaiting initialization by an administrator or your assigned mentor.
              </p>
              <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
                <button className="btn btn-primary" onClick={fetchLearnerData} style={{ padding: "10px 20px", fontSize: "14px" }}>
                  Refresh Profile
                </button>
              </div>
            </div>

            <div className="card">
              <h2 style={{ marginBottom: "20px" }}>Your Registration Info</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                <div>
                  <div style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "4px" }}>Full Name</div>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>{userName}</div>
                </div>
                <div>
                  <div style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "4px" }}>Email Address</div>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>{userEmail}</div>
                </div>
                <div>
                  <div style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "4px" }}>Platform ID</div>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>#{userId}</div>
                </div>
                <div>
                  <div style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "4px" }}>User Role</div>
                  <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--primary)" }}>Learner</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Initialized Dashboard UI State */
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            
            {/* Top Grid - Profile Header Info & Stats Summary */}
            <div className="two-grid">
              
              {/* Profile details card */}
              <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ marginBottom: "20px" }}>Academic Profile</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #1c2042", paddingBottom: "10px" }}>
                      <span style={{ color: "var(--text2)" }}>Name:</span>
                      <span style={{ fontWeight: "600" }}>{userName}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #1c2042", paddingBottom: "10px" }}>
                      <span style={{ color: "var(--text2)" }}>Email:</span>
                      <span style={{ fontWeight: "600" }}>{userEmail}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #1c2042", paddingBottom: "10px" }}>
                      <span style={{ color: "var(--text2)" }}>Assigned Batch:</span>
                      <span style={{ fontWeight: "700", color: "var(--primary)" }}>{learner?.batch || "N/A"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px" }}>
                      <span style={{ color: "var(--text2)" }}>Mentor ID:</span>
                      <span style={{ fontWeight: "600" }}>#{learner?.mentorId || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                  <span className="badge badge-green" style={{ padding: "8px 16px" }}>Active Account</span>
                  <span className="badge badge-yellow" style={{ padding: "8px 16px" }}>ID #{userId}</span>
                </div>
              </div>

              {/* Dynamic Statistics summary cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div className="stat-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div className="stat-num" style={{ color: (learner?.attendance || 0) < 75 ? "var(--red)" : "var(--primary)" }}>
                    {learner?.attendance || 0}%
                  </div>
                  <div className="stat-label">Attendance Record</div>
                </div>

                <div className="stat-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div className="stat-num" style={{ color: "var(--green)" }}>
                    {learner ? Math.round(((learner.codingScore || 0) + (learner.aptitudeScore || 0) + (learner.communicationScore || 0)) / 3) : 0}
                  </div>
                  <div className="stat-label">Average Skill Score</div>
                </div>
              </div>

            </div>

            {/* Middle Section: Scores Matrix vs AI Placement Readiness */}
            <div className="two-grid">
              
              {/* Skill Scores Progress matrix */}
              <div className="card">
                <h2 style={{ marginBottom: "24px" }}>Skill Scores Matrix</h2>
                
                {/* Attendance Metric */}
                <div className="metric-row">
                  <div className="metric-row-top">
                    <span style={{ fontWeight: "600" }}>Attendance Standing</span>
                    <span style={{ fontWeight: "700", color: (learner?.attendance || 0) < 75 ? "var(--red)" : "var(--green)" }}>
                      {learner?.attendance || 0}%
                    </span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar purple"
                      style={{ width: `${learner?.attendance || 0}%`, transition: "width 1s ease-in-out" }}
                    ></div>
                  </div>
                </div>

                {/* Coding Score Metric */}
                <div className="metric-row">
                  <div className="metric-row-top">
                    <span style={{ fontWeight: "600" }}>Coding Proficiency</span>
                    <span style={{ fontWeight: "700", color: "var(--primary)" }}>
                      {learner?.codingScore || 0} / 100
                    </span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar blue"
                      style={{ width: `${learner?.codingScore || 0}%`, transition: "width 1s ease-in-out" }}
                    ></div>
                  </div>
                </div>

                {/* Aptitude Score Metric */}
                <div className="metric-row">
                  <div className="metric-row-top">
                    <span style={{ fontWeight: "600" }}>Aptitude & Problem Solving</span>
                    <span style={{ fontWeight: "700", color: "var(--yellow)" }}>
                      {learner?.aptitudeScore || 0} / 100
                    </span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar yellow"
                      style={{ width: `${learner?.aptitudeScore || 0}%`, transition: "width 1s ease-in-out" }}
                    ></div>
                  </div>
                </div>

                {/* Communication Score Metric */}
                <div className="metric-row">
                  <div className="metric-row-top">
                    <span style={{ fontWeight: "600" }}>Soft Skills & Communication</span>
                    <span style={{ fontWeight: "700", color: "var(--green)" }}>
                      {learner?.communicationScore || 0} / 100
                    </span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar green"
                      style={{ width: `${learner?.communicationScore || 0}%`, transition: "width 1s ease-in-out" }}
                    ></div>
                  </div>
                </div>

              </div>

              {/* AI Placement Readiness predictor card */}
              <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ marginBottom: "20px" }}>AI Placement Readiness</h2>
                  
                  {prediction ? (
                    (() => {
                      const config = getReadinessConfig(prediction.readinessScore || 0);
                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                          
                          {/* Giant score display */}
                          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                            <div 
                              style={{ 
                                fontSize: "64px", 
                                fontWeight: "800", 
                                color: config.color,
                                borderRight: "1px solid var(--border)",
                                paddingRight: "24px",
                                lineHeight: "1"
                              }}
                            >
                              {prediction.readinessScore || 0}%
                            </div>
                            <div>
                              <span className={`badge ${config.badgeClass}`} style={{ padding: "6px 14px", fontSize: "14px", marginBottom: "8px" }}>
                                {config.label}
                              </span>
                              <div style={{ color: "var(--text2)", fontSize: "13px", lineHeight: "1.4" }}>
                                Calculated by AI Predictive Model
                              </div>
                            </div>
                          </div>

                          <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: "1.6", marginTop: "10px" }}>
                            {config.desc}
                          </p>

                          {/* Recommendation Card */}
                          <div 
                            style={{ 
                              background: "rgba(108, 99, 255, 0.05)", 
                              border: "1px dashed var(--primary)",
                              borderRadius: "12px",
                              padding: "16px",
                              marginTop: "10px"
                            }}
                          >
                            <h4 style={{ color: "var(--primary)", fontSize: "14px", fontWeight: "700", marginBottom: "6px" }}>
                              🚀 AI Recommendation
                            </h4>
                            <p style={{ color: "var(--text)", fontSize: "13.5px", lineHeight: "1.5", fontStyle: "italic" }}>
                              "{prediction.recommendation || "Maintain your score thresholds to remain placement-ready."}"
                            </p>
                          </div>

                        </div>
                      );
                    })()
                  ) : (
                    <div style={{ padding: "30px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: "42px", marginBottom: "15px" }}>🤖</div>
                      <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>AI Assessment Awaiting Data</h4>
                      <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: "1.5" }}>
                        Placement models are prepared. The ML model requires an updated analytics compile to predict your placement index. Please coordinate with your mentor to initiate predictive analysis.
                      </p>
                    </div>
                  )}

                </div>
                
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "15px", marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "var(--text2)" }}>FastAPI Predictive Models: Active</span>
                  <span style={{ fontSize: "12px", color: "var(--green)" }}>● Fully Synced</span>
                </div>
              </div>

            </div>

            {/* Bottom Section: Mentor Feedback Timeline logs */}
            <div className="card">
              <h2 style={{ marginBottom: "20px" }}>Mentor Feedback Logs</h2>
              {feedbackList.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <p style={{ color: "var(--text2)", fontSize: "15px" }}>No soft skills or performance feedback logs registered by your mentor yet.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {feedbackList.map((feedback, idx) => (
                    <div
                      key={feedback.feedbackId || idx}
                      style={{
                        background: "#161933",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        padding: "20px",
                        position: "relative"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <span style={{ fontWeight: "700", color: "var(--primary)", fontSize: "14px" }}>
                          FEEDBACK LOG #{feedback.feedbackId}
                        </span>
                        <span className="badge badge-green" style={{ fontSize: "11px" }}>
                          Mentor ID #{feedback.mentorId}
                        </span>
                      </div>
                      <p style={{ color: "var(--text)", fontSize: "14.5px", lineHeight: "1.6", fontStyle: "normal" }}>
                        {feedback.comments}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </>
  );
}

export default LearnerDashboard;
