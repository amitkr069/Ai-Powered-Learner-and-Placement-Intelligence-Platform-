import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function CsvUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a valid CSV file to upload.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/api/learners/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage(response.data || "CSV file uploaded and parsed successfully!");
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to upload CSV file. Please make sure it matches the required schema."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="screen">
        <div className="section-title">CSV Upload</div>
        <div className="section-sub">
          Batch import multiple learners directly from a CSV file
        </div>

        <form className="card" onSubmit={handleUpload}>
          {message && (
            <div
              style={{
                background: "rgba(0, 227, 140, 0.15)",
                color: "#00e38c",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "20px",
                fontSize: "14px",
                border: "1px solid rgba(0, 227, 140, 0.3)"
              }}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "rgba(255, 77, 125, 0.15)",
                color: "#ff4d7d",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "20px",
                fontSize: "14px",
                border: "1px solid rgba(255, 77, 125, 0.3)"
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              border: file ? "2px dashed #00e38c" : "2px dashed var(--border)",
              padding: "50px",
              borderRadius: "16px",
              textAlign: "center",
              background: "#181c36",
              cursor: "pointer",
              transition: "0.2s"
            }}
            onClick={() => document.getElementById("csvFileInput").click()}
          >
            <input
              id="csvFileInput"
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={loading}
            />
            {file ? (
              <div>
                <p style={{ fontSize: "18px", color: "#00e38c", fontWeight: "600", marginBottom: "8px" }}>
                  Selected File: {file.name}
                </p>
                <p style={{ fontSize: "14px", color: "var(--text2)" }}>
                  Click again to change file (Size: {Math.round(file.size / 1024)} KB)
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                  Click to select CSV File
                </p>
                <p style={{ fontSize: "14px", color: "var(--text2)" }}>
                  Required columns: batch, mentorId, attendance, codingScore, aptitudeScore, communicationScore
                </p>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || !file}
            >
              {loading ? "Processing Upload..." : "Upload & Parse Batch"}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => navigate("/admin")}
              style={{ background: "#25294a", color: "#fff" }}
              disabled={loading}
            >
              Back to Registry
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CsvUpload;