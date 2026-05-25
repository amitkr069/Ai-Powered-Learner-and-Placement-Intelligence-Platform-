import Navbar from "../components/Navbar";

function Assessment() {

  return (
    <>
      <Navbar />

      <div className="screen">

        <div className="section-title">
          Assessment
        </div>

        <div className="card">

          <div className="form-row">

            <label>Assessment Type</label>

            <select className="form-select">
              <option>Coding Test</option>
            </select>

          </div>

          <div className="form-row">

            <label>Total Marks</label>

            <input
              className="form-input"
              placeholder="100"
            />

          </div>

          <button className="btn btn-primary">
            Create Assessment
          </button>

        </div>

      </div>
    </>
  );
}

export default Assessment;