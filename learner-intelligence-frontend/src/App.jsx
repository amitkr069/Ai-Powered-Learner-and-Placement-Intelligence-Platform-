import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import AddMentor from "./pages/AddMentor";
import CsvUpload from "./pages/CsvUpload";
import MentorDashboard from "./pages/MentorDashboard";
import Assessment from "./pages/Assessment";
import Prediction from "./pages/Prediction";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import LearnerDashboard from "./pages/LearnerDashboard";

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "ADMIN") return <Navigate to="/admin" replace />;
    if (role === "MENTOR") return <Navigate to="/mentor" replace />;
    if (role === "LEARNER") return <Navigate to="/learner" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/add-mentor" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AddMentor /></ProtectedRoute>} />
          <Route path="/csv-upload" element={<ProtectedRoute allowedRoles={["ADMIN"]}><CsvUpload /></ProtectedRoute>} />
          <Route path="/prediction" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Prediction /></ProtectedRoute>} />

          {/* Mentor Routes */}
          <Route path="/mentor" element={<ProtectedRoute allowedRoles={["MENTOR"]}><MentorDashboard /></ProtectedRoute>} />
          <Route path="/assessment" element={<ProtectedRoute allowedRoles={["MENTOR"]}><Assessment /></ProtectedRoute>} />

          {/* Learner Routes */}
          <Route path="/learner" element={<ProtectedRoute allowedRoles={["LEARNER"]}><LearnerDashboard /></ProtectedRoute>} />

          {/* Analytics — Admin and Mentor ONLY (not Learner) */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* Notifications — all roles */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "MENTOR", "LEARNER"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;