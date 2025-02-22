import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Register2 from "./pages/Register2";
import { ReportPage } from "./pages/ReportPage";
import MyImages from "./pages/MyImages";
import SIDashboard from "./pages/SIDashboard";
import MuqaddamDashboard from "./pages/MuqaddamDashboard";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
	return (
		// <Router>

		// 	<Routes>
		// 		<Route path="/" element={<LandingPage />} />
		// 		<Route path="/login" element={<Login />} />
		// 		<Route path="/register" element={<Register />} />
		// 		<Route path="/register2" element={<Register2 />} />
		// 		<Route element={<PrivateRoute />}>
		// 			<Route path="/" element={<LandingPage />} />

		// 			<Route path="/report" element={<ReportPage />} />
		// 			<Route path="/profile" element={<Profile />} />
		// 			<Route path="/settings" element={<Settings />} />
		// 		</Route>

		// 		<Route path="/my-images" element={<MyImages />} />
		// 		<Route path="/si-dashboard" element={<SIDashboard />} />
		// 		<Route path="/muqaddam-dashboard" element={<MuqaddamDashboard />} />
		// 		<Route path="/About" element={<About />} />
		// 		<Route path="/Contacts" element={<Contacts />} />

		// 	</Routes>
		// </Router>

		<Router>
			<Routes>
				{/* Public Routes */}
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/register2" element={<Register2 />} />
				<Route path="/about" element={<About />} />
				<Route path="/contacts" element={<Contacts />} />

				{/* Protected Routes */}
				<Route element={<PrivateRoute />}>
					<Route path="/report" element={<ReportPage />} />
					<Route path="/my-images" element={<MyImages />} />
					<Route path="/si-dashboard" element={<SIDashboard />} />
					<Route path="/muqaddam-dashboard" element={<MuqaddamDashboard />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;



