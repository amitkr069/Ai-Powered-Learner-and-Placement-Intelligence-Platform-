import { useState, useEffect } from "react";
import api from "../services/api";

function FeedbackModal({ learner, isOpen, onClose }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editFeedbackId, setEditFeedbackId] = useState(null);
  const [editComments, setEditComments] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Retrieve logged-in user id and role
  const rawId = localStorage.getItem("id") || localStorage.getItem("userId");
  const mentorId = rawId ? parseInt(rawId) : 1; // Fallback to 1 if not set
  const role = localStorage.getItem("role") || "MENTOR";

  const fetchFeedbacks = async () => {
    if (!learner) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/api/feedback/learner/${learner.learnerId}`);
      setFeedbacks(response.data || []);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // Safe and clean empty state handling for backend 404
        setFeedbacks([]);
      } else {
        console.error(err);
        setError("Failed to fetch feedback logs.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFeedbacks();
      setComments("");
      setEditFeedbackId(null);
      setEditComments("");
      setError("");
    }
  }, [isOpen, learner]);

  if (!isOpen || !learner) return null;

  const handleAddFeedback = async (e) => {
    e.preventDefault();
    if (!comments.trim()) return;

    setActionLoading(true);
    setError("");

    try {
      const payload = {
        mentorId: mentorId,
        learnerId: learner.learnerId,
        comments: comments.trim()
      };

      const response = await api.post("/api/feedback", payload);
      setFeedbacks([...feedbacks, response.data]);
      setComments("");
    } catch (err) {
      console.error(err);
      setError("Failed to post feedback comment.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (fb) => {
    setEditFeedbackId(fb.feedbackId);
    setEditComments(fb.comments);
  };

  const handleCancelEdit = () => {
    setEditFeedbackId(null);
    setEditComments("");
  };

  const handleUpdateFeedback = async (e, feedbackId) => {
    e.preventDefault();
    if (!editComments.trim()) return;

    setActionLoading(true);
    setError("");

    try {
      const payload = {
        feedbackId: feedbackId,
        mentorId: mentorId,
        learnerId: learner.learnerId,
        comments: editComments.trim()
      };

      const response = await api.put(`/api/feedback/${feedbackId}`, payload);
      setFeedbacks(
        feedbacks.map((f) => (f.feedbackId === feedbackId ? response.data : f))
      );
      setEditFeedbackId(null);
      setEditComments("");
    } catch (err) {
      console.error(err);
      setError("Failed to update feedback comment.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this feedback comment?")) {
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      await api.delete(`/api/feedback/${feedbackId}`);
      setFeedbacks(feedbacks.filter((f) => f.feedbackId !== feedbackId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete feedback comment.");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to generate initials for avatar
  const getAvatarInitials = (id) => {
    return `M${id}`;
  };

  // Helper to generate different avatar gradients based on ID
  const getAvatarBg = (id) => {
    const gradients = [
      "linear-gradient(135deg, #6c63ff, #8f85ff)",
      "linear-gradient(135deg, #ffb800, #ffc73c)",
      "linear-gradient(135deg, #00e38c, #3cffb3)",
      "linear-gradient(135deg, #ff4d7d, #ff7ba0)",
      "linear-gradient(135deg, #9b00ff, #c261ff)"
    ];
    return gradients[id % gradients.length];
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(7, 8, 22, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1100,
        backdropFilter: "blur(6px)",
        padding: "20px"
      }}
    >
      <div
        className="card"
        style={{
          width: "600px",
          maxWidth: "100%",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.6)",
          border: "1px solid var(--border)",
          animation: "fadeIn 0.25s",
          padding: "0px",
          borderRadius: "20px",
          overflow: "hidden",
          background: "#111325"
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "24px 28px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(25, 29, 66, 0.3)"
          }}
        >
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>
              Learner Observations
            </h2>
            <p style={{ color: "var(--text2)", fontSize: "14px", marginTop: "4px" }}>
              Viewing notes and feedback for Student <span style={{ color: "var(--primary)", fontWeight: "600" }}>#{learner.learnerId}</span> (Batch: {learner.batch})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "none",
              color: "var(--text2)",
              fontSize: "20px",
              cursor: "pointer",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 77, 125, 0.15)";
              e.currentTarget.style.color = "#ff4d7d";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.color = "var(--text2)";
            }}
          >
            &times;
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            style={{
              background: "rgba(255, 77, 125, 0.12)",
              color: "#ff4d7d",
              padding: "12px 24px",
              fontSize: "14px",
              borderBottom: "1px solid rgba(255, 77, 125, 0.2)"
            }}
          >
            {error}
          </div>
        )}

        {/* Feedback List Container */}
        <div
          style={{
            flex: "1",
            overflowY: "auto",
            padding: "28px",
            minHeight: "220px",
            background: "#0c0d1c"
          }}
        >
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "180px", color: "var(--text2)" }}>
              <span style={{ fontSize: "15px" }}>Loading feedback records...</span>
            </div>
          ) : feedbacks.length === 0 ? (
            /* Beautiful empty state */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "180px",
                textAlign: "center",
                padding: "20px"
              }}
            >
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "50%",
                  background: "rgba(108, 99, 255, 0.1)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "var(--primary)",
                  fontSize: "22px",
                  marginBottom: "16px"
                }}
              >
                💬
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>No feedback recorded yet</h3>
              <p style={{ color: "var(--text2)", fontSize: "13px", maxWidth: "340px", lineHeight: "1.4" }}>
                There are no performance notes logged for this learner. Share your mentorship observations below!
              </p>
            </div>
          ) : (
            /* Timeline Thread */
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {feedbacks.map((fb) => (
                <div
                  key={fb.feedbackId}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                    animation: "fadeIn 0.2s"
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: getAvatarBg(fb.mentorId || 0),
                      color: "#fff",
                      fontWeight: "700",
                      fontSize: "13px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                      flexShrink: 0
                    }}
                  >
                    {getAvatarInitials(fb.mentorId)}
                  </div>

                  {/* Comment box */}
                  <div style={{ flex: 1 }}>
                    {editFeedbackId === fb.feedbackId ? (
                      /* Editing form */
                      <form
                        onSubmit={(e) => handleUpdateFeedback(e, fb.feedbackId)}
                        style={{
                          background: "#181c36",
                          border: "1px solid var(--primary)",
                          borderRadius: "12px",
                          padding: "16px"
                        }}
                      >
                        <textarea
                          style={{
                            width: "100%",
                            background: "transparent",
                            border: "none",
                            padding: "0",
                            color: "#fff",
                            fontSize: "14px",
                            outline: "none",
                            resize: "vertical",
                            minHeight: "60px"
                          }}
                          value={editComments}
                          onChange={(e) => setEditComments(e.target.value)}
                          disabled={actionLoading}
                          required
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={actionLoading}
                            style={{
                              background: "#25294a",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "6px 12px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer"
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={actionLoading}
                            style={{
                              background: "var(--primary)",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "6px 12px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer"
                            }}
                          >
                            {actionLoading ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* Display Comment */
                      <div
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid var(--border)",
                          borderRadius: "14px",
                          padding: "16px",
                          position: "relative"
                        }}
                        className="comment-bubble"
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: "#fff" }}>
                            Mentor #{fb.mentorId}{" "}
                            {fb.mentorId === mentorId && (
                              <span style={{ color: "var(--primary)", fontWeight: "500", fontSize: "11px", marginLeft: "4px" }}>
                                (You)
                              </span>
                            )}
                          </span>
                          
                          {/* CRUD Actions */}
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              type="button"
                              onClick={() => handleEditClick(fb)}
                              disabled={actionLoading}
                              style={{
                                background: "none",
                                border: "none",
                                color: "var(--text2)",
                                cursor: "pointer",
                                fontSize: "12px",
                                transition: "0.2s"
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--yellow)")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text2)")}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFeedback(fb.feedbackId)}
                              disabled={actionLoading}
                              style={{
                                background: "none",
                                border: "none",
                                color: "var(--text2)",
                                cursor: "pointer",
                                fontSize: "12px",
                                transition: "0.2s"
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--red)")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text2)")}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: "1.5", whiteSpace: "pre-line" }}>
                          {fb.comments}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Feedback Input Section */}
        <div
          style={{
            padding: "24px 28px",
            background: "rgba(25, 29, 66, 0.2)",
            borderTop: "1px solid var(--border)"
          }}
        >
          <form onSubmit={handleAddFeedback} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ position: "relative" }}>
              <textarea
                style={{
                  width: "100%",
                  minHeight: "80px",
                  background: "#181c36",
                  border: "1px solid #2a2f59",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  resize: "none",
                  transition: "border-color 0.2s"
                }}
                placeholder="Log a new mentor observation or feedback note..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={actionLoading}
                required
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2f59")}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "var(--text2)" }}>
                Posting as Mentor ID: <strong>{mentorId}</strong> ({role})
              </span>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={actionLoading || !comments.trim()}
                style={{
                  padding: "10px 20px",
                  fontSize: "13px",
                  borderRadius: "8px",
                  opacity: comments.trim() ? 1 : 0.6,
                  cursor: comments.trim() ? "pointer" : "not-allowed"
                }}
              >
                {actionLoading ? "Submitting..." : "Post Observation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FeedbackModal;
