import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { LogOut } from "../../../../Model/Auth"; // ✅ Ensure this path is correct

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await LogOut();        // ✅ Call your logout function
            navigate("/");         // ✅ Redirect to homepage or login page
        } catch (error) {
            console.error("❌ Logout failed:", error);
        }
    };

    return (
        <div className="ttr-sidebar">
            <div
                className="ttr-sidebar-wrapper content-scroll d-flex flex-column justify-content-between"
                style={{ minHeight: "100vh" }}
            >

                {/* --- TOP SECTION --- */}
                <div>
                    {/* Sidebar Logo */}
                    <div className="ttr-sidebar-logo d-flex align-items-center justify-content-between px-3 py-2">
                        <a href="#">
                            <img alt="Logo" src="../assets/images/logo.png" width="122" height="27" />
                        </a>
                        <div className="ttr-sidebar-toggle-button">
                            <i className="fas fa-angle-left"></i>
                        </div>
                    </div>

                    {/* Sidebar Menu */}
                    <nav className="ttr-sidebar-navi">
                        <ul>
                            {/* Dashboard */}
                            <li>
                                <Link to="/Faculty/FacultyDashboard" className="ttr-material-button">
                                    <span className="ttr-icon"><i className="fas fa-home"></i></span>
                                    <span className="ttr-label">Dashboard</span>
                                </Link>
                            </li>

                            {/* Courses */}
                            <li>
                                <Link to="/Faculty/Courses" className="ttr-material-button">
                                    <span className="ttr-icon"><i className="fas fa-book"></i></span>
                                    <span className="ttr-label">Courses</span>
                                </Link>
                            </li>

                            {/* Events */}
                            <li>
                                <Link to="/Faculty/Events" className="ttr-material-button">
                                    <span className="ttr-icon"><i className="fas fa-calendar-alt"></i></span>
                                    <span className="ttr-label">Events</span>
                                </Link>
                            </li>

                            {/* Fees */}
                            <li>
                                <Link to="/Faculty/Payment" className="ttr-material-button">
                                    <span className="ttr-icon"><i className="fas fa-money-bill-wave"></i></span>
                                    <span className="ttr-label">Payment</span>
                                </Link>
                            </li>

                            {/* Profile */}
                            <li>
                                <Link to="/Faculty/Profile" className="ttr-material-button">
                                    <span className="ttr-icon"><i className="fas fa-user"></i></span>
                                    <span className="ttr-label">My Profile</span>
                                </Link>
                            </li>

                            {/* Separator */}
                            <li className="ttr-seperate"></li>

                            {/* Logout */}
                            <li>
                                <Link onClick={LogOut} to={"#"} className="ttr-material-button">
                                    <span className="ttr-icon"><i className="fas fa-sign-out-alt"></i></span>
                                    <span className="ttr-label">Logout</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

            </div>
        </div>
    );
}
