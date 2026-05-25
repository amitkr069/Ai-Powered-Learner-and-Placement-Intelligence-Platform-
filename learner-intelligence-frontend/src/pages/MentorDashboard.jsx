import Navbar from "../components/Navbar";

function MentorDashboard() {

  return (
    <>
      <Navbar />

      <div className="screen">

        <div className="section-title">
          Mentor Dashboard
        </div>

        <div className="section-sub">
          View learner scores and prediction status
        </div>

        <div className="card">

          <table>

            <thead>
              <tr>
                <th>Learner</th>
                <th>Coding</th>
                <th>Communication</th>
                <th>Prediction</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              <tr>

                <td>Rahul Sharma</td>

                <td>
                  <div className="progress">
                    <div
                      className="progress-bar blue"
                      style={{width:"75%"}}
                    ></div>
                  </div>
                </td>

                <td>
                  <div className="progress">
                    <div
                      className="progress-bar green"
                      style={{width:"70%"}}
                    ></div>
                  </div>
                </td>

                <td>
                  <span className="badge badge-green">
                    87% Ready
                  </span>
                </td>

                <td>
                  <button className="btn btn-warning">
                    Update
                  </button>
                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}

export default MentorDashboard;