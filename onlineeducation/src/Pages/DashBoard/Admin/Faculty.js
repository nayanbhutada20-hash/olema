import React, { useEffect, useState } from "react";
import Header from "./Componant/Header";
import Sidebar from "./Componant/Sidebar";
import FacultyForm from "./Componant/faaculty/FacultyForm";
import ApiModel from "../../../API/ApiModel";

// -------------------------------------------------------
// MAIN PAGE
// -------------------------------------------------------
export default function FacultyPage() {
    return (
        <div className="ttr-opened-sidebar ttr-pinned-sidebar">
            <Header />
            <Sidebar />
            <FacultyData />
        </div>
    );
}

// -------------------------------------------------------
// FACULTY PAGE DATA WRAPPER
// -------------------------------------------------------
function FacultyData() {
    const [showModal, setShowModal] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [facultyList, setFacultyList] = useState([]);

    return (
        <>
            <main className="ttr-wrapper">
                <div className="container-fluid">
                    <div className="db-breadcrumb">
                        <h4 className="breadcrumb-title">Faculty Management</h4>
                        <p className="text-muted">
                            Manage faculty members, their profiles and assigned courses
                        </p>
                    </div>

                    <FacultyHeader
                        setShowModal={setShowModal}
                        setSelectedFaculty={setSelectedFaculty}
                        search={search}
                        setSearch={setSearch}
                    />

                    <FacultyList
                        setShowModal={setShowModal}
                        setSelectedFaculty={setSelectedFaculty}
                        search={search}
                        loading={loading}
                        setLoading={setLoading}
                        facultyList={facultyList}
                        setFacultyList={setFacultyList}
                    />
                </div>
            </main>

            <div className="ttr-overlay"></div>

            {showModal && (
                <FacultyForm
                    setShowModal={setShowModal}
                    selectedFaculty={selectedFaculty}
                />
            )}
        </>
    );
}

// -------------------------------------------------------
// HEADER WITH SEARCH + ADD BUTTON
// -------------------------------------------------------
function FacultyHeader({ setShowModal, setSelectedFaculty, search, setSearch }) {
    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex flex-column flex-md-row align-items-stretch justify-content-between gap-3 p-4 bg-white rounded-3 shadow-sm">

                {/* Search Bar */}
                <div className="position-relative flex-grow-1">
                    <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                        type="text"
                        className="form-control ps-5 border-0 shadow-sm"
                        placeholder="Search faculty by name, email, or course..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Add Button */}
                <button
                    className="btn btn-primary d-flex align-items-center gap-2 px-4 py-3 rounded-2 shadow-sm"
                    onClick={() => {
                        setSelectedFaculty(null);
                        setShowModal(true);
                    }}
                >
                    <i className="fas fa-user-plus"></i>
                    <span>Add Faculty Member</span>
                </button>
            </div>
        </div>
    );
}

