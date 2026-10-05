import React, { useEffect, useState } from "react";
import Header from "./Componant/Header";
import Sidebar from "./Componant/Sidebar";
import EventForm from "./Componant/Events/EventForm";
import ApiModel from "../../../API/ApiModel";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EventPage() {
    return (
        <div className="ttr-opened-sidebar ttr-pinned-sidebar">
            <Header />
            <Sidebar />
            <EventData />
        </div>
    );
}

function EventData() {
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [eventList, setEventList] = useState([]);

    return (
        <>
            <main className="ttr-wrapper">
                <div className="container-fluid">
                    <div className="db-breadcrumb">
                        <h4 className="breadcrumb-title">Event Management</h4>
                        <p className="text-muted">
                            Manage upcoming events, workshops, and seminars
                        </p>
                    </div>

                    <EventHeader
                        setShowModal={setShowModal}
                        setSelectedEvent={setSelectedEvent}
                        search={search}
                        setSearch={setSearch}
                    />

                    <EventList
                        setShowModal={setShowModal}
                        setSelectedEvent={setSelectedEvent}
                        search={search}
                        loading={loading}
                        setLoading={setLoading}
                        eventList={eventList}
                        setEventList={setEventList}
                    />
                </div>
            </main>

            {showModal && (
                <EventForm
                    setShowModal={setShowModal}
                    selectedEvent={selectedEvent}
                />
            )}
        </>
    );
}

function EventHeader({ setShowModal, setSelectedEvent, search, setSearch }) {
    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex flex-column flex-md-row align-items-stretch justify-content-between gap-3 p-4 bg-white rounded-3 shadow-sm">
                <div className="position-relative flex-grow-1">
                    <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                        type="text"
                        className="form-control ps-5 border-0 shadow-sm"
                        placeholder="Search events by name or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button
                    className="btn btn-primary d-flex align-items-center gap-2 px-4 py-3 rounded-2 shadow-sm"
                    onClick={() => {
                        setSelectedEvent(null);
                        setShowModal(true);
                    }}
                >
                    <i className="fas fa-calendar-plus"></i>
                    <span>Add Event</span>
                </button>
            </div>
        </div>
    );
}

function EventList({
                       setShowModal,
                       setSelectedEvent,
                       search,
                       loading,
                       setLoading,
                       eventList,
                       setEventList,
                   }) {
    const apiModel = new ApiModel();
    const [confirmation, setConfirmation] = useState({ show: false, event: null });

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const data = { search };
                const response = await apiModel.PostMethod(data, "EventsRead");
                setEventList(response.data || []);
            } catch (err) {
                console.error("Error fetching events:", err);
                setEventList([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [search]);

    const handleDelete = async (eventId) => {
        try {
            const data = { Id: eventId };
            const response = await apiModel.PostMethod(data, "EventsDelete");

            if (response.success) {
                setEventList(eventList.filter((e) => e.Id !== eventId));
                setConfirmation({ show: false, event: null });
            } else {
                alert("Failed to delete event.");
            }
        } catch (err) {
            console.error("Error deleting event:", err);
        }
    };

    const getImageUrl = (image) => {
        try {
            return apiModel.ReadImage("Event/" + image);

        } catch (error) {
            return (
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent("Event") +
                "&background=0d6efd&color=fff&size=200"
            );
        }
    };

    return (
        <div className="container mt-4">
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading events...</p>
                </div>
            ) : eventList.length > 0 ? (
                <div className="row g-4">
                    {eventList.map((event) => (
                        <div className="col-lg-6 col-xl-4" key={event.Id}>
                            <div className="card h-100 border-0 shadow-sm hover-card">
                                <div className="position-relative">
                                    <img
                                        src={getImageUrl(event.Image)}
                                        alt={event.Name}
                                        className="card-img-top"
                                        style={{
                                            height: "200px",
                                            objectFit: "cover",
                                            borderTopLeftRadius: "10px",
                                            borderTopRightRadius: "10px",
                                        }}
                                    />
                                    <div className="position-absolute top-0 end-0 m-2">
                                        <span className="badge bg-light text-dark">
                                            {event.Category}
                                        </span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{event.Name}</h5>
                                    <p className="text-muted small mb-2">
                                        <i className="fas fa-calendar-alt me-2 text-primary"></i>
                                        {event.DateTime}
                                    </p>
                                    <p className="text-muted small mb-2">
                                        <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                                        {event.Location}
                                    </p>
                                    <p className="card-text small text-muted">
                                        {event.Description?.substring(0, 100)}...
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <a
                                            href={event.GoogleFormLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            <i className="fas fa-link me-1"></i> Register
                                        </a>
                                        <div>
                                            <button
                                                className="btn btn-sm btn-outline-secondary me-2"
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() =>
                                                    setConfirmation({ show: true, event })
                                                }
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No events found</h5>
                    <p className="text-muted">
                        Try adjusting your search or add a new event
                    </p>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => {
                            setSelectedEvent(null);
                            setShowModal(true);
                        }}
                    >
                        <i className="fas fa-plus-circle me-2"></i>Add Your First Event
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmation.show && confirmation.event && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header border-0 pt-4">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() =>
                                        setConfirmation({ show: false, event: null })
                                    }
                                ></button>
                            </div>
                            <div className="modal-body py-3">
                                <p>
                                    Are you sure you want to delete{" "}
                                    <strong>{confirmation.event.Name}</strong>?
                                </p>
                                <p className="text-muted small mb-0">
                                    This action cannot be undone.
                                </p>
                            </div>
                            <div className="modal-footer border-0">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setConfirmation({ show: false, event: null })
                                    }
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() =>
                                        handleDelete(confirmation.event.Id)
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
