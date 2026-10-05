// npm install react react-dom @fullcalendar/react @fullcalendar/daygrid
// @fullcalendar/timegrid @fullcalendar/interaction date-fns@2.30.0 bootstrap react-icons

import React, { useState, useRef, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, addHours, addDays, eachHourOfInterval } from "date-fns";

import ApiModel from "../../../../../API/ApiModel";

const BatchCalendarWithFullCalendar = () => {
    const apiModel = new ApiModel();

    const [search] = useState("");
    const [loading, setLoading] = useState(false);

    const [courseList, setCourseList] = useState([]);
    const [facultyList, setFacultyList] = useState([]);
    const [selectCourseId, setSelectCourseId] = useState(null);
    const [selectedFacultyId, setSelectedFacultyId] = useState(null);

    const [batches, setBatches] = useState([]);
    const [showAddBatchModal, setShowAddBatchModal] = useState(false);
    const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);

    const [newBatch, setNewBatch] = useState({
        title: "",
        course: "",
        faculty: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
    });

    const calendarRef = useRef(null);

    // ---------- Fetch Courses ----------
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const data = { search };
                const response = await apiModel.PostMethod(data, "CoursesRead");
                setCourseList(response.data || []);
            } catch (err) {
                console.error("CoursesRead error", err);
                setCourseList([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [search]);

    // ---------- Fetch Faculty ----------
    useEffect(() => {
        const fetchFaculty = async () => {
            setLoading(true);
            try {
                const data = { search };
                const response = await apiModel.PostMethod(data, "FacultyRead");
                setFacultyList(response.data || []);
            } catch (err) {
                console.error("FacultyRead error", err);
                setFacultyList([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFaculty();
    }, [search]);

    useEffect(() => {
        fetchBatchTimes();
    }, []);

    // Helper to format dates for calendar
    function formatDateForCalendar(dt) {
        const d = new Date(dt);
        return d.toISOString();
    }

    // ---------- Handle slot select ----------
    const handleSelect = (selectInfo) => {
        const start = new Date(selectInfo.start);
        const end = addHours(start, 1);

        setNewBatch({
            title: "",
            course: "",
            faculty: "",
            startDate: format(start, "yyyy-MM-dd"),
            endDate: format(start, "yyyy-MM-dd"),
            startTime: format(start, "HH:mm"),
            endTime: format(end, "HH:mm"),
        });

        setSelectedSlotInfo(selectInfo);
        setSelectCourseId(null);
        setSelectedFacultyId(null);
        setShowAddBatchModal(true);
    };

    // ---------- Form handlers ----------
    const handleBatchFieldChange = (e) => {
        const { name, value } = e.target;
        setNewBatch((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCourseChange = (e) => {
        const value = e.target.value === "none" ? null : e.target.value;
        setSelectCourseId(value);
        setNewBatch((prev) => ({ ...prev, course: value }));
        setSelectedFacultyId(null);
    };

    const handleFacultyChange = (e) => {
        const value = e.target.value === "none" ? null : e.target.value;
        setSelectedFacultyId(value);
        setNewBatch((prev) => ({ ...prev, faculty: value }));
    };

    const formatForBackend = (dt) => format(dt, "yyyy-MM-dd HH:mm:ss");

    // ---------- Add or Update Batch ----------

    const handleAddBatchSubmit = async (e) => {
        e.preventDefault();

        const { startDate, endDate, startTime, endTime, title, course, faculty } = newBatch;

        if (!title || !startDate || !endDate || !startTime || !endTime || !course || !faculty) {
            alert("Please fill all required fields!");
            return;
        }

        // Convert to MySQL DATETIME format (Local)
        const formatMySQLDateTime = (date, time) => {
            return `${date} ${time}:00`; // Example: "2025-12-10 10:00:00"
        };

        const sDateTime = formatMySQLDateTime(startDate, startTime);
        const eDateTime = formatMySQLDateTime(endDate, endTime);

        const payload = {
            Title: title,
            StartTime: sDateTime,  // Save "YYYY-MM-DD HH:MM:SS"
            EndTime: eDateTime,
            InstructorId: parseInt(faculty, 10),
            CourseId: parseInt(course, 10),
        };


        setLoading(true);
        try {
            if (selectedSlotInfo && selectedSlotInfo.event) {
                payload.Id = parseInt(selectedSlotInfo.event.id, 10);
                await apiModel.PostMethod(payload, "BatchTimeUpdate");
            } else {
                await apiModel.PostMethod(payload, "BatchTimeInsert");
            }

            await fetchBatchTimes();
            setShowAddBatchModal(false);
            setSelectedSlotInfo(null);
            setNewBatch({
                title: "",
                course: "",
                faculty: "",
                startDate: "",
                endDate: "",
                startTime: "",
                endTime: "",
            });
            setSelectCourseId(null);
            setSelectedFacultyId(null);
        } catch (err) {
            console.error("BatchTimeInsert/Update error", err);
            alert("Error saving batch. Check console.");
        } finally {
            setLoading(false);
        }
    };


    const handleCloseModal = () => {
        setShowAddBatchModal(false);
        setSelectedSlotInfo(null);
    };

    // ---------- Fetch Batches ----------
    const fetchBatchTimes = async () => {
        setLoading(true);
        try {
            const resp = await apiModel.PostMethod({}, "BatchTimeRead");
            const rows = resp.data || [];
            console.log(rows);
            const events=[];
            rows.forEach((r)=>{
                const arr = [];
                let current = new Date(r.StartTime);
                const end = new Date(r.EndTime);

                const hour = current.getHours();
                const min = current.getMinutes();

                while (current <= end) {
                    const start = new Date(current);
                    start.setHours(hour, min, 0, 0);

                    const nextDay = addDays(current, 1);

                    arr.push({
                        id: String(r.BatchId),
                        title: r.BatchTitle,

                        start: formatDateForCalendar(start),
                        end: formatDateForCalendar(start), // Same datetime (you can adjust later)
                        extendedProps: {
                            InstructorId: r.FacultyId,
                            CourseId: r.CourseId,
                            startDate:r.StartTime,
                            endDate:r.EndTime,
                        },
                        backgroundColor: "#4CAF50"
                    });

                    current = nextDay;
                }

                events.push(...arr);

            });

            setBatches(events);
        } catch (err) {
            console.error("BatchTimeRead error", err);
            setBatches([]);
        } finally {
            setLoading(false);
        }
    };


    // ---------- Handle event click ----------
    const handleEventClick = (clickInfo) => {
        const event = clickInfo.event;
        console.log("===========================");
        console.log(event.extendedProps.startDate);
        console.log(event.extendedProps.endDate);
        console.log(event);
        console.log("===========================");

        const startDateTime=formatForInputs(event.extendedProps.startDate);
        const endDateTime=formatForInputs(event.extendedProps.endDate);
        console.log(startDateTime);
        console.log(endDateTime);

        setNewBatch({
            title: event.title,
            course: event.extendedProps?.CourseId || "",
            faculty: event.extendedProps?.InstructorId || "",
            startDate: startDateTime.date,
            endDate: endDateTime.date,
            startTime: startDateTime.time,
            endTime: endDateTime.time,
        });

        setSelectCourseId(event.extendedProps?.CourseId || "");
        setSelectedFacultyId(event.extendedProps?.InstructorId || "");
        setSelectedSlotInfo(clickInfo);
        setShowAddBatchModal(true);
    };
    function formatForInputs(isoString, useUTC = false) {
        const dateObj = new Date(isoString);

        if (isNaN(dateObj.getTime())) {
            return { date: "", time: "" };
        }

        const year = useUTC ? dateObj.getUTCFullYear() : dateObj.getFullYear();
        const month = String((useUTC ? dateObj.getUTCMonth() : dateObj.getMonth()) + 1).padStart(2, "0");
        const day = String(useUTC ? dateObj.getUTCDate() : dateObj.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        const hours = useUTC ? dateObj.getUTCHours() : dateObj.getHours();
        const minutes = useUTC ? dateObj.getUTCMinutes() : dateObj.getMinutes();
        const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

        return {
            date: formattedDate, // for <input type="date">
            time: formattedTime  // for <input type="time">
        };
    }

    // ---------- Sidebar today’s slots ----------
    const today = new Date();
    const todayDateString = format(today, "yyyy-MM-dd");

    const allSlots = eachHourOfInterval({
        start: new Date(today.setHours(7, 0, 0, 0)),
        end: new Date(today.setHours(21, 0, 0, 0)),
    });

    // Use useMemo to update bookedTimes when batches change
    const bookedTimes = useMemo(
        () =>
            batches
                .filter((e) => format(new Date(e.start), "yyyy-MM-dd") === todayDateString)
                .map((e) => format(new Date(e.start), "HH:mm")),
        [batches, todayDateString]
    );

    // ---------- Faculty options based on selected course ----------
    function FacultyListOption({ f }) {
        const course = JSON.parse(f.Courses || "[]");
        const selectId = parseInt(selectCourseId || 0, 10);
        const matched = course.find((item) => Number(item.Id) === selectId);

        if (matched) {
            return (
                <option key={f.Id} value={f.Id}>
                    {f.Name}
                </option>
            );
        }
        return null;
    }

    return (
        <div className="calendar-page">
            <div className="calendar-container">
                <h2>📅 Batch Scheduler</h2>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    initialView="timeGridWeek"
                    selectable={true}
                    selectMirror={true}
                    hiddenDays={[0]}
                    slotMinTime="07:00:00"
                    slotMaxTime="21:00:00"
                    slotDuration="01:00:00"
                    events={batches}
                    select={handleSelect}
                    eventClick={handleEventClick}
                    height="auto"
                />
            </div>

            <div className="sidebar">
                <h3>🕒 Today's Time Slots</h3>
                {allSlots.map((slot, i) => {
                    const slotTime = format(slot, "HH:mm");
                    const isBooked = bookedTimes.includes(slotTime);
                    return (
                        <div
                            key={i}
                            className="slot-box"
                            style={{
                                backgroundColor: isBooked ? "#FFCDD2" : "#C8E6C9",
                                borderLeft: isBooked ? "4px solid #E53935" : "4px solid #388E3C",
                            }}
                        >
                            {format(slot, "hh:mm a")} - {format(addHours(slot, 1), "hh:mm a")}
                            <span style={{ float: "right", fontWeight: "bold" }}>
                {isBooked ? "Booked" : "Available"}
              </span>
                        </div>
                    );
                })}
            </div>

            {showAddBatchModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{selectedSlotInfo?.event ? "Edit Batch" : "Book Batch Slot"}</h2>
                        <form onSubmit={handleAddBatchSubmit}>
                            <div className="form-group">
                                <label>Batch Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newBatch.title}
                                    onChange={handleBatchFieldChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Course</label>
                                <select
                                    name="course"
                                    value={selectCourseId ?? "none"}
                                    onChange={handleCourseChange}
                                    required
                                >
                                    <option value="none">Select Course</option>
                                    {courseList.map((c) => (
                                        <option key={c.Id} value={c.Id}>
                                            {c.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Faculty</label>
                                <select
                                    name="faculty"
                                    value={selectedFacultyId ?? ""}
                                    onChange={handleFacultyChange}
                                    required
                                >
                                    <option value="">Select Faculty</option>
                                    {facultyList.map((f) => (
                                        <FacultyListOption key={f.Id} f={f} />
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={newBatch.startDate}
                                    onChange={handleBatchFieldChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={newBatch.endDate}
                                    onChange={handleBatchFieldChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Start Time</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={newBatch.startTime}
                                    onChange={handleBatchFieldChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>End Time</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={newBatch.endTime}
                                    onChange={handleBatchFieldChange}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button className="save-button" type="submit" disabled={loading}>
                                    {loading ? "Saving..." : "Save"}
                                </button>
                                <button className="cancel-button" type="button" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
        .calendar-page {
          display: flex;
          gap: 20px;
          padding: 20px;
        }
        .calendar-container {
          flex: 3;
          background: white;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .sidebar {
          flex: 1;
          background: #fafafa;
          padding: 20px;
          border-radius: 10px;
          max-height: 650px;
          overflow-y: auto;
        }
        .slot-box {
          padding: 10px;
          margin-bottom: 8px;
          border-radius: 6px;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          width: 400px;
          background: white;
          padding: 25px;
          border-radius: 8px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group select,
        .form-group input {
          width: 100%;
          padding: 8px;
        }
        .save-button {
          padding: 10px 20px;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
        }
        .cancel-button {
          padding: 10px 20px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          margin-left: 10px;
        }
      `}</style>
        </div>
    );
};

export default BatchCalendarWithFullCalendar;
