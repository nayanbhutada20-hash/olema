import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiModel from "..//API/ApiModel"; // adjust path if needed

export default function PublicEvent() {
    const [search, setSearch] = useState("");
    const [eventList, setEventList] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiModel = new ApiModel();

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

    const getImageUrl = (image) => {
        try {
            return apiModel.ReadImage("Event/" + image); // ✅ match backend folder
        } catch (error) {
            return (
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent("Event") +
                "&background=0d6efd&color=fff&size=200"
            );
        }
    };

    return (
        <div className="container py-5">
            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control shadow-sm"
                    placeholder="Search events by name, description, or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Event Grid */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Fetching latest events...</p>
                </div>
            ) : eventList.length > 0 ? (
                <div className="row gy-4">
                    {eventList.map((event) => (
                        <div key={event.Id} className="col-md-6 col-lg-4">
                            <div
                                className="card h-100 shadow-sm border-0"
                                style={{
                                    borderRadius: "12px",
                                    transition: "transform 0.3s",
                                }}
                            >
                                <img
                                    src={getImageUrl(event.Image)}
                                    alt={event.Name}
                                    className="card-img-top"
                                    style={{
                                        height: "220px",
                                        objectFit: "cover",
                                        borderTopLeftRadius: "12px",
                                        borderTopRightRadius: "12px",
                                    }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title fw-semibold">{event.Name}</h5>
                                    <p className="card-text text-muted small">
                                        {event.Description?.length > 100
                                            ? event.Description.substring(0, 100) + "..."
                                            : event.Description}
                                    </p>
                                    <div className="d-flex justify-content-between small text-muted mb-2">
                                        <span>
                                            <i className="bi bi-geo-alt me-1 text-primary"></i>
                                            {event.Location}
                                        </span>
                                        <span>
                                            <i className="bi bi-tag me-1 text-primary"></i>
                                            {event.Category}
                                        </span>
                                    </div>
                                    <div className="small text-muted">
                                        <i className="bi bi-clock me-1 text-primary"></i>
                                        {event.DateTime}
                                    </div>
                                </div>
                                <div className="card-footer bg-transparent text-center">
                                    <a
                                        href={event.GoogleFormLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-primary w-100"
                                    >
                                        <i className="bi bi-link-45deg me-1"></i> Register / View Form
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <i className="bi bi-calendar-x display-4 text-muted mb-3"></i>
                    <h5 className="text-muted">No events found</h5>
                    <p className="text-muted small">
                        Try changing your search keywords.
                    </p>
                </div>
            )}
        </div>
    );
}
