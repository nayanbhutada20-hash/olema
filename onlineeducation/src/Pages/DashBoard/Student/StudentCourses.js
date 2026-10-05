import React, { useEffect, useState } from "react";
import Header from "./Header/Header";
import Sidebar from "./SideBar/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiModel from "../../../API/ApiModel";
import { useAuth } from "../../../Auth/AuthProvider";
import { handlePayment } from "./loader";

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
                    <h4 className="breadcrumb-title">Available Courses</h4>
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
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, [search]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await apiModel.PostMethod({ search,studentId:userDetail.Id }, "CoursesReadforStudent");
            setCourseList(res?.data || []);
        } finally {
            setLoading(false);
        }
    };

    const cleanText = (t = "") =>
        t.replace(/[()[\]{},"']/g, "").replace(/\s+/g, " ").trim();

    /* ===== PAYMENT + FEES INSERT ===== */

    const handleEnrollWithPayment = async () => {
        if (!activeCourse || !userDetail?.Id) {
            alert("Please login to continue");
            return;
        }

        setPaying(true);

        await handlePayment(activeCourse.Fees, async (paymentId) => {
            try {
                const paymentDate = new Date()
                    .toISOString()
                    .split("T")[0]; // YYYY-MM-DD

                const res = await apiModel.PostMethod(
                    {
                        studentId: userDetail.Id,
                        courseId: activeCourse.Id,
                        amount: activeCourse.Fees,
                        date: paymentDate,
                        transactionId: paymentId,
                    },
                    "FeesInsert"
                );

                if (res?.success) {
                    alert("✅ Payment successful & fees recorded");
                    setActiveCourse(null);
                } else {
                    alert(res?.message || "Fees insert failed");
                }
            } catch (err) {
                console.error(err);
                alert("Payment completed but DB insert failed");
            } finally {
                setPaying(false);
            }
        });
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
                    <div className="col-md-3" key={course.Id}>
                        <div className="card h-100 shadow-sm">
                            <img
                                src={apiModel.ReadImage(
                                    "uploads/" + course.Image
                                )}
                                className="card-img-top"
                                style={{ height: 160, objectFit: "cover" }}
                            />

                            <div className="card-body d-flex flex-column">
                                <h6>{course.Name}</h6>
                                <p className="small text-muted">
                                    {cleanText(course.Description).slice(0, 55)}
                                    ...
                                </p>

                                <b className="small">₹ {course.Fees}</b>

                                <button
                                    className="btn btn-outline-primary btn-sm mt-auto"
                                    onClick={() => setActiveCourse(course)}
                                >
                                    View & Enroll
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
                    style={{ background: "rgba(0,0,0,.6)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h6>Course Enrollment</h6>
                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setActiveCourse(null)}
                                />
                            </div>

                            <div className="modal-body">
                                <input
                                    className="form-control mb-2"
                                    value={activeCourse.Name}
                                    readOnly
                                />

                                <textarea
                                    className="form-control mb-2"
                                    rows="2"
                                    value={cleanText(
                                        activeCourse.Description
                                    )}
                                    readOnly
                                />

                                <input
                                    className="form-control mb-2 text-success fw-bold"
                                    value={`₹ ${activeCourse.Fees}`}
                                    readOnly
                                />

                                <div
                                    className="bg-light p-2 rounded mb-3"
                                    style={{
                                        maxHeight: 180,
                                        overflowY: "auto",
                                    }}
                                >
                                    {renderSyllabus(
                                        activeCourse.Sylabus
                                    )}
                                </div>

                                <button
                                    className="btn btn-primary w-100"
                                    disabled={paying}
                                    onClick={handleEnrollWithPayment}
                                >
                                    {paying
                                        ? "Processing..."
                                        : "Pay & Enroll"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
