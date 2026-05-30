import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

function Analytics() {
  const [topLearners, setTopLearners] = useState([]);
  const [batchPerformance, setBatchPerformance] = useState([]);
  const [weakLearners, setWeakLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");
  const mentorId = localStorage.getItem("mentorId");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      // Mentor passes their mentorId; admin passes nothing (sees all)
      const mentorParam = (role === "MENTOR" && mentorId) ? `?mentorId=${mentorId}` : "";

      const [topRes, batchRes, weakRes] = await Promise.all([
        api.get(`/analytics/top${mentorParam}`),
        api.get(`/analytics/batch-performance${mentorParam}`),
        api.get(`/analytics/weak${mentorParam}`)
      ]);

      // Top learners — data from DB (uses learnerId, codingScore etc.)
      setTopLearners(topRes.data?.data || []);

      // Batch performance — convert {batchName: avgScore} to chart format
      const batchData = batchRes.data?.data || {};
      const formattedBatch = Object.entries(batchData).map(([batchName, avgScore]) => ({
        name: batchName,
        "Average Score": Math.round(avgScore)
      }));
      setBatchPerformance(formattedBatch);

      // Weak learners
      setWeakLearners(weakRes.data?.data || []);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to load analytics. Please make sure the Spring Boot backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, []);

  const isAdmin = role === "ADMIN";

  return (
    <>
      <Navbar />
      <div className="screen">
        <div className="section-title">Analytics Intelligence Dashboard</div>
        <div className="section-sub" style={{ marginBottom: "25px" }}>
          {isAdmin
            ? "Complete analytics across all learners and batches"
            : "Analytics for your assigned learners only"}
        </div>

        {error && (
          <div style={{ background: "rgba(255,77,125,0.15)", color: "#ff4d7d", padding: "16px", borderRadius: "12px", marginBottom: "25px", border: "1px solid rgba(255,77,125,0.3)", fontSize: "15px" }}>
            {error}
          </div>
        )}

        {/* Overview Stats */}
        <div className="stats-grid" style={{ marginBottom: "25px" }}>
          <div className="stat-card">
            <div className="stat-num" style={{ color: "#00e38c" }}>{loading ? "..." : topLearners.length}</div>
            <div className="stat-label">Top Performers</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: "#ffb800" }}>{loading ? "..." : batchPerformance.length}</div>
            <div className="stat-label">Batches Analyzed</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: weakLearners.length > 0 ? "#ff4d7d" : "#fff" }}>
              {loading ? "..." : weakLearners.length}
            </div>
            <div className="stat-label">At Risk (Coding &lt; 50)</div>
          </div>
        </div>

        {/* Charts */}
        <div className="two-grid" style={{ marginBottom: "25px" }}>
          <div className="card">
            <h2 style={{ marginBottom: "20px" }}>Average Coding Score by Batch</h2>
            <div style={{ width: "100%", height: "280px" }}>
              {loading ? (
                <div className="chart-box">Loading batch data...</div>
              ) : batchPerformance.length === 0 ? (
                <div className="chart-box">No batch data available yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={batchPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#25294a" />
                    <XAxis dataKey="name" stroke="#9ca3d5" />
                    <YAxis stroke="#9ca3d5" domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "#111325", borderColor: "#25294a", borderRadius: "8px", color: "#fff" }} />
                    <Legend />
                    <Bar dataKey="Average Score" fill="#6c63ff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: "20px" }}>Risk Radar: Weak Learners (Coding &lt; 50)</h2>
            <div style={{ width: "100%", height: "280px" }}>
              {loading ? (
                <div className="chart-box">Identifying at-risk profiles...</div>
              ) : weakLearners.length === 0 ? (
                <div className="chart-box" style={{ color: "#00e38c" }}>No at-risk students! Excellent work. 🎉</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weakLearners.map((item) => ({
                    name: item.name ? item.name.split(" ")[0] : `#${item.learnerId}`,
                    "Coding Score": item.codingScore
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#25294a" />
                    <XAxis dataKey="name" stroke="#9ca3d5" />
                    <YAxis stroke="#9ca3d5" domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "#111325", borderColor: "#25294a", borderRadius: "8px", color: "#fff" }} />
                    <Legend />
                    <Bar dataKey="Coding Score" fill="#ff4d7d" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Top Performers Table */}
        <div className="card">
          <h2 style={{ marginBottom: "20px" }}>Top 5 Performers Registry</h2>
          {loading ? (
            <p style={{ color: "#9ca3d5" }}>Loading top performers...</p>
          ) : topLearners.length === 0 ? (
            <p style={{ color: "#9ca3d5" }}>No learners with complete scores yet. Mentors need to update scores first.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Learner ID</th>
                    <th>Name</th>
                    <th>Batch</th>
                    <th>Attendance</th>
                    <th>Coding</th>
                    <th>Aptitude</th>
                    <th>Communication</th>
                  </tr>
                </thead>
                <tbody>
                  {topLearners.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: "700", color: "#ffb800" }}>🌟 #{item.learnerId}</td>
                      <td>{item.name}</td>
                      <td>{item.batch}</td>
                      <td style={{ fontWeight: "600", color: "#00e38c" }}>{item.attendance}%</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div className="progress" style={{ width: "60px", display: "inline-block" }}>
                            <div className="progress-bar blue" style={{ width: `${item.codingScore}%` }}></div>
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: "600" }}>{item.codingScore}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div className="progress" style={{ width: "60px", display: "inline-block" }}>
                            <div className="progress-bar yellow" style={{ width: `${item.aptitudeScore}%` }}></div>
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: "600" }}>{item.aptitudeScore}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div className="progress" style={{ width: "60px", display: "inline-block" }}>
                            <div className="progress-bar green" style={{ width: `${item.communicationScore}%` }}></div>
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: "600" }}>{item.communicationScore}</span>
                        </div>
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

export default Analytics;