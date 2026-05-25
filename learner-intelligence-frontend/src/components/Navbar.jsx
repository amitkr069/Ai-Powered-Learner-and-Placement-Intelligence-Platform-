import { Link } from "react-router-dom";

function Navbar() {

  return (
    <nav className="nav">

      <div className="nav-brand">
        Learner<span>IQ</span>
      </div>

      <Link className="tab" to="/admin">
        Dashboard
      </Link>

      <Link className="tab" to="/add-learner">
        Add Learner
      </Link>

      <Link className="tab" to="/csv-upload">
        CSV Upload
      </Link>

      <Link className="tab" to="/mentor">
        Mentor
      </Link>

      <Link className="tab" to="/assessment">
        Assessment
      </Link>

      <Link className="tab" to="/prediction">
        Prediction
      </Link>

      <Link className="tab" to="/analytics">
        Analytics
      </Link>

      <Link className="tab" to="/notifications">
        Notifications
      </Link>

    </nav>
  );
}

export default Navbar;