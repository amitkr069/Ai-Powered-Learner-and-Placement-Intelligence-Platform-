import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AddMentor() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState("JAVA_FS_2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Name, email, and password are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/api/mentors", { name, email, password, batch });
      setSuccess(`Mentor "${name}" added successfully!`);
      setName("");
      setEmail("");
      setPassword("");
      setTimeout(() => navigate("/admin"), 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to add mentor. Email might already exist."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="screen">
        <div className="section-title">Add Mentor</div>
        <div className="section-sub" style={{ marginBottom: "20px" }}>
          Create a new mentor account. Mentors can log in with the credentials you set here.
        </div>

        <form className="card" onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
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

          <div className="form-row">
            <label>Full Name *</label>
            <input
              className="form-input"
              type="text"
              placeholder="Mentor Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || !!success}
              required
            />
          </div>

          <div className="form-row">
            <label>Email Address *</label>
            <input
              className="form-input"
              type="email"
              placeholder="mentor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || !!success}
              required
            />
          </div>

          <div className="form-row">
            <label>Login Password *</label>
            <input
              className="form-input"
              type="password"
              placeholder="Set a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || !!success}
              required
            />
          </div>

          <div className="form-row">
            <label>Assigned Batch</label>
            <select
              className="form-select"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              disabled={loading || !!success}
            >
              <option value="JAVA_FS_2026">JAVA_FS_2026</option>
              <option value="REACT_2026">REACT_2026</option>
              <option value="PYTHON_ML_2026">PYTHON_ML_2026</option>
              <option value="DATA_ENG_2026">DATA_ENG_2026</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <button
              className="btn btn-success"
              type="submit"
              disabled={loading || !!success}
            >
              {loading ? "Adding Mentor..." : "Add Mentor"}
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

export default AddMentor;
