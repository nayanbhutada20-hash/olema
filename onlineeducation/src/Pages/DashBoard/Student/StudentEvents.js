import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header/Header";
import ApiModel from "../../../API/ApiModel";
import Sidebar from "./SideBar/Sidebar";

/* ================= PAGE ================= */

const FacultyEvents = () => {
    return (
        <div className="ttr-opened-sidebar ttr-pinned-sidebar">
            <Header />
            <Sidebar />
            <EventsContent />
        </div>
    );
};

export default FacultyEvents;

/* ================= CONTENT ================= */

function EventsContent() {
    const apiModel = new ApiModel();

    const [filter, setFilter] = useState("Upcoming");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH EVENTS ================= */

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await apiModel.PostMethod({}, "EventsRead");
                setEvents(response?.data || []);
            } catch (error) {
                console.error("Error loading faculty events:", error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    /* ================= HELPERS ================= */

    const getImageUrl = (image) => {
        try {
            return apiModel.ReadImage("Event/" + image);
        } catch {
            return "https://ui-avatars.com/api/?name=Event&background=0d6efd&color=fff";
        }
    };

    const isUpcoming = (dateTime) => {
        return new Date(dateTime) >= new Date();
    };

    const filteredEvents =
        filter === "All"
            ? events
            : events.filter((e) =>
                filter === "Upcoming"
                    ? isUpcoming(e.DateTime)
                    : !isUpcoming(e.DateTime)
            );

    /* ================= UI ================= */

    return (
        <main className="ttr-wrapper">
            <div className="container-fluid">

                {/* Breadcrumb */}
                <div className="db-breadcrumb mb-4">
                    <h4 className="breadcrumb-title">Faculty Events</h4>
                    <p className="text-muted">
                        View workshops, seminars, and academic events
                    </p>
                </div>

                {/* Filters */}
                <div className="d-flex gap-3 mb-4">
                    {["Upcoming", "Past", "All"].map((type) => (
                        <button
                            key={type}
                            className={`btn btn-sm ${
                                filter === type
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                            }`}
                            onClick={() => setFilter(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary"></div>
                        <p className="text-muted mt-3">Loading events...</p>
                    </div>
                )}

                {/* Events Grid */}
                {!loading && filteredEvents.length > 0 && (
                    <div className="row g-4">
                        {filteredEvents.map((event) => (
                            <div className="col-md-6 col-lg-4" key={event.Id}>
                                <div className="card h-100 border-0 shadow-sm">

                                    <img
                                        src={getImageUrl(event.Image)}
                                        alt={event.Name}
                                        className="card-img-top"
                                        style={{
                                            height: "180px",
                                            objectFit: "cover",
                                        }}
                                    />

                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title text-primary">
                                            {event.Name}
                                        </h5>

                                        <p className="text-muted small mb-1">
                                            <i className="fa fa-calendar-alt me-2"></i>
                                            {event.DateTime}
                                        </p>

                                        <p className="text-muted small mb-2">
                                            <i className="fa fa-map-marker-alt me-2"></i>
                                            {event.Location}
                                        </p>

                                        <p className="card-text small text-muted flex-grow-1">
                                            {event.Description?.slice(0, 120)}...
                                        </p>

                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <span
                                                className={`badge ${
                                                    isUpcoming(event.DateTime)
                                                        ? "bg-success"
                                                        : "bg-secondary"
                                                }`}
                                            >
                                                {isUpcoming(event.DateTime)
                                                    ? "Upcoming"
                                                    : "Past"}
                                            </span>

                                            {event.GoogleFormLink && (
                                                <a
                                                    href={event.GoogleFormLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    Register
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredEvents.length === 0 && (
                    <div className="text-center py-5 text-muted">
                        <i className="fa fa-calendar-times fa-3x mb-3"></i>
                        <p>No {filter.toLowerCase()} events available.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
