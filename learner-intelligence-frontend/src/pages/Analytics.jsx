import Navbar from "../components/Navbar";

function Analytics() {

  return (
    <>
      <Navbar />

      <div className="screen">

        <div className="section-title">
          Analytics Dashboard
        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-num">61%</div>

            <div className="stat-label">
              Placement Rate
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-num">94%</div>

            <div className="stat-label">
              Attendance
            </div>
          </div>

        </div>

      </div>
    </>
  );
}

export default Analytics;