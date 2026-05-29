import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clear stale session items when user visits the login screen
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, role, name, email: userEmail } = response.data;

      if (!token) {
        throw new Error("Authentication failed: No token returned.");
      }

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role.toUpperCase());
      localStorage.setItem("name", name || "");
      localStorage.setItem("email", userEmail || "");

      // Redirect depending on user role
      if (role.toUpperCase() === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (role.toUpperCase() === "MENTOR") {
        navigate("/mentor", { replace: true });
      } else {
        setError(`Unauthorized access: unknown role ${role}`);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        err.response?.data || 
        "Invalid email or password!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={handleLogin}>
        <div className="login-logo">
          Learner<span>IQ</span>
        </div>

        <div className="login-tagline">
          AI Powered Placement Intelligence
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

        <div className="form-row">
          <label>Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label>Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          style={{ width: "100%", marginTop: "10px" }}
          disabled={loading}
        >
          {loading ? "Authenticating..." : "Login"}
        </button>

        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text2)", marginTop: "20px" }}>
          Don't have an account?{" "}
          <span
            onClick={() => !loading && navigate("/signup")}
            style={{
              color: "var(--primary)",
              cursor: "pointer",
              fontWeight: "600",
              textDecoration: "underline"
            }}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;