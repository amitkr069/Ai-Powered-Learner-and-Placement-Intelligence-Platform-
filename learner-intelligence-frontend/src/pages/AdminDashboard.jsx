import Navbar from "../components/Navbar";

function AdminDashboard() {

  return (
    <>
      <Navbar />

      <div className="screen">

        <div className="section-title">
          Admin Dashboard
        </div>

        <div className="section-sub">
          Overview of all learners, mentors and placements
        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-num">520</div>
            <div className="stat-label">Total Learners</div>
          </div>

          <div className="stat-card">
            <div className="stat-num">320</div>
            <div className="stat-label">Placement Ready</div>
          </div>

          <div className="stat-card">
            <div className="stat-num">18</div>
            <div className="stat-label">Active Mentors</div>
          </div>

          <div className="stat-card">
            <div className="stat-num">94%</div>
            <div className="stat-label">Avg Attendance</div>
          </div>

        </div>

        <div className="two-grid">

          <div className="card">

            <h2 style={{marginBottom:"20px"}}>
              Batch Overview
            </h2>

            <table>

              <thead>
                <tr>
                  <th>Batch</th>
                  <th>Learners</th>
                  <th>Ready</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>JAVA_FS_2026</td>
                  <td>180</td>
                  <td>112</td>
                  <td>
                    <span className="badge badge-green">
                      Active
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>REACT_2026</td>
                  <td>140</td>
                  <td>98</td>
                  <td>
                    <span className="badge badge-green">
                      Active
                    </span>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

          <div className="card">

            <h2 style={{marginBottom:"20px"}}>
              Placement Trend
            </h2>

            <div style={{
              height:"300px",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              color:"#7f87c1"
            }}>
              Chart Area
            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default AdminDashboard;