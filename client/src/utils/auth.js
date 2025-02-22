export const logout = (navigate) => {
    localStorage.removeItem("token"); // Clear token
    navigate("/"); // Redirect to home page
    window.location.reload(); // Force refresh to clear state
};
