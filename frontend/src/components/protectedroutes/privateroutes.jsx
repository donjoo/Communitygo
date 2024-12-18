import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Ensure proper import for jwtDecode
import api from "../../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null); // Track authorization state

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const isAuthenticated = await checkAuth();
                if (isAuthenticated !== isAuthorized) {
                    setIsAuthorized(isAuthenticated); // Only update if state changes
                }
            } catch (error) {
                console.error("Error during auth check:", error);
                setIsAuthorized(false); // Explicitly mark unauthorized on error
            }
        };
        checkAuthStatus();
    }, [isAuthorized]); // Depend only on `isAuthorized`

    const checkAuth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            return false; // No token, unauthorized
        }

        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            return await refreshToken(); // Token expired, try refreshing
        }

        return true; // Token valid
    };

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
            return false; // No refresh token available
        }

        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                return true; // Token refreshed, authorized
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
        }
        return false; // Refresh failed, unauthorized
    };

    // Display a loading state while authorization is being determined
    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    // Navigate to login if not authorized, otherwise render children
    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
