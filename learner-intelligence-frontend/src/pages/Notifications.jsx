import Navbar from "../components/Navbar";

function Notifications() {

  return (
    <>
      <Navbar />

      <div className="screen">

        <div className="section-title">
          Notifications
        </div>

        <div className="card">

          <p>New assessment assigned</p>

          <br />

          <p>Scores updated</p>

          <br />

          <p>Prediction generated</p>

        </div>

      </div>
    </>
  );
}

export default Notifications;