import Sidebar from "./Componant/Sidebar";
import React, { useEffect, useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiModel from "../../../API/ApiModel";
import Header from "./Componant/Header";
import {
    Phone,
    CheckCircle,
    Clock,
    UserPlus,
    Calendar,
    Award,
    CheckSquare,
    Edit,
    X,
    Save
} from "lucide-react";

const DEFAULT_PROFILE =
    "https://ui-avatars.com/api/?name=Student&background=0D6EFD&color=fff&size=128";

export default function EnrolledStudentsPage() {
    const apiModel = new ApiModel();

    const [studentList, setStudentList] = useState([]);
    const [batchList, setBatchList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allocationType, setAllocationType] = useState("NOT_ALLOCATED");
    const [completionLoading, setCompletionLoading] = useState({});
    const [certificateLoading, setCertificateLoading] = useState({});

    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedBatchId, setSelectedBatchId] = useState(null);

    // NEW STATE FOR EDIT MODAL
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [availableBatchesForEdit, setAvailableBatchesForEdit] = useState([]);
    const [selectedEditBatchId, setSelectedEditBatchId] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    /* ================= FETCH STUDENTS ================= */
    useEffect(() => {
        fetchStudents();
        setSelectedStudents([]);
        setSelectedBatchId(null);
    }, [allocationType]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const apiName =
                allocationType === "ALLOCATED"
                    ? "GetEnrolledStudentsAllocated"
                    : "GetEnrolledStudentsNotAllocated";

            const res = await apiModel.PostMethod({}, apiName);
            setStudentList(res?.data || []);
        } catch (err) {
            console.error("Student fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    /* ================= FETCH BATCHES ================= */
    useEffect(() => {
        if (selectedCourse) {
            fetchBatchesForSelectedCourse(selectedCourse);
        } else {
            setBatchList([]);
            setSelectedBatchId(null);
        }
    }, [selectedCourse]);

    const fetchBatchesForSelectedCourse = async (courseId) => {
        try {
            const res = await apiModel.PostMethod(
                { CourseId: Number(courseId) },
                "BatchTimeRead"
            );
            setBatchList(res?.data || []);
        } catch (err) {
            console.error("Batch fetch error:", err);
            setBatchList([]);
        }
    };

    /* ================= FETCH BATCHES FOR EDIT ================= */
    const fetchBatchesForEdit = async (courseId) => {
        try {
            const res = await apiModel.PostMethod(
                { CourseId: Number(courseId) }, // Ensure courseId is passed correctly
                "BatchTimeRead"
            );

            // Filter batches to only include those for the specific course
            const filteredBatches = res?.data?.filter(batch =>
                Number(batch.CourseId) === Number(courseId)
            ) || [];

            setAvailableBatchesForEdit(filteredBatches);

            // Set current batch as selected by default if available
            if (filteredBatches.length > 0) {
                setSelectedEditBatchId(filteredBatches[0].BatchId);
            } else {
                setSelectedEditBatchId(null);
            }
        } catch (err) {
            console.error("Batch fetch error for edit:", err);
            setAvailableBatchesForEdit([]);
            setSelectedEditBatchId(null);
        }
    };

    /* ================= FILTERED BATCHES ================= */
    const filteredBatches = useMemo(() => {
        if (!selectedCourse) return [];
        return batchList.filter(
            (b) => Number(b.CourseId) === Number(selectedCourse)
        );
    }, [batchList, selectedCourse]);

    /* ================= COURSE LIST ================= */
    const courseList = useMemo(() => {
        const map = new Map();
        studentList.forEach((s) => {
            if (s.CourseId && s.CourseName) {
                map.set(s.CourseId, s.CourseName);
            }
        });
        return Array.from(map, ([CourseId, CourseName]) => ({
            CourseId,
            CourseName
        }));
    }, [studentList]);

    /* ================= FILTERED STUDENTS ================= */
    const filteredStudents = useMemo(() => {
        if (!selectedCourse) return studentList;
        return studentList.filter(
            (s) => Number(s.CourseId) === Number(selectedCourse)
        );
    }, [studentList, selectedCourse]);

    /* ================= SELECTION ================= */
    const handleSelectStudent = (id) => {
        setSelectedStudents((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudents(filteredStudents.map((s) => s.StudentId));
        } else {
            setSelectedStudents([]);
        }
    };

    /* ================= ALLOCATION ================= */
    const handleAllocation = async () => {
        if (!selectedBatchId) {
            alert("Please select a batch");
            return;
        }

        if (selectedStudents.length === 0) {
            alert("Please select students");
            return;
        }

        try {
            setLoading(true);

            for (const studentId of selectedStudents) {
                const payload = {
                    STUDENTID: studentId.toString(),
                    COURSEID: selectedCourse.toString(),
                    BATCHID: selectedBatchId.toString(),
                    CODATE: null,
                    CERDATE: null
                };

                await apiModel.PostMethod(
                    payload,
                    "BatchTimeAllocatedInsert"
                );
            }

            alert("Students allocated successfully");
            fetchStudents();
            setSelectedStudents([]);
            setSelectedBatchId(null);

        } catch (err) {
            console.error("Allocation error:", err);
            alert("Allocation failed");
        } finally {
            setLoading(false);
        }
    };

    /* ================= EDIT BATCH HANDLER ================= */
    const handleEditBatch = async (student) => {
        try {
            setEditingStudent(student);

            // Fetch available batches for this specific course
            await fetchBatchesForEdit(student.CourseId);

            setEditModalOpen(true);
        } catch (err) {
            console.error("Error preparing edit:", err);
            alert("Failed to load batch information");
        }
    };

    /* ================= UPDATE STUDENT BATCH ================= */
    const handleUpdateStudentBatch = async () => {
        if (!editingStudent || !selectedEditBatchId) {
            alert("Missing required information");
            return;
        }

        try {
            setUpdateLoading(true);

            const payload = {
                STUDENTID: editingStudent.StudentId.toString(),
                COURSEID: editingStudent.CourseId.toString(),
                BATCHID: selectedEditBatchId.toString()
            };

            const response = await apiModel.PostMethod(
                payload,
                "UpdateStudentBatch"
            );

            if (response.success) {
                alert("Student batch updated successfully!");

                // Update the student list locally
                setStudentList(prev =>
                    prev.map(s =>
                        s.StudentId === editingStudent.StudentId &&
                        s.CourseId === editingStudent.CourseId
                            ? {
                                ...s,
                                BatchId: selectedEditBatchId,
                                // Also update batch title if available
                                BatchTitle: availableBatchesForEdit.find(
                                    b => b.BatchId === selectedEditBatchId
                                )?.Title || s.BatchTitle
                            }
                            : s
                    )
                );

                // Close modal
                setEditModalOpen(false);
                setEditingStudent(null);
                setSelectedEditBatchId(null);
                setAvailableBatchesForEdit([]);
            } else {
                alert(response.message || "Failed to update batch");
            }
        } catch (err) {
            console.error("Update batch error:", err);
            alert("Failed to update student batch");
        } finally {
            setUpdateLoading(false);
        }
    };

    /* ================= COURSE COMPLETION ================= */
    const handleUpdateCourseCompletion = async (studentId, courseId) => {
        try {
            setCompletionLoading(prev => ({ ...prev, [studentId]: true }));
            const response = await apiModel.PostMethod({
                STUDENTID: studentId.toString(),
                COURSEID: courseId.toString()
            }, "UpdateCourseCompletion");

            if (response.success) {
                setStudentList(prev =>
                    prev.map(s =>
                        s.StudentId === studentId && s.CourseId === courseId
                            ? { ...s, CourseCompleted: "YES", CODATE: new Date().toISOString() }
                            : s
                    )
                );
                alert("Course completion status updated");
            } else {
                alert(response.message || "Failed to update course completion");
            }
        } catch (err) {
            console.error("Update completion error:", err);
            alert("Failed to update course completion");
        } finally {
            setCompletionLoading(prev => ({ ...prev, [studentId]: false }));
        }
    };

    /* ================= CERTIFICATE GENERATION ================= */
    const handleUpdateCertificateIssue = async (studentId, courseId) => {
        try {
            setCertificateLoading(prev => ({ ...prev, [studentId]: true }));
            const response = await apiModel.PostMethod({
                STUDENTID: studentId.toString(),
                COURSEID: courseId.toString()
            }, "UpdateCertificateIssue");

            if (response.success) {
                setStudentList(prev =>
                    prev.map(s =>
                        s.StudentId === studentId && s.CourseId === courseId
                            ? { ...s, CertificateGenerated: "YES", CERDATE: new Date().toISOString() }
                            : s
                    )
                );
                alert("Certificate generated successfully");
            } else {
                alert(response.message || "Failed to generate certificate");
            }
        } catch (err) {
            console.error("Update certificate error:", err);
            alert("Failed to generate certificate");
        } finally {
            setCertificateLoading(prev => ({ ...prev, [studentId]: false }));
        }
    };

    /* ================= FORMATTING FUNCTIONS ================= */
    const formatTime = (dt) =>
        dt
            ? new Date(dt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            })
            : "";

    const formatDate = (dt) =>
        dt
            ? new Date(dt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })
            : "";

    const isAllocated = allocationType === "ALLOCATED";

    return (
        <div className="ttr-opened-sidebar ttr-pinned-sidebar">
            <Header />
            <Sidebar />

            <main className="ttr-wrapper">
                <div className="container-fluid py-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">Enrolled Students</h2>
                        <div className="d-flex gap-2">
                            <button
                                className={`btn btn-sm ${!isAllocated ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setAllocationType("NOT_ALLOCATED")}
                            >
                                Pending Allocation
                            </button>
                            <button
                                className={`btn btn-sm ${isAllocated ? "btn-success" : "btn-outline-success"}`}
                                onClick={() => setAllocationType("ALLOCATED")}
                            >
                                Allocated Students
                            </button>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="row mb-4">
                        <div className="col-md-4 mb-3 mb-md-0">
                            <select
                                className="form-select form-select-lg"
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option value="">All Courses</option>
                                {courseList.map((c) => (
                                    <option key={c.CourseId} value={c.CourseId}>
                                        {c.CourseName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-8">
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                                {selectedCourse && filteredBatches.length > 0 ? (
                                    <>
                                        <span className="text-muted">Available Batches:</span>
                                        {filteredBatches.map((b) => (
                                            <button
                                                key={b.BatchId}
                                                className={`btn btn-sm ${selectedBatchId === b.BatchId ? "btn-primary" : "btn-outline-primary"}`}
                                                onClick={() => setSelectedBatchId(b.BatchId)}
                                                title={`${formatTime(b.StartTime)} - ${formatTime(b.EndTime)}`}
                                            >
                                                <Calendar size={14} /> {b.Title} | {formatTime(b.StartTime)}
                                            </button>
                                        ))}
                                    </>
                                ) : selectedCourse ? (
                                    <div className="alert alert-warning py-2 mb-0">
                                        No batches available for this course
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="card shadow">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                    <tr>
                                        {!isAllocated && (
                                            <th width="50">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={
                                                        filteredStudents.length > 0 &&
                                                        selectedStudents.length === filteredStudents.length
                                                    }
                                                />
                                            </th>
                                        )}
                                        <th>Student</th>
                                        <th>Mobile</th>
                                        <th>Course</th>
                                        <th>Status</th>
                                        {isAllocated && (
                                            <>
                                                <th>Current Batch</th>
                                                <th>Course Completion</th>
                                                <th>Certificate</th>
                                                <th>Actions</th>
                                            </>
                                        )}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={isAllocated ? 8 : 5} className="text-center py-4">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredStudents.length > 0 ? (
                                        filteredStudents.map((s) => {
                                            // Find batch details for allocated students
                                            const batchDetails = isAllocated && s.BatchId
                                                ? batchList.find(b => b.BatchId === s.BatchId)
                                                : null;

                                            return (
                                                <tr key={`${s.StudentId}-${s.CourseId}`}>
                                                    {!isAllocated && (
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedStudents.includes(s.StudentId)}
                                                                onChange={() => handleSelectStudent(s.StudentId)}
                                                            />
                                                        </td>
                                                    )}
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <img
                                                                src={s.Profile || DEFAULT_PROFILE}
                                                                width="40"
                                                                height="40"
                                                                className="rounded-circle object-fit-cover"
                                                                alt={s.StudentName}
                                                            />
                                                            <div>
                                                                <div className="fw-medium">{s.StudentName}</div>
                                                                <small className="text-muted">ID: {s.StudentId}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <Phone size={14} />
                                                            {s.Mobile}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <div className="fw-medium">{s.CourseName}</div>
                                                            <small className="text-muted">ID: {s.CourseId}</small>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {isAllocated ? (
                                                            <span className="badge bg-success">
                                                                <CheckCircle size={12} className="me-1" /> Allocated
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-warning text-dark">
                                                                <Clock size={12} className="me-1" /> Pending
                                                            </span>
                                                        )}
                                                    </td>
                                                    {isAllocated && (
                                                        <>
                                                            <td>
                                                                {batchDetails ? (
                                                                    <div>
                                                                        <div className="fw-medium">{batchDetails.Title}</div>
                                                                        <small className="text-muted">
                                                                            {formatTime(batchDetails.StartTime)} - {formatTime(batchDetails.EndTime)}
                                                                        </small>
                                                                        {s.BatchId && (
                                                                            <div className="text-muted small">
                                                                                Batch ID: {s.BatchId}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : s.BatchTitle ? (
                                                                    <div>
                                                                        <div className="fw-medium">{s.BatchTitle}</div>
                                                                        <small className="text-muted">
                                                                            Batch ID: {s.BatchId}
                                                                        </small>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-muted">Not set</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {s.CourseCompleted === "YES" ? (
                                                                    <div>
                                                                        <span className="badge bg-success me-1">
                                                                            <CheckSquare size={12} className="me-1" /> Completed
                                                                        </span>
                                                                        <div className="text-muted small mt-1">
                                                                            {formatDate(s.CODATE)}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        className="btn btn-sm btn-outline-success"
                                                                        onClick={() => handleUpdateCourseCompletion(s.StudentId, s.CourseId)}
                                                                        disabled={completionLoading[s.StudentId] || loading}
                                                                    >
                                                                        {completionLoading[s.StudentId] ? (
                                                                            <span className="spinner-border spinner-border-sm me-1" />
                                                                        ) : (
                                                                            <CheckSquare size={14} className="me-1" />
                                                                        )}
                                                                        Mark Complete
                                                                    </button>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {s.CertificateGenerated === "YES" ? (
                                                                    <div>
                                                                        <span className="badge bg-primary me-1">
                                                                            <Award size={12} className="me-1" /> Generated
                                                                        </span>
                                                                        <div className="text-muted small mt-1">
                                                                            {formatDate(s.CERDATE)}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => handleUpdateCertificateIssue(s.StudentId, s.CourseId)}
                                                                        disabled={certificateLoading[s.StudentId] || loading || s.CourseCompleted !== "YES"}
                                                                        title={s.CourseCompleted !== "YES" ? "Complete course first" : ""}
                                                                    >
                                                                        {certificateLoading[s.StudentId] ? (
                                                                            <span className="spinner-border spinner-border-sm me-1" />
                                                                        ) : (
                                                                            <Award size={14} className="me-1" />
                                                                        )}
                                                                        Generate
                                                                    </button>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <button
                                                                        className="btn btn-sm btn-outline-secondary"
                                                                        onClick={() => handleEditBatch(s)}
                                                                        title="Change batch"
                                                                    >
                                                                        <Edit size={14} className="me-1" /> Edit Batch
                                                                    </button>
                                                                    {s.CourseCompleted === "YES" && s.CertificateGenerated === "YES" && (
                                                                        <button className="btn btn-sm btn-outline-info">
                                                                            View Certificate
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={isAllocated ? 8 : 5} className="text-center py-4">
                                                <div className="text-muted">
                                                    {selectedCourse
                                                        ? `No ${allocationType === "ALLOCATED" ? "allocated" : "pending"} students found for selected course`
                                                        : `Select a course to view ${allocationType === "ALLOCATED" ? "allocated" : "pending"} students`
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Actions for Not Allocated */}
                    {!isAllocated && selectedStudents.length > 0 && selectedBatchId && (
                        <div className="sticky-bottom bg-white border-top py-3 mt-4">
                            <div className="container-fluid">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="text-muted">
                                            {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
                                        </span>
                                    </div>
                                    <div>
                                        <button
                                            className="btn btn-success px-4"
                                            onClick={handleAllocation}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" />
                                                    Allocating...
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus size={16} className="me-2" />
                                                    Allocate Selected Students to Batch
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isAllocated && selectedStudents.length > 0 && !selectedBatchId && (
                        <div className="alert alert-warning mt-3">
                            <div className="d-flex align-items-center">
                                <Clock size={16} className="me-2" />
                                <div>
                                    <strong>{selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected</strong>
                                    <div className="small">Please select a batch to allocate these students.</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Edit Batch Modal */}
            {editModalOpen && editingStudent && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Student Batch</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setEditModalOpen(false);
                                        setEditingStudent(null);
                                        setSelectedEditBatchId(null);
                                        setAvailableBatchesForEdit([]);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <p><strong>Student:</strong> {editingStudent.StudentName}</p>
                                    <p><strong>Course:</strong> {editingStudent.CourseName}</p>
                                    <p><strong>Current Batch ID:</strong> {editingStudent.BatchId || 'Not set'}</p>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Select New Batch</label>
                                    {availableBatchesForEdit.length > 0 ? (
                                        <div className="list-group">
                                            {availableBatchesForEdit.map((batch) => (
                                                <div
                                                    key={batch.BatchId}
                                                    className={`list-group-item list-group-item-action cursor-pointer ${
                                                        selectedEditBatchId === batch.BatchId ? 'active' : ''
                                                    }`}
                                                    onClick={() => setSelectedEditBatchId(batch.BatchId)}
                                                >
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <strong>{batch.Title}</strong>
                                                            <div className="small">
                                                                {formatTime(batch.StartTime)} - {formatTime(batch.EndTime)}
                                                            </div>
                                                        </div>
                                                        {selectedEditBatchId === batch.BatchId && (
                                                            <CheckCircle size={16} />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="alert alert-warning">
                                            No batches available for this course
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setEditModalOpen(false);
                                        setEditingStudent(null);
                                        setSelectedEditBatchId(null);
                                        setAvailableBatchesForEdit([]);
                                    }}
                                >
                                    <X size={16} className="me-1" /> Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleUpdateStudentBatch}
                                    disabled={!selectedEditBatchId || updateLoading}
                                >
                                    {updateLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} className="me-1" /> Update Batch
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}