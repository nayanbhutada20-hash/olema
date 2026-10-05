import React, { useEffect, useState, useCallback } from "react";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiModel from "../../../API/ApiModel";
import { useAuth } from "../../../Auth/AuthProvider";

/* ================= PAGE ================= */

export default function CoursesPage() {
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
    return (
        <main className="ttr-wrapper">
            <div className="container-fluid">
                <div className="db-breadcrumb mb-3">
                    <h4 className="breadcrumb-title">My Courses</h4>
                </div>
                <CourseList />
            </div>
        </main>
    );
}

/* ================= COURSE LIST ================= */

function CourseList() {
    const apiModel = new ApiModel();
    const { userDetail } = useAuth();

    const [courses, setCourses] = useState([]);
    const [activeSyllabus, setActiveSyllabus] = useState(null);

    /* ================= FETCH COURSES ================= */

    const fetchCourses = useCallback(async (InstructorId) => {
        try {
            const res = await apiModel.PostMethod(
                { InstructorId },
                "ReadCourseForFaculty"
            );
            setCourses(res?.data || []);
        } catch (error) {
            console.error("Course Fetch Error:", error);
        }
    }, []);

    useEffect(() => {
        if (userDetail?.Id) {
            fetchCourses(userDetail.Id);
        }
    }, [userDetail?.Id, fetchCourses]);

    /* ================= DATETIME PARSER (CORE LOGIC) ================= */

    const parseDateTime = (dateTimeString) => {
        if (!dateTimeString) return null;

        const d = new Date(dateTimeString);
        if (isNaN(d.getTime())) return null;

        return {
            date: `${String(d.getDate()).padStart(2, "0")}-${String(
                d.getMonth() + 1
            ).padStart(2, "0")}-${d.getFullYear()}`,
            time: `${(d.getHours() % 12 || 12)}:${String(
                d.getMinutes()
            ).padStart(2, "0")} ${d.getHours() >= 12 ? "PM" : "AM"}`
        };
    };

    /* ================= TEXT CLEANER ================= */

    const cleanText = (text = "") =>
        text
            .replace(/[()[\]{},"']/g, "")
            .replace(/\s+/g, " ")
            .trim();

    /* ================= SYLLABUS VIEW ================= */

    const ShowSyllabus = (data, index) => (
        <div className="p-2" key={index}>
            <h6>{index + 1}. {data.topic}</h6>
            <ul>
                {data.subtopics.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        </div>
    );

    /* ================= UI ================= */

    return (
        <div className="container mt-3">
            <div className="row g-3">

                {courses.length === 0 && (
                    <div className="col-12 text-center text-muted small">
                        No courses assigned yet.
                    </div>
                )}

                {courses.map((course, idx) => {
                    const start = parseDateTime(course.StartTime);
                    const end = parseDateTime(course.EndTime);

                    return (
                        <div className="col-xl-3 col-lg-4 col-md-6" key={idx}>
                            <div className="card h-100 border-0 shadow-sm">

                                {course.Image && (
                                    <img
                                        src={apiModel.ReadImage(`uploads/${course.Image}`)}
                                        alt={course.CourseName}
                                        className="card-img-top"
                                        style={{ height: "130px", objectFit: "cover" }}
                                    />
                                )}

                                <div className="card-body p-3">
                                    <h6 className="fw-semibold text-truncate mb-1">
                                        {course.CourseName}
                                    </h6>

                                    <p className="text-muted small mb-2" style={{ fontSize: "12px" }}>
                                        {cleanText(course.Description).slice(0, 55)}...
                                    </p>

                                    <p className="small mb-1">
                                        <b>Batch:</b> {course.Title}
                                    </p>

                                    {/* ✅ DATE RANGE */}
                                    <p className="small text-muted mb-1">
                                        <b>Date:</b>{" "}
                                        {start?.date} → {end?.date}
                                    </p>

                                    {/* ✅ TIME RANGE */}
                                    <p className="small text-muted mb-3">
                                        <b>Time:</b>{" "}
                                        {start?.time} → {end?.time}
                                    </p>

                                    <button
                                        className="btn btn-sm btn-outline-primary w-100"
                                        onClick={() => setActiveSyllabus(course)}
                                    >
                                        View Syllabus
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ================= SYLLABUS MODAL ================= */}

            {activeSyllabus && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0">

                            <div className="modal-header bg-dark text-white py-2">
                                <h6 className="modal-title mb-0">
                                    {activeSyllabus.CourseName} – Syllabus
                                </h6>
                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setActiveSyllabus(null)}
                                />
                            </div>

                            <div
                                className="modal-body"
                                style={{ maxHeight: "60vh", overflowY: "auto" }}
                            >
                                {JSON.parse(activeSyllabus.Sylabus || "[]")
                                    .map((item, index) => ShowSyllabus(item, index))}
                            </div>

                            <div className="modal-footer py-2">
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => setActiveSyllabus(null)}
                                >
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
