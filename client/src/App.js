import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // ✅ Import Navbar
import { LandingPage } from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Register2 from "./pages/Register2";
import { ReportPage } from "./pages/ReportPage";
import MyImages from "./pages/MyImages";

function App() {
	return (
		<Router>
			<Navbar /> {/* ✅ Navbar appears on all pages */}
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/register2" element={<Register2 />} />
				<Route path="/report" element={<ReportPage />} />
				<Route path="/my-images" element={<MyImages />} />
			</Routes>
		</Router>
	);
}

export default App;
