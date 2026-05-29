import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";

// Global socket connection to prevent reconnects on re-renders
const socket = io("http://localhost:3001", { autoConnect: false });

function Notifications() {
  const role = localStorage.getItem("role") || "";
  const userId = role === "MENTOR" ? localStorage.getItem("mentorId") : localStorage.getItem("id");

  const [liveNotifications, setLiveNotifications] = useState([]);

  // Static fallback notifications as requested
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

  const initialMentorNotifications = [
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

  const initialLearnerNotifications = [
    {
      title: "Scores Updated",
      description: "Your mentor has updated your attendance and assessment scores.",
      time: "2 hours ago",
      badge: "badge-green",
      status: "Synced"
    },
    {
      title: "Feedback Shared",
      description: "A new soft skills and behavioral assessment feedback is available.",
      time: "1 day ago",
      badge: "badge-yellow",
      status: "New"
    }
  ];

  useEffect(() => {
    // Initialize state with static history for non-admins
    if (role === "MENTOR") setLiveNotifications(initialMentorNotifications);
    if (role === "LEARNER") setLiveNotifications(initialLearnerNotifications);

    // Admin stays static, no socket connection needed
    if (role === "ADMIN") return;

    // Connect socket for Mentors and Learners
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to notification service");
      socket.emit("register", { role, id: userId });
    });

    socket.on("notification", (newNotif) => {
      setLiveNotifications((prev) => [newNotif, ...prev]);
    });

    return () => {
      socket.off("connect");
      socket.off("notification");
      socket.disconnect();
    };
  }, [role, userId]);

  const activeNotifications = role === "ADMIN" ? adminNotifications : liveNotifications;

  return (
    <>
      <Navbar />

      <div className="screen">
        <div className="section-title">Timeline Notifications</div>
        <div className="section-sub">
          Dynamic notifications and system logs for the LearnerIQ Platform
          {role !== "ADMIN" && <span style={{color:"#00e38c", marginLeft:"10px"}}>● Live</span>}
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