import React, { useEffect, useState } from "react";
import Header from "./Header/Header";
import Sidebar from "./SideBar/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiModel from "../../../API/ApiModel";
import { useAuth } from "../../../Auth/AuthProvider";

/* ================= PAGE ================= */

export default function StudentCoursesPage() {
    return (
        <div className="ttr-opened-sidebar ttr-pinned-sidebar">
            <Header />
            <Sidebar />
            <CourseData />
        </div>
    );
}

/* ================= MAIN ================= */

function CourseData() {
    const [search, setSearch] = useState("");

    return (
        <main className="ttr-wrapper">
            <div className="container-fluid">
                <div className="db-breadcrumb">
                    <h4 className="breadcrumb-title">My Courses</h4>
                </div>

                <div className="container mt-4">
                    <input
                        className="form-control"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <CourseList search={search} />
            </div>
        </main>
    );
}

/* ================= COURSE LIST ================= */

function CourseList({ search }) {
    const apiModel = new ApiModel();
    const { userDetail } = useAuth();

    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCourse, setActiveCourse] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, [search]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await apiModel.PostMethod(
                { search, studentId: userDetail?.Id },
                "CoursesReadForStudentWithBatch"
            );
            setCourseList(res?.data || []);
        } finally {
            setLoading(false);
        }
    };

    const cleanText = (t = "") =>
        t.replace(/[()[\]{},"']/g, "").replace(/\s+/g, " ").trim();

    /* ===== LOCAL DATE FORMATTER (NO TIME CHANGE) ===== */
    const formatStartDateLocal = (dateString) => {
        if (!dateString) return "N/A";

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    /* ===== TIME FORMATTER (UNCHANGED) ===== */
    const formatTime = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        if (isNaN(date)) return "Invalid Date";
        return date.toTimeString().substring(0, 5);
    };

    /* ===== BATCH TIME RENDER ===== */
    const renderBatchTime = (course) => {
        if (!course.StartTime || !course.EndTime) {
            return (
                <span className="badge bg-warning text-dark">
                    Batch not assigned
                </span>
            );
        }

        return (
            <div className="small text-success mt-1">
                <div><b>{course.BatchName}</b></div>

                {/* DATE FIXED, TIME UNTOUCHED */}
                <div className="text-muted">
                    📅 Starts: {formatStartDateLocal(course.StartTime)}
                </div>

                <div>
                    ⏰ {formatTime(course.StartTime)} – {formatTime(course.EndTime)}
                </div>
            </div>
        );
    };


    const renderSyllabus = (syllabus) => {
        try {
            const data = JSON.parse(syllabus || "[]");
            return data.map((item, i) => (
                <div key={i} className="mb-2">
                    <div className="fw-semibold small">
                        {i + 1}. {item.topic}
                    </div>
                    <ul className="small ps-3 text-muted">
                        {item.subtopics?.map((s, j) => (
                            <li key={j}>{s}</li>
                        ))}
                    </ul>
                </div>
            ));
        } catch {
            return <p className="text-muted small">Syllabus not available</p>;
        }
    };

    return (
        <div className="container mt-4">
            <div className="row g-4">
                {loading && (
                    <p className="text-center text-muted">Loading...</p>
                )}

                {courseList.map((course) => (
                    <div className="col-md-3" key={course.CourseId}>
                        <div className="card h-100 shadow-sm">
                            <img
                                src={apiModel.ReadImage("uploads/" + course.Image)}
                                className="card-img-top"
                                alt={course.CourseName}
                                style={{ height: 160, objectFit: "cover" }}
                            />

                            <div className="card-body d-flex flex-column">
                                <h6>{course.CourseName}</h6>

                                <p className="small text-muted">
                                    {cleanText(course.Description).slice(0, 55)}...
                                </p>

                                <b className="small">₹ {course.Fees}</b>

                                {renderBatchTime(course)}

                                <button
                                    className="btn btn-outline-primary btn-sm mt-auto"
                                    onClick={() => setActiveCourse(course)}
                                >
                                    View Syllabus
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= MODAL ================= */}
            {activeCourse && (
                <div
                    className="modal fade show d-flex align-items-center justify-content-center"
                    style={{ background: "rgba(0,0,0,.6)", display: "block" }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h6 className="mb-0">Course Details</h6>
                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setActiveCourse(null)}
                                />
                            </div>

                            <div className="modal-body">
                                <label className="small fw-bold">Course Name</label>
                                <input className="form-control mb-2" value={activeCourse.CourseName} readOnly />

                                <label className="small fw-bold">Description</label>
                                <textarea
                                    className="form-control mb-2"
                                    rows="2"
                                    value={cleanText(activeCourse.Description)}
                                    readOnly
                                />

                                <label className="small fw-bold">Fees</label>
                                <input
                                    className="form-control mb-2 text-success fw-bold"
                                    value={`₹ ${activeCourse.Fees}`}
                                    readOnly
                                />

                                <div className="mb-3">
                                    <label className="fw-semibold small">
                                        Assigned Batch Details
                                    </label>
                                    <div className="border rounded p-2 bg-light">
                                        {renderBatchTime(activeCourse)}
                                    </div>
                                </div>

                                <label className="small fw-bold">Syllabus</label>
                                <div
                                    className="bg-light p-3 rounded border"
                                    style={{ maxHeight: 250, overflowY: "auto" }}
                                >
                                    {renderSyllabus(activeCourse.Sylabus)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