// -------------------------------------------------------
// FACULTY LIST COMPONENT
// -------------------------------------------------------
function FacultyList({
                         setShowModal,
                         setSelectedFaculty,
                         search,
                         loading,
                         setLoading,
                         facultyList,
                         setFacultyList,
                     }) {
    const apiModel = new ApiModel();
    const [confirmation, setConfirmation] = useState({ show: false, faculty: null });

    // FETCH FACULTY
    useEffect(() => {
        const fetchFaculty = async () => {
            setLoading(true);
            try {
                const data = { search };
                const response = await apiModel.PostMethod(data, "FacultyRead");

                setFacultyList(response.data || []);
            } catch (err) {
                console.error("Error fetching faculty:", err);
                setFacultyList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFaculty();
    }, [search]);

    // DELETE HANDLER
    const handleDelete = async (facultyId) => {
        try {
            const data = { id: facultyId };
            const response = await apiModel.PostMethod(data, "FacultyDelete");

            if (response.success) {
                setFacultyList(facultyList.filter((f) => f.Id !== facultyId));
                setConfirmation({ show: false, faculty: null });
            } else {
                alert("Failed to delete faculty.");
            }
        } catch (err) {
            console.error("Error deleting faculty:", err);
        }
    };

    // IMAGE URL
    const getImageUrl = (image) => {
        try {
            return apiModel.ReadImage(`profile/${image}`);
        } catch {
            return "https://ui-avatars.com/api/?name=Faculty&background=6c63ff&color=fff&size=180";
        }
    };

    // RENDER
    return (
        <div className="container mt-4">

            {/* LOADING */}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="mt-3 text-muted">Loading faculty members...</p>
                </div>
            )}

            {/* LIST */}
            {!loading && facultyList.length > 0 && (
                <div className="row g-4">
                    {facultyList.map((f) => {
                        // Parse Courses Properly
                        let courseNames = [];
                        try {
                            const coursesArray = JSON.parse(f.Courses);
                            courseNames = Array.isArray(coursesArray)
                                ? coursesArray
                                : [coursesArray];
                        } catch (error) {
                            console.error("Error parsing courses:", error);
                        }

                        return (
                            <div className="col-lg-6 col-xl-4" key={f.Id}>
                                <div className="card h-100 border-0 shadow-sm">

                                    <div className="card-body p-4">
                                        {/* Profile */}
                                        <div className="d-flex align-items-start mb-4">

                                            <img
                                                src={getImageUrl(f.Image)}
                                                className="rounded-circle shadow"
                                                alt={f.Name}
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                }}
                                            />

                                            <div className="ms-3">
                                                <h5 className="mb-1">{f.Name}</h5>
                                                <p className="text-muted small">
                                                    {f.Designation || "Faculty Member"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Contact Details */}
                                        <div className="mb-3 small text-muted">
                                            <p><i className="fas fa-envelope me-2"></i>{f.Email}</p>
                                            <p><i className="fas fa-phone me-2"></i>{f.Mobile}</p>
                                            <p><i className="fas fa-map-marker-alt me-2"></i>{f.Address}</p>
                                        </div>

                                        {/* Courses */}
                                        <h6 className="text-primary mb-2">Courses:</h6>
                                        <div className="d-flex flex-wrap gap-1 mb-3">
                                            {courseNames.map((course, idx) => (
                                                <span
                                                    key={idx}
                                                    className="badge bg-light text-dark small px-2 py-1 rounded-pill"
                                                >
                                                    {course?.Name ?? "Unnamed Course"}
                                                </span>
                                            ))}
                                        </div>

                                        {/* ACTION BUTTONS */}
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-primary w-50"
                                                onClick={() => {
                                                    setSelectedFaculty(f);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <i className="fas fa-edit"></i> Edit
                                            </button>

                                            <button
                                                className="btn btn-sm btn-outline-danger w-50"
                                                onClick={() =>
                                                    setConfirmation({ show: true, faculty: f })
                                                }
                                            >
                                                <i className="fas fa-trash"></i> Delete
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* NO DATA */}
            {!loading && facultyList.length === 0 && (
                <div className="text-center py-5">
                    <i className="fas fa-user-graduate fa-3x text-muted mb-3"></i>
                    <h5>No faculty members found</h5>
                    <p className="text-muted">Try adjusting your search or add a faculty member.</p>

                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setSelectedFaculty(null);
                            setShowModal(true);
                        }}
                    >
                        Add Faculty Member
                    </button>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {confirmation.show && (
                <div
                    className="modal fade show d-block"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button className="btn-close" onClick={() =>
                                    setConfirmation({ show: false, faculty: null })
                                }></button>
                            </div>

                            <div className="modal-body">
                                <p>
                                    Delete <strong>{confirmation?.faculty?.Name}</strong>?
                                </p>
                                <p className="text-muted small">This action cannot be undone.</p>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setConfirmation({ show: false, faculty: null })
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                        handleDelete(confirmation.faculty.Id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
