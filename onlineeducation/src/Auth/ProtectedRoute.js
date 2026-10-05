import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, userDetail, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                {/*<h2>Loading...</h2>*/}
                <div id="loading-icon-bx">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    // 🔹 Not logged in → redirect to SignIn
    if (!user || !userDetail) {
        return <Navigate to="/SignIn" replace />;
    }

    // 🔹 Role mismatch → redirect to Home
    if (requiredRole && userDetail.UserType !== requiredRole) {
        console.warn(
            `Access denied. Expected ${requiredRole}, got ${userDetail.UserType}`
        );
        return <Navigate to="/" replace />;
    }

    // ✅ Authorized
    return children;
};

export default ProtectedRoute;
