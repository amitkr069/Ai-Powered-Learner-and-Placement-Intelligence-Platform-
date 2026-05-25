import Navbar from "../components/Navbar";

function CsvUpload() {

  return (
    <>
      <Navbar />

      <div className="screen">

        <div className="section-title">
          CSV Upload
        </div>

        <div className="card">

          <div
            style={{
              border: "2px dashed gray",
              padding: "50px",
              borderRadius: "10px",
              textAlign: "center"
            }}
          >
            Upload CSV File
          </div>

          <br />

          <button className="btn btn-primary">
            Upload
          </button>

        </div>

      </div>
    </>
  );
}

export default CsvUpload;