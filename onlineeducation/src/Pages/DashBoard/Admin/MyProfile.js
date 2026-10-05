import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "../Facalty/Header/Header";
import Sidebar from "../Facalty/Sidebar/Sidebar";
import ApiModel from "../../../API/ApiModel";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../Model/Auth";

export default function ProfilePage() {
    return (
        <div className="ttr-opened-sidebar ttr-pinned-sidebar">
            <Header />
            <Sidebar />
            <ProfileContent />
        </div>
    );
}

const ProfileContent = () => {
    const apiModel = new ApiModel();

    const [isEditing, setIsEditing] = useState(false);

    // formData contains only editable fields + required API fields (Id, Profile)
    const [formData, setFormData] = useState({
        Id: "",
        Name: "",
        Mobile: "",
        Qualification: "",
        Profile: "user.png",
    });

    // DocId is for internal API use only, and is not displayed.
    const [docId, setDocId] = useState("");

    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const data = {
                    docId: currentUser.uid,
                    displayName: currentUser.displayName,
                };

                // Store the DocId (UID) immediately for API calls
                setDocId(currentUser.uid);

                apiModel.PostMethod(data, "RegistrationRead").then((response) => {
                    apiModel.UserDetails = response.data;

                    if (apiModel.UserDetails && apiModel.UserDetails.length > 0) {
                        const user = apiModel.UserDetails[0];

                        setFormData({
                            Id: user.Id,
                            Name: user.Name,
                            Mobile: user.Mobile,
                            Qualification: user.Qualification || user.qualification,
                            Profile: user.Profile,
                        });

                        // Ensure DocId is updated if API provides a more accurate one
                        setDocId(user.DocId || currentUser.uid);
                        setProfileImage(apiModel.GetImageUrl(`profile/${user.Profile}`));
                    } else {
                        console.warn("⚠️ No user details found in API response.");
                    }
                });
            } else {
                console.log("⚠️ No user logged in");
            }
        });

        return () => unsubscribe();
    }, []);

    const handleEditClick = () => setIsEditing(true);
    const handleCancelClick = () => {
        setIsEditing(false);
        setError(null);
        setSuccess(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    const handleSaveClick = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const formDataToSend = new FormData();

            // Append Name, Mobile, Qualification, and Id
            Object.keys(formData).forEach((key) => {
                if (key !== "Profile") formDataToSend.append(key, formData[key]);
            });

            // DocId is included in the payload but hidden from the user interface
            formDataToSend.append("DocId", docId);
            formDataToSend.append("OldProfile", formData.Profile);

            if (selectedFile) {
                formDataToSend.append("Profile", selectedFile);
            }

            const endpoint = formData.Id ? "RegistrationUpdate" : "RegistrationInsert";
            const response = await apiModel.PostMethod(formDataToSend, endpoint);

            if (response && response.status === "success") {
                setSuccess(formData.Id ? "Profile updated successfully!" : "Profile created successfully!");
                if (response.Profile) {
                    setFormData((prev) => ({ ...prev, Profile: response.Profile }));
                }
            } else {
                throw new Error(response.message || "Something went wrong.");
            }
        } catch (err) {
            console.error("❌ Save profile error:", err);
            setError("Failed to save profile. Please try again.");
        } finally {
            setLoading(false);
            if (success) {
                setTimeout(() => {
                    setIsEditing(false);
                    setSuccess(null);
                }, 1500);
            }
        }
    };

    return (
        <main className="content p-4" style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            <div className="container-fluid d-flex justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow rounded-4 overflow-hidden">
                        <div className="bg-primary text-white p-4 text-center">
                            <h2 className="mb-0">Profile Management</h2>
                        </div>

                        <div className="card-body p-4">
                            {loading && (
                                <div className="text-center py-3">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <p className="mt-2 text-muted">Loading...</p>
                                </div>
                            )}

                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            {/* Profile Avatar */}
                            <div className="mb-4 text-center">
                                <div className="position-relative d-inline-block">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            className="rounded-circle shadow"
                                            style={{ width: "150px", height: "150px", objectFit: "cover", border: "4px solid white" }}
                                        />
                                    ) : (
                                        <div
                                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow"
                                            style={{ width: "150px", height: "150px", fontSize: "60px" }}
                                        >
                                            {formData.Name ? formData.Name.charAt(0) : <i className="bi bi-person-fill"></i>}
                                        </div>
                                    )}

                                    {isEditing && (
                                        <button
                                            className="btn btn-light rounded-circle position-absolute bottom-0 end-0 border shadow"
                                            onClick={() => fileInputRef.current.click()}
                                            style={{ width: "45px", height: "45px" }}
                                        >
                                            <i className="bi bi-camera-fill"></i>
                                        </button>
                                    )}
                                    <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={onFileChange} />
                                </div>
                            </div>

                            {/* Editable Fields */}

                            {/* Full Name */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Full Name:</label>
                                {isEditing ? (
                                    <input type="text" name="Name" value={formData.Name} onChange={handleInputChange} className="form-control" />
                                ) : (
                                    <div>{formData.Name || "-"}</div>
                                )}
                            </div>

                            {/* Doc ID field REMOVED from the JSX display */}

                            {/* Mobile */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Mobile:</label>
                                {isEditing ? (
                                    <input type="text" name="Mobile" value={formData.Mobile} onChange={handleInputChange} className="form-control" />
                                ) : (
                                    <div>{formData.Mobile || "-"}</div>
                                )}
                            </div>

                            {/* Qualification */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Qualification:</label>
                                {isEditing ? (
                                    <input type="text" name="Qualification" value={formData.Qualification} onChange={handleInputChange} className="form-control" />
                                ) : (
                                    <div>{formData.Qualification || "-"}</div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 d-flex gap-3 justify-content-center">
                                {isEditing ? (
                                    <>
                                        <button className="btn btn-success px-4 flex-fill" onClick={handleSaveClick} disabled={loading}>
                                            <i className="bi bi-check-lg me-2"></i>Save Changes
                                        </button>
                                        <button className="btn btn-outline-secondary px-4 flex-fill" onClick={handleCancelClick} disabled={loading}>
                                            <i className="bi bi-x-lg me-2"></i>Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button className="btn btn-primary px-4 flex-fill" onClick={handleEditClick}>
                                        <i className="bi bi-pencil me-2"></i>Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};