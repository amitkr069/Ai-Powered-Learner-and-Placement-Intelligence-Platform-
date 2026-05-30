import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/register", { name, email, password });
      setSuccess("Account registered successfully! Redirecting to login...");
      setName("");
      setEmail("");
      setPassword("");
      setTimeout(() => navigate("/", { replace: true }), 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed. Email might already exist."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={handleSignup} style={{ padding: "36px" }}>
        <div className="login-logo">
          Learner<span>IQ</span>
        </div>

        <div className="login-tagline">
          Create Your Learner Account
        </div>

        <div
          style={{
            background: "rgba(108, 99, 255, 0.08)",
            border: "1px solid rgba(108, 99, 255, 0.25)",
            borderRadius: "8px",
            padding: "10px 14px",
            marginBottom: "20px",
            fontSize: "13px",
            color: "var(--text2)",
            textAlign: "center"
          }}
        >
          🎓 Learner registration only — Admins & Mentors are added by the platform
        </div>

        {error && (
          <div
            style={{
              background: "rgba(255, 77, 125, 0.15)",
              color: "#ff4d7d",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              textAlign: "center",
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
              textAlign: "center",
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
            placeholder="John Doe"
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
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || !!success}
            required
          />
        </div>

        <div className="form-row">
          <label>Password *</label>
          <input
            className="form-input"
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || !!success}
            required
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          style={{ width: "100%", marginTop: "16px", marginBottom: "16px" }}
          disabled={loading || !!success}
        >
          {loading ? "Registering..." : "Create Learner Account"}
        </button>

        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text2)" }}>
          Already have an account?{" "}
          <span
            onClick={() => !loading && !success && navigate("/")}
            style={{
              color: "var(--primary)",
              cursor: "pointer",
              fontWeight: "600",
              textDecoration: "underline"
            }}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
