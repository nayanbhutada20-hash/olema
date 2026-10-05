import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ApiModel from "../../../../API/ApiModel";

// -------------------------------------------------------
// MAIN DASHBOARD PAGE
// -------------------------------------------------------
export default function Dashboard() {
    return (
        <div className="ttr-opened-sidebar ttr-pinned-sidebar">
            <Header />
            <Sidebar />
            <DashboardData />
        </div>
    );
}

// -------------------------------------------------------
// DASHBOARD DATA WRAPPER
// -------------------------------------------------------
function DashboardData() {
    const apiModel = new ApiModel();

    const [loading, setLoading] = useState(true);

    // STUDENT DATA
    const [totalStudents, setTotalStudents] = useState(0);
    const [latestStudents, setLatestStudents] = useState([]);

    // FEES DATA
    const [totalFees, setTotalFees] = useState(0);
    const [trendingCourse, setTrendingCourse] = useState(null);

    // FETCH DASHBOARD DATA
    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            try {
                // STUDENT DASHBOARD
                const studentRes = await apiModel.PostMethod(
                    {},
                    "StudentDashboardData"
                );

                if (studentRes?.success) {
                    setTotalStudents(studentRes.total_students);
                    setLatestStudents(studentRes.students || []);
                }

                // FEES DASHBOARD
                const feesRes = await apiModel.PostMethod(
                    {},
                    "FeesDashboardData"
                );

                if (feesRes?.success) {
                    setTotalFees(feesRes.total_fees_collected || 0);
                    setTrendingCourse(feesRes.trending_course);
                }

            } catch (error) {
                console.error("Error loading dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    return (
        <>
            <main className="ttr-wrapper">
                <div className="container-fluid">

                    {/* Breadcrumb */}
                    <div className="db-breadcrumb">
                        <h4 className="breadcrumb-title">Dashboard</h4>
                        <ul className="db-breadcrumb-list">
                            <li>
                                <a href="#"><i className="fa fa-home"></i>Home</a>
                            </li>
                            <li>Dashboard</li>
                        </ul>
                    </div>

                    {/* DASHBOARD CARDS */}
                    <div
                        className="d-flex flex-row overflow-auto"
                        style={{ gap: "1rem", paddingBottom: "1rem" }}
                    >

                        {/* TOTAL STUDENTS */}
                        <div style={{ minWidth: "250px" }}>
                            <div className="widget-card widget-bg1">
                                <div className="wc-item">
                                    <h4 className="wc-title">Total Students</h4>
                                    <span className="wc-des">Registered Users</span>
                                    <span className="wc-stats">
                                        {loading ? "Loading..." : totalStudents}
                                    </span>
                                    <div className="progress wc-progress">
                                        <div className="progress-bar" style={{ width: "90%" }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NEW STUDENTS */}
                        <div style={{ minWidth: "250px" }}>
                            <div className="widget-card widget-bg2">
                                <div className="wc-item">
                                    <h4 className="wc-title">New Students</h4>
                                    <span className="wc-des">Last 5 Registrations</span>
                                    <span className="wc-stats">
                                        {loading ? "..." : latestStudents.length}
                                    </span>
                                    <div className="progress wc-progress">
                                        <div className="progress-bar" style={{ width: "75%" }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TOTAL FEES */}
                        <div style={{ minWidth: "250px" }}>
                            <div className="widget-card widget-bg3">
                                <div className="wc-item">
                                    <h4 className="wc-title">Total Fees</h4>
                                    <span className="wc-des">Fees Collected</span>
                                    <span className="wc-stats">
                                        {loading ? "..." : `₹ ${totalFees}`}
                                    </span>
                                    <div className="progress wc-progress">
                                        <div className="progress-bar" style={{ width: "85%" }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TRENDING COURSE */}
                        <div style={{ minWidth: "250px" }}>
                            <div className="widget-card widget-bg4">
                                <div className="wc-item">
                                    <h4 className="wc-title">Trending Course</h4>
                                    <span className="wc-des">Most Enrolled</span>
                                    <span className="wc-stats">
                                        {loading
                                            ? "..."
                                            : trendingCourse
                                                ? `Course ID: ${trendingCourse.CourseID}`
                                                : "N/A"}
                                    </span>
                                    <div className="progress wc-progress">
                                        <div className="progress-bar" style={{ width: "70%" }} />
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
