// npm install react react-dom @fullcalendar/react @fullcalendar/daygrid
// @fullcalendar/timegrid @fullcalendar/interaction date-fns@2.30.0 bootstrap react-icons

import React, { useState, useRef, useMemo, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, addHours } from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Style.css";

import ApiModel from "../../../../../API/ApiModel";
import Header from "../Header";
import Sidebar from "../Sidebar";

export default function BatchCalendarPage() {
    return (
        <div className="ttr-opened-sidebar ttr-pinned-sidebar">
            <Header />
            <Sidebar />
            <BatchCalendarContent />
        </div>

    );
}

function BatchCalendarContent() {
    const api = new ApiModel();

    const [batches, setBatches] = useState([]);
    const [courses, setCourses] = useState([]);
    const [faculty, setFaculty] = useState([]);

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [selectedBatch, setSelectedBatch] = useState(null);

    const [formData, setFormData] = useState({
        Title: "",
        CourseId: "",
        InstructorId: "",
        StartTime: "",
        EndTime: "",
    });

    const calendarRef = useRef();

    // *******************************
    // DATETIME HELPERS (FIX START/END)
    // *******************************
    function toDateTimeLocal(dateString) {
        if (!dateString) return "";
        const d = new Date(dateString.replace(" ", "T"));
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    }

    function fromDateTimeLocal(dt) {
        return dt.replace("T", " ") + ":00";
    }

    // -----------------------------------
    // 🔥 FUNCTION TO GET COURSE IDS FROM FACULTY
    // -----------------------------------
    function getFacultyCourseIds(f) {
        try {
            if (!f.Courses) return [];

            const parsed = JSON.parse(f.Courses);
            const arr = Array.isArray(parsed) ? parsed : [parsed];

            return arr.map((c) => String(c.Id));
        } catch (err) {
            console.error("Invalid faculty.Courses format:", f.Courses);
            return [];
        }
    }

    // -----------------------------------
    // FILTER FACULTY BASED ON COURSE
    // -----------------------------------
    const filteredFaculty = useMemo(() => {
        if (!formData.CourseId) return faculty;
        return faculty.filter((f) =>
            getFacultyCourseIds(f).includes(String(formData.CourseId))
        );
    }, [faculty, formData.CourseId]);

    // -----------------------------------
    // LOAD DATA
    // -----------------------------------
    useEffect(() => {
        loadBatches();
        loadCourses();
        loadFaculty();
    }, [search]);

    const loadCourses = () => {
        api.PostMethod({ search: "" }, "CoursesRead").then((res) =>
            setCourses(res.data || [])
        );
    };

    const loadFaculty = () => {
        api.PostMethod({ search: "" }, "FacultyRead").then((res) =>
            setFaculty(res.data || [])
        );
    };

    const loadBatches = () => {
        api.PostMethod({ search }, "BatchTimeRead").then((res) => {
            const dataArr = Array.isArray(res) ? res : res.data;

            if (!Array.isArray(dataArr)) return;

            const formatted = dataArr.map((b) => ({
                id: b.BatchId,
                title: b.BatchTitle,
                start: b.StartTime,
                end: b.EndTime,
                backgroundColor: "#2196F3",
                extendedProps: {
                    courseName: b.CourseName,
                    facultyName: b.FacultyName,
                    fullData: b,
                },
            }));

            setBatches(formatted);
        });
    };

    // -----------------------------------
    // SELECT TIME → ADD NEW
    // -----------------------------------
    const handleSelect = (info) => {
        const start = new Date(info.start);
        const end = addHours(start, 1);

        setFormData({
            Title: "",
            CourseId: "",
            InstructorId: "",
            StartTime: format(start, "yyyy-MM-dd HH:mm:ss"),
            EndTime: format(end, "yyyy-MM-dd HH:mm:ss"),
        });

        setSelectedBatch(null);
        setShowModal(true);
    };

    // -----------------------------------
    // CLICK EVENT → EDIT
    // -----------------------------------
    const handleEventClick = (info) => {
        const batch = info.event.extendedProps.fullData;
        setSelectedBatch(batch);

        setFormData({
            Title: batch.BatchTitle,
            CourseId: batch.CourseId,
            InstructorId: batch.FacultyId,
            StartTime: batch.StartTime,
            EndTime: batch.EndTime,
        });

        setShowModal(true);
    };

    // -----------------------------------
    // SAVE
    // -----------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        const apiName = selectedBatch ? "BatchTimeUpdate" : "BatchTimeInsert";

        const payload = {
            ...formData,
            Id: selectedBatch?.BatchId,
        };

        const res = await api.PostMethod(payload, apiName);

        if (res.success) {
            alert(selectedBatch ? "Batch Updated" : "Batch Added");
            setShowModal(false);
            loadBatches();
        } else {
            alert("Failed! " + res.error);
        }
    };

    // -----------------------------------
    // DELETE
    // -----------------------------------
    const handleDelete = async () => {
        if (!window.confirm("Delete this batch permanently?")) return;

        const res = await api.PostMethod(
            { Id: selectedBatch.BatchId },
            "BatchTimeDelete"
        );

        if (res.success) {
            alert("Deleted!");
            setShowModal(false);
            loadBatches();
        }
    };

    return (
        <>
            <main className="ttr-wrapper">
                <div className="container-fluid mt-3">
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Search batch, faculty, course..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        selectable={true}
                        events={batches}
                        select={handleSelect}
                        eventClick={handleEventClick}
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                        }}
                        slotMinTime="07:00:00"
                        slotMaxTime="21:00:00"
                    />
                </div>
            </main>

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content-lg shadow-lg p-4 rounded">
                        <h3 className="mb-3 text-center fw-bold">
                            {selectedBatch ? "Edit Batch" : "Add New Batch"}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            {/* Title */}
                            <label className="form-label fw-semibold">Batch Title</label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Enter Batch Title"
                                value={formData.Title}
                                onChange={(e) =>
                                    setFormData({ ...formData, Title: e.target.value })
                                }
                                required
                            />

                            {/* Course */}
                            <label className="form-label fw-semibold">Select Course</label>
                            <select
                                className="form-select mb-3"
                                value={formData.CourseId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        CourseId: e.target.value,
                                        InstructorId: "",
                                    })
                                }
                                required
                            >
                                <option value="">Choose Course</option>
                                {courses.map((c) => (
                                    <option key={c.Id} value={c.Id}>
                                        {c.Name}
                                    </option>
                                ))}
                            </select>

                            {/* Faculty */}
                            <label className="form-label fw-semibold">Select Faculty</label>
                            <select
                                className="form-select mb-3"
                                value={formData.InstructorId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        InstructorId: e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">
                                    {filteredFaculty.length > 0
                                        ? "Choose Faculty"
                                        : "No faculty available"}
                                </option>

                                {filteredFaculty.map((f) => (
                                    <option key={f.Id} value={f.Id}>
                                        {f.Name}
                                    </option>
                                ))}
                            </select>

                            {/* Start Time */}
                            <label className="form-label fw-semibold">Start Date & Time</label>
                            <input
                                type="datetime-local"
                                className="form-control mb-3"
                                value={toDateTimeLocal(formData.StartTime)}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        StartTime: fromDateTimeLocal(e.target.value),
                                    })
                                }
                                required
                            />

                            {/* End Time */}
                            <label className="form-label fw-semibold">End Date & Time</label>
                            <input
                                type="datetime-local"
                                className="form-control mb-4"
                                value={toDateTimeLocal(formData.EndTime)}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        EndTime: fromDateTimeLocal(e.target.value),
                                    })
                                }
                                required
                            />

                            {/* Buttons */}
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-success px-4" type="submit">
                                    {selectedBatch ? "Update Batch" : "Save Batch"}
                                </button>

                                <button
                                    className="btn btn-secondary px-4"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                {selectedBatch && (
                                    <button
                                        className="btn btn-danger px-4"
                                        type="button"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
