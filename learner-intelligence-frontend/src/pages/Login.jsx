import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  return (
    <div className="login-wrap">

      <div className="card login-card">

        <div className="login-logo">
          Learner<span>IQ</span>
        </div>

        <div className="login-tagline">
          AI Powered Placement Intelligence
        </div>

        <div className="form-row">

          <label>Email</label>

          <input
            className="form-input"
            type="email"
            placeholder="admin@gmail.com"
          />

        </div>

        <div className="form-row">

          <label>Password</label>

          <input
            className="form-input"
            type="password"
            placeholder="******"
          />

        </div>

        <button
          className="btn btn-primary"
          style={{width:"100%"}}
          onClick={() => navigate("/admin")}
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;