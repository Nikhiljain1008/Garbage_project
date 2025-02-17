import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {ReportPage} from "./pages/ReportPage";

console.log("LandingPage:", LandingPage);
console.log("Login:", Login);
console.log("Register:", Register);
console.log("ReportPage:", ReportPage);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
