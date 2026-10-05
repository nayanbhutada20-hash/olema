import React from 'react';
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { LogOut } from "../../../../Model/Auth";

export default function Sidebar() {
    return (
        <div className="ttr-sidebar">
            <div className="ttr-sidebar-wrapper content-scroll">

                {/* side menu logo start */}
                <div className="ttr-sidebar-logo">
                    <a href="#">
                        <img alt="Logo" src="../assets/images/logo.png" width="122" height="27" />
                    </a>
                    <div className="ttr-sidebar-toggle-button">
                        <i className="fas fa-angle-left"></i>
                    </div>
                </div>
                {/* side menu logo end */}

                {/* sidebar menu start */}
                <nav className="ttr-sidebar-navi">
                    <ul>
                        {/* Dashboard */}
                        <li>
                            <Link to="/Admin/AdminDashboard" className="ttr-material-button">
                                <span className="ttr-icon"><i className="fas fa-home"></i></span>
                                <span className="ttr-label">Dashboard</span>
                            </Link>
                        </li>

                        {/* Courses */}
                        <li>
                            <Link to="/Admin/Courses" className="ttr-material-button">
                                <span className="ttr-icon"><i className="fas fa-book-open"></i></span>
                                <span className="ttr-label">Courses</span>
                            </Link>
                        </li>

                        {/* Faculty */}
                        <li>
                            <Link to="/Admin/Faculty" className="ttr-material-button">
                                <span className="ttr-icon"><i className="fas fa-chalkboard-teacher"></i></span>
                                <span className="ttr-label">Faculty</span>
                            </Link>
                        </li>

                        {/* Events */}
                        <li>
                            <Link to="/Admin/Events" className="ttr-material-button">
                                <span className="ttr-icon"><i className="fas fa-calendar-alt"></i></span>
                                <span className="ttr-label">Events</span>
                            </Link>
                        </li>

                        {/* Fees */}
                        <li>
                            <Link to="/Admin/Fees" className="ttr-material-button">
                                <span className="ttr-icon"><i className="fas fa-file-invoice-dollar"></i></span>
                                <span className="ttr-label">Fees</span>
                            </Link>
                        </li>

                        {/* Batches */}
                        <li>
                            <Link to="/Admin/Chat" className="ttr-material-button">
                                <span className="ttr-icon"><i className="fas fa-users"></i></span>
                                <span className="ttr-label">Batches</span>
                            </Link>
                        </li>

                        {/* Account Details */}
                        <li>
                            <Link to="/Admin/AccountDetails" className="ttr-material-button">
                                <span className="ttr-icon"><i className="fas fa-user-cog"></i></span>
                                <span className="ttr-label">AccountDetails</span>
                            </Link>
                        </li>

                        {/* Student Info */}
                        <li>
                            <Link to="/Admin/STUDENTDATA" className="ttr-material-button">
                                <span className="ttr-icon"><i className="fas fa-user-graduate"></i></span>
                                <span className="ttr-label">STUDENT INFO</span>
                            </Link>
                        </li>

                        {/* Profile */}
                        <li>
                            <Link to="/Admin/Profile" className="ttr-material-button">
                                <span className="ttr-icon"><i className="fas fa-user-circle"></i></span>
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
                {/* sidebar menu end */}
            </div>
        </div>
    );
}