import Navbar from "../components/Navbar";

function AddLearner() {

  return (
    <>
      <Navbar />

      <div className="screen">

        <div className="section-title">
          Add Learner
        </div>

        <div className="card">

          <div className="input-group">

            <div className="form-row">

              <label>Full Name</label>

              <input
                className="form-input"
                placeholder="Rahul Sharma"
              />

            </div>

            <div className="form-row">

              <label>Email</label>

              <input
                className="form-input"
                placeholder="rahul@gmail.com"
              />

            </div>

          </div>

          <div className="input-group">

            <div className="form-row">

              <label>Batch</label>

              <select className="form-select">
                <option>JAVA_FS_2026</option>
              </select>

            </div>

            <div className="form-row">

              <label>Mentor</label>

              <select className="form-select">
                <option>John Mentor</option>
              </select>

            </div>

          </div>

          <button className="btn btn-success">
            Save Learner
          </button>

        </div>

      </div>
    </>
  );
}

export default AddLearner;