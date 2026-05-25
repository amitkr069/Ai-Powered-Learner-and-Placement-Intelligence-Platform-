import Navbar from "../components/Navbar";

function Prediction() {

  return (
    <>
      <Navbar />

      <div className="screen">

        <div className="section-title">
          AI Prediction
        </div>

        <div className="card">

          <h1>87%</h1>

          <p>Placement Ready</p>

          <button className="btn btn-primary">
            Generate Prediction
          </button>

        </div>

      </div>
    </>
  );
}

export default Prediction;