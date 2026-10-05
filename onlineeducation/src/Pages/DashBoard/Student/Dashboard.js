import React from "react";

const Dashboard = () => {
    const studentStats = [
        { title: "Total Courses", desc: "Enrolled Courses", stats: "8", progress: 80 },
        { title: "Pending Assignments", desc: "To Submit", stats: "5", progress: 60 },
        { title: "Attendance", desc: "Class Attendance", stats: "92%", progress: 92 },
        { title: "Grades", desc: "Average Score", stats: "88%", progress: 88 },
    ];

    return (
        <>
            <main className="ttr-wrapper">
                <div className="container-fluid">
                    <div className="db-breadcrumb">
                        <h4 className="breadcrumb-title">Student Dashboard</h4>
                        <ul className="db-breadcrumb-list">
                            <li>
                                <a href="#"><i className="fa fa-home"></i>Home</a>
                            </li>
                            <li>Dashboard</li>
                        </ul>
                    </div>

                    <div
                        className="d-flex flex-row overflow-auto"
                        style={{ gap: "1rem", paddingBottom: "1rem" }}
                    >
                        {studentStats.map((item, i) => (
                            <div key={i} style={{ minWidth: "250px", flex: "0 0 auto" }}>
                                <div className={`widget-card widget-bg${i + 1}`}>
                                    <div className="wc-item">
                                        <h4 className="wc-title">{item.title}</h4>
                                        <span className="wc-des">{item.desc}</span>
                                        <span className="wc-stats">{item.stats}</span>
                                        <div className="progress wc-progress">
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${item.progress}%` }}
                                                aria-valuenow={item.progress}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            ></div>
                                        </div>
                                        <span className="wc-progress-bx">
                      <span className="wc-change">Progress</span>
                      <span className="wc-number ml-auto">{item.progress}%</span>
                    </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <div className="ttr-overlay"></div>
        </>
    );
};

export default Dashboard;
