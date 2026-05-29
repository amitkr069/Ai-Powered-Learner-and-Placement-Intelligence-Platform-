import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AddLearner from "./pages/AddLearner";
import CsvUpload from "./pages/CsvUpload";
import MentorDashboard from "./pages/MentorDashboard";
import Assessment from "./pages/Assessment";
import Prediction from "./pages/Prediction";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";

// Protected Route Component for Access Control
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return role === "ADMIN" ? <Navigate to="/admin" replace /> : <Navigate to="/mentor" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/" element={<Login />} />

        {/* Admin Dashboard Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-learner"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AddLearner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/csv-upload"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <CsvUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prediction"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Prediction />
            </ProtectedRoute>
          }
        />

        {/* Mentor Protected Routes */}
        <Route
          path="/mentor"
          element={
            <ProtectedRoute allowedRoles={["MENTOR"]}>
              <MentorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment"
          element={
            <ProtectedRoute allowedRoles={["MENTOR"]}>
              <Assessment />
            </ProtectedRoute>
          }
        />

        {/* Common Shared Protected Routes */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MENTOR"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;