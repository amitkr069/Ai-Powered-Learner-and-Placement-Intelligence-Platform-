import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    localStorage.removeItem("userId");
    navigate("/", { replace: true });
  };

  return (
    <nav className="nav">
      <div className="nav-brand" style={{ cursor: "pointer" }} onClick={() => navigate(role === "ADMIN" ? "/admin" : role === "MENTOR" ? "/mentor" : "/learner")}>
        Learner<span>IQ</span>
      </div>

      {role === "ADMIN" && (
        <>
          <Link className="tab" to="/admin">
            Dashboard
          </Link>
          <Link className="tab" to="/add-learner">
            Add Learner
          </Link>
          <Link className="tab" to="/csv-upload">
            CSV Upload
          </Link>
          <Link className="tab" to="/prediction">
            Prediction
          </Link>
        </>
      )}

      {role === "MENTOR" && (
        <>
          <Link className="tab" to="/mentor">
            Mentor Dashboard
          </Link>
          <Link className="tab" to="/assessment">
            Assessment
          </Link>
        </>
      )}

      {role === "LEARNER" && (
        <Link className="tab" to="/learner">
          Learner Dashboard
        </Link>
      )}

      <Link className="tab" to="/analytics">
        Analytics
      </Link>
      <Link className="tab" to="/notifications">
        Notifications
      </Link>

      <button
        onClick={handleLogout}
        className="tab"
        style={{
          marginLeft: "auto",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#ff4d7d",
          fontWeight: "600"
        }}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;