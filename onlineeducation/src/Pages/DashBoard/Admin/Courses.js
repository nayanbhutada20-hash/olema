import Header from "./Componant/Header";
import Sidebar from "./Componant/Sidebar";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CourseForm from "./Componant/Course/CourseForm";
import ApiModel from "../../../API/ApiModel";

export default function CoursesPage() {
    return (
        <>
            <div className="ttr-opened-sidebar ttr-pinned-sidebar">
                <Header />
                <Sidebar />
                <CourseData />
            </div>
        </>
    );
}

function CourseData() {
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [search, setSearch] = useState(""); // 🔍 search state

    return (
        <>
            <main className="ttr-wrapper">
                <div className="container-fluid">
                    <div className="db-breadcrumb">
                        <h4 className="breadcrumb-title">Courses</h4>
                    </div>
                    <CourseHeader
                        setShowModal={setShowModal}
                        setSelectedCourse={setSelectedCourse}
                        search={search}
                        setSearch={setSearch}
                    />
                    <CourseList
                        setShowModal={setShowModal}
                        setSelectedCourse={setSelectedCourse}
                        search={search}
                    />
                </div>
            </main>
            <div className="ttr-overlay"></div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <CourseForm
                    setShowModal={setShowModal}
                    selectedCourse={selectedCourse}
                />
            )}
        </>
    );
}

function CourseHeader({ setShowModal, setSelectedCourse, search, setSearch }) {
    return (
        <div className="container mt-4">
            <div className="d-flex flex-column flex-md-row align-items-stretch justify-content-between gap-2">
                {/* 🔍 Search Box */}
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* ➕ Add Button */}
                <button
                    className="btn btn-success d-flex align-items-center gap-2"
                    onClick={() => {
                        setSelectedCourse(null);
                        setShowModal(true);
                    }}
                >
                    <i className="fas fa-plus"></i> Add
                </button>
            </div>
        </div>
    );
}

function CourseList({ setShowModal, setSelectedCourse, search }) {
    const apiModel = new ApiModel();
    const [courseList, setCourseList] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, [search]); // 🔥 Refetch whenever search changes

    // ✅ Fetch courses (with search term)
    const fetchCourses = () => {
        try {
            const data={
                "search":search
            }
            apiModel.PostMethod(data, "CoursesRead").then((response) => {
                setCourseList(response.data);
            });

        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    // ✅ Delete function
    const handleDelete = async (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;

        try {
            const data ={
                "id":courseId
            }
            const response = await apiModel.PostMethod(data, "CoursesDelete");

            if (response.success) {
                alert("Course deleted successfully!");
                setCourseList(courseList.filter((course) => course.Id !== courseId));
            } else {
                alert("Failed to delete course.");
            }
        } catch (err) {
            console.error("Error deleting course:", err);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
                {courseList.length > 0 ? (
                    courseList.map((course) => (
                        <div className="col" key={course.Id}>
                            <div className="card h-100 d-flex flex-column">
                                <img
                                    src={apiModel.ReadImage("uploads/" + course.Image)}
                                    className="card-img-top"
                                    alt={course.Name}
                                    style={{ height: "180px", objectFit: "cover" }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{course.Name}</h5>
                                    <p className="clamp-2 small text-muted">{course.Description}</p>
                                    <p className="card-text">Fees: {course.Fees}</p>
                                    <div className="mt-auto d-flex gap-2">
                                        <button
                                            className="btn btn-danger w-50"
                                            onClick={() => handleDelete(course.Id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="btn btn-warning w-50"
                                            onClick={() => {
                                                setSelectedCourse(course); // send course to form
                                                setShowModal(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted">No courses found.</p>
                )}
            </div>
        </div>
    );
}
