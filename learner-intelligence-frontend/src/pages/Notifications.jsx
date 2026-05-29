import Navbar from "../components/Navbar";

function Notifications() {
  const role = localStorage.getItem("role");

  // Dynamic notifications based on role
  const adminNotifications = [
    {
      title: "Placement Model Ready",
      description: "FastAPI server Random Forest Model successfully retrained locally and validated for compilation.",
      time: "Just now",
      badge: "badge-green",
      status: "Verified"
    },
    {
      title: "Batch CSV import complete",
      description: "Batch CSV parsing engine successfully uploaded and populated learner records in MySQL database.",
      time: "2 hours ago",
      badge: "badge-green",
      status: "Success"
    },
    {
      title: "Student scoring metrics loaded",
      description: "Top Achievers and Weak Learners metrics populated on the analytics registry.",
      time: "4 hours ago",
      badge: "badge-yellow",
      status: "Sync"
    }
  ];

  const mentorNotifications = [
    {
      title: "System Ready",
      description: "Mentor portals and Assessment logging APIs active and bound to database.",
      time: "Just now",
      badge: "badge-green",
      status: "Online"
    },
    {
      title: "Assessment metrics loaded",
      description: "Logged test scores have successfully refreshed in the placement analytics registry.",
      time: "1 hour ago",
      badge: "badge-green",
      status: "Updated"
    },
    {
      title: "Soft skills criteria modified",
      description: "Pydantic schema constraints relaxed on soft skills inputs to safely support null values.",
      time: "1 day ago",
      badge: "badge-yellow",
      status: "Updated"
    }
  ];

  const activeNotifications = role === "ADMIN" ? adminNotifications : mentorNotifications;

  return (
    <>
      <Navbar />

      <div className="screen">
        <div className="section-title">Timeline Notifications</div>
        <div className="section-sub">
          Dynamic notifications and system logs for the LearnerIQ Platform
        </div>

        <div className="card" style={{ padding: "0" }}>
          {activeNotifications.map((notif, index) => (
            <div
              key={index}
              className="notification"
              style={{
                borderBottom: index === activeNotifications.length - 1 ? "none" : "1px solid #24284a",
                padding: "24px"
              }}
            >
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "6px" }}>{notif.title}</h3>
                <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: "1.5" }}>{notif.description}</p>
              </div>

              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                <span className={`badge ${notif.badge}`} style={{ fontSize: "12px", padding: "4px 10px" }}>
                  {notif.status}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text2)" }}>{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Notifications;