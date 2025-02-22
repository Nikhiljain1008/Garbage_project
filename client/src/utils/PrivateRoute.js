import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const PrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(!!localStorage.getItem("token"));
        };

        window.addEventListener("storage", checkAuth); // Listen for storage changes (logout)
        return () => window.removeEventListener("storage", checkAuth); // Cleanup
    }, []);

    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
