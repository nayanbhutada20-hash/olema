import React, { useState, useEffect } from "react";
import ApiModel from "../../../../../API/ApiModel";

export default function EventForm({ setShowModal, selectedEvent, onSaveEvent }) {
    const apiModel = new ApiModel();

    const [formData, setFormData] = useState({
        Id: selectedEvent?.Id || "",
        Name: selectedEvent?.Name || "",
        DateTime: selectedEvent?.DateTime || "",
        Location: selectedEvent?.Location || "",
        Description: selectedEvent?.Description || "",
        GoogleFormLink: selectedEvent?.GoogleFormLink || "",
        Participants: selectedEvent?.Participants || "",
        Category: selectedEvent?.Category || "",
        OldImage: selectedEvent?.Image || "",
        Image: null
    });

    useEffect(() => {
        // Update formData if selectedEvent changes
        if (selectedEvent) {
            setFormData({
                Id: selectedEvent.Id,
                Name: selectedEvent.Name,
                DateTime: selectedEvent.DateTime,
                Location: selectedEvent.Location,
                Description: selectedEvent.Description,
                GoogleFormLink: selectedEvent.GoogleFormLink,
                Participants: selectedEvent.Participants,
                Category: selectedEvent.Category,
                OldImage: selectedEvent.Image,
                Image: null
            });
        } else {
            setFormData({
                Id: "",
                Name: "",
                DateTime: "",
                Location: "",
                Description: "",
                GoogleFormLink: "",
                Participants: "",
                Category: "",
                OldImage: "",
                Image: null
            });
        }
    }, [selectedEvent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, Image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        if (formData.Id) data.append("Id", formData.Id);
        data.append("Name", formData.Name);
        data.append("DateTime", formData.DateTime);
        data.append("Location", formData.Location);
        data.append("Description", formData.Description);
        data.append("GoogleFormLink", formData.GoogleFormLink);
        data.append("Participants", formData.Participants);
        data.append("Category", formData.Category);
        if (formData.Image) data.append("Image", formData.Image);

        try {
            if (selectedEvent) {
                // Update
                data.append("OldImage", formData.OldImage);
                await apiModel.PostMethod(data, "EventsUpdate");
                alert("Event updated successfully");
            } else {
                // Insert
                await apiModel.PostMethod(data, "EventsInsert");
                alert("Event added successfully");
            }

            // Update parent component state
            if (onSaveEvent) onSaveEvent({
                ...formData,
                Image: formData.Image ? URL.createObjectURL(formData.Image) : formData.OldImage
            });

            setShowModal(false);
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="modal show d-block">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{selectedEvent ? "Edit Event" : "Add New Event"}</h5>
                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="mb-3">
                                <label>Name</label>
                                <input type="text" name="Name" className="form-control" value={formData.Name} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label>Date & Time</label>
                                <input type="datetime-local" name="DateTime" className="form-control" value={formData.DateTime} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label>Location</label>
                                <input type="text" name="Location" className="form-control" value={formData.Location} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label>Description</label>
                                <textarea name="Description" className="form-control" value={formData.Description} onChange={handleChange} required></textarea>
                            </div>
                            <div className="mb-3">
                                <label>Google Form Link</label>
                                <input type="url" name="GoogleFormLink" className="form-control" value={formData.GoogleFormLink} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label>Participants</label>
                                <input type="number" name="Participants" className="form-control" value={formData.Participants} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label>Category</label>
                                <input type="text" name="Category" className="form-control" value={formData.Category} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label>Event Image</label>
                                <input type="file" name="Image" className="form-control" onChange={handleFileChange} accept="image/*" />
                                {formData.OldImage && !formData.Image && (
                                    <img src={formData.OldImage} alt="Current" className="img-thumbnail mt-2" style={{ width: '100px' }} />
                                )}
                            </div>
                            <button type="submit" className="btn btn-primary">{selectedEvent ? "Update Event" : "Add Event"}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
