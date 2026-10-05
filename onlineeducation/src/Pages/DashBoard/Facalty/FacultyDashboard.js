import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";

const FacultyDashboard = () => {
    return (
        <div className="ttr-opened-sidebar ttr-pinned-sidebar">
            <Header />
            <Sidebar />
            <DashboardContent />
        </div>
    );
};

export default FacultyDashboard;

function DashboardContent() {
    const notifications = [
        {
            id: 1,
            title: "Submit Mid-Sem Results",
            date: "Nov 3, 2025",
            desc: "Upload mid-semester exam results before 5th Nov 2025.",
        },
        {
            id: 2,
            title: "AI Workshop Registration",
            date: "Nov 1, 2025",
            desc: "Register for AI workshop to be held on 10th Nov 2025.",
        },
        {
            id: 3,
            title: "Salary Slip Available",
            date: "Oct 31, 2025",
            desc: "October 2025 salary slip is now available for download.",
        },
    ];

    return (
        <>
            <main className="ttr-wrapper">
                <div className="container-fluid">
                    {/* Breadcrumb */}
                    <div className="db-breadcrumb mb-4">
                        <h4 className="breadcrumb-title">Faculty Dashboard</h4>
                        <ul className="db-breadcrumb-list">
                            <li><i className="fa fa-home"></i> Home</li>
                            <li>Dashboard</li>
                        </ul>
                    </div>

                    {/* Dashboard Cards */}
                    <div className="row gy-4">
                        <div className="col-md-6 col-lg-3">
                            <div className="card text-center border-0 shadow-sm">
                                <div className="card-body">
                                    <i className="fa fa-calendar text-primary fa-2x mb-2"></i>
                                    <h6>Upcoming Classes</h6>
                                    <h4 className="text-primary mb-0">05</h4>
                                    <small>Next: Data Structures (10:30 AM)</small>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="card text-center border-0 shadow-sm">
                                <div className="card-body">
                                    <i className="fa fa-users text-success fa-2x mb-2"></i>
                                    <h6>Total Students</h6>
                                    <h4 className="text-success mb-0">152</h4>
                                    <small>Across 3 classes</small>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="card text-center border-0 shadow-sm">
                                <div className="card-body">
                                    <i className="fa fa-check-circle text-warning fa-2x mb-2"></i>
                                    <h6>Attendance Submitted</h6>
                                    <h4 className="text-warning mb-0">92%</h4>
                                    <small>This Month</small>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="card text-center border-0 shadow-sm">
                                <div className="card-body">
                                    <i className="fa fa-rupee-sign text-danger fa-2x mb-2"></i>
                                    <h6>Last Payment</h6>
                                    <h4 className="text-danger mb-0">₹75,000</h4>
                                    <small>Credited: 31 Oct 2025</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications and Recent Activity */}
                    <div className="row mt-4">
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-primary mb-3">
                                        <i className="fa fa-bell me-2"></i>Recent Notifications
                                    </h5>
                                    <ul className="list-group list-group-flush">
                                        {notifications.map((n) => (
                                            <li key={n.id} className="list-group-item d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className="mb-1 text-dark">{n.title}</h6>
                                                    <p className="mb-1 text-muted small">{n.desc}</p>
                                                </div>
                                                <span className="badge bg-light text-secondary">{n.date}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-primary mb-3">
                                        <i className="fa fa-chart-line me-2"></i>Performance Overview
                                    </h5>
                                    <p><strong>Average Student Attendance:</strong> 87%</p>
                                    <p><strong>Assignments Submitted:</strong> 95%</p>
                                    <p><strong>Exam Evaluation Status:</strong> Completed</p>
                                    <div className="progress my-3" style={{ height: "8px" }}>
                                        <div
                                            className="progress-bar bg-primary"
                                            role="progressbar"
                                            style={{ width: "87%" }}
                                            aria-valuenow="87"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                    <small className="text-muted">Academic Progress: Good</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-primary mb-3">
                                        <i className="fa fa-link me-2"></i>Quick Links
                                    </h5>
                                    <div className="d-flex flex-wrap gap-3">
                                        <button className="btn btn-outline-primary btn-sm">
                                            <i className="fa fa-calendar-check me-2"></i>Mark Attendance
                                        </button>
                                        <button className="btn btn-outline-success btn-sm">
                                            <i className="fa fa-file-alt me-2"></i>Upload Results
                                        </button>
                                        <button className="btn btn-outline-warning btn-sm">
                                            <i className="fa fa-chalkboard-teacher me-2"></i>Class Schedule
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm">
                                            <i className="fa fa-money-bill me-2"></i>View Payments
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <div className="ttr-overlay"></div>
        </>
    );
}
