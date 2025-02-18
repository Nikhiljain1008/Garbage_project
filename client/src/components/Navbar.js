import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>My App</h2>
      <ul style={styles.navLinks}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/report" style={styles.link}>Report</Link></li>
        <li><Link to="/my-images" style={styles.link}>My Images</Link></li>
        <li><Link to="/login" style={styles.link}>Login</Link></li>
        <li><Link to="/register" style={styles.link}>Register</Link></li>
      </ul>
    </nav>
  );
};

// Inline styles
const styles = {
  navbar: { display: "flex", justifyContent: "space-between", padding: "15px", background: "#333", color: "#fff" },
  logo: { margin: "0 20px" },
  navLinks: { listStyle: "none", display: "flex", gap: "15px", marginRight: "20px" },
  link: { color: "#fff", textDecoration: "none", fontSize: "16px" }
};

export default Navbar;
