import React, { useState, useEffect } from "react";
import ApiModel from "../../../../../API/ApiModel";

export default function ProfileForm({ setShowModal, selectedProfile }) {
    const apiModel = new ApiModel();
    const [formData, setFormData] = useState({
        Id: selectedProfile?.Id || "",
        Name: selectedProfile?.Name || "",
        Email: selectedProfile?.Email || "",
        Bio: selectedProfile?.Bio || "",
        Avatar: null, // For new file upload
    });

    useEffect(() => {
        if (selectedProfile) {
            setFormData({
                Id: selectedProfile.Id,
                Name: selectedProfile.Name,
                Email: selectedProfile.Email,
                Bio: selectedProfile.Bio,
                Avatar: null,
            });
        }
    }, [selectedProfile]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "Avatar") {
            setFormData((prev) => ({
                ...prev,
                Avatar: files[0],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("Id", formData.Id);
        data.append("Name", formData.Name);
        data.append("Email", formData.Email);
        data.append("Bio", formData.Bio);
        if (formData.Avatar) data.append("Avatar", formData.Avatar);

        try {
            const endpoint = formData.Id ? "ProfilesUpdate" : "ProfilesInsert";
            const response = await apiModel.PostFormData(data, endpoint);

            if (response.data.success) {
                alert("Profile saved successfully!");
                setShowModal(false);
                window.location.reload(); // Refresh data after insert/update
            } else {
                alert("Failed to save profile.");
            }
        } catch (err) {
            console.error("Error saving profile:", err);
            alert("An error occurred while saving the profile.");
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {formData.Id ? "Edit Profile" : "Add New Profile"}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowModal(false)}
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="Name"
                                    value={formData.Name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Bio</label>
                                <textarea
                                    className="form-control"
                                    name="Bio"
                                    value={formData.Bio}
                                    onChange={handleChange}
                                    rows="3"
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Avatar</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    name="Avatar"
                                    accept="image/*"
                                    onChange={handleChange}
                                />

                                {selectedProfile?.Profile && !formData.Avatar && (
                                    <img
                                        src={apiModel.ReadImage(
                                            "uploads/" + selectedProfile.Profile
                                        )}
                                        alt="Current Avatar"
                                        className="mt-2"
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {formData.Id ? "Update Profile" : "Add Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
