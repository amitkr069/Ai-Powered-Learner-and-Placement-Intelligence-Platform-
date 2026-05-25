import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AddLearner from "./pages/AddLearner";
import CsvUpload from "./pages/CsvUpload";
import MentorDashboard from "./pages/MentorDashboard";
import Assessment from "./pages/Assessment";
import Prediction from "./pages/Prediction";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/add-learner" element={<AddLearner />} />

        <Route path="/csv-upload" element={<CsvUpload />} />

        <Route path="/mentor" element={<MentorDashboard />} />

        <Route path="/assessment" element={<Assessment />} />

        <Route path="/prediction" element={<Prediction />} />

        <Route path="/analytics" element={<Analytics />} />

        <Route path="/notifications" element={<Notifications />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;