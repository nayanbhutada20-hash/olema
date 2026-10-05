import React, { useState, useEffect } from "react";
import ApiModel, { BASE_URL } from "../../../../../API/ApiModel";
import "../Course/Course.css";

export default function FacultyForm({ setShowModal, selectedFaculty }) {
    const apiModel = new ApiModel();

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        mobile: "",
        address: "",
        email: "",
        oldImage: "",
    });

    const [profilePic, setProfilePic] = useState(null);
    const [selectedCourseIds, setSelectedCourseIds] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [selectedAvailableCourseId, setSelectedAvailableCourseId] = useState("");
    const [selectedSearchTerm, setSelectedSearchTerm] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await apiModel.PostMethod({ search: "" }, "CoursesRead");
                const courses = response?.data || [];
                setAvailableCourses(courses);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setAvailableCourses([]);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedFaculty) {
            setFormData({
                id: selectedFaculty.Id,
                name: selectedFaculty.Name,
                mobile: selectedFaculty.Mobile,
                address: selectedFaculty.Address,
                email: selectedFaculty.Email,
                oldImage: selectedFaculty.Image || "",
            });

            try {
                const loadedCourses = JSON.parse(selectedFaculty.Courses);

                console.log("===== SelectedCourse Data =====");
                console.log(loadedCourses);

                console.log("===== Available Courses =====");
                console.log(availableCourses);

                // Ensure loadedCourses is always an array
                const parsed = Array.isArray(loadedCourses) ? loadedCourses : [loadedCourses];

                // Extract only IDs from the saved selectedCourses
                const selectedIds = parsed.map(course => Number(course.Id));

                // Filter and match with availableCourses (match by Id)
                const mappedIds = selectedIds
                    .map((cid) => {
                        const found = availableCourses.find(ac => Number(ac.Id) === Number(cid));
                        return found ? String(found.Id) : null;
                    })
                    .filter(Boolean);

                setSelectedCourseIds(mappedIds);

            } catch (error) {
                console.error("Error parsing courses JSON:", error);
                setSelectedCourseIds([]);
            }

        }
    }, [selectedFaculty, availableCourses]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setProfilePic(e.target.files[0]);
    };

    const handleAddCourse = () => {
        if (selectedAvailableCourseId && !selectedCourseIds.includes(selectedAvailableCourseId)) {
            setSelectedCourseIds((prev) => [...prev, selectedAvailableCourseId]);
            setSelectedAvailableCourseId("");
        }
    };

    const handleRemoveCourse = (courseId) => {
        setSelectedCourseIds((prev) => prev.filter((id) => id !== String(courseId)));
    };

    const selectedCoursesFull = selectedCourseIds
        .map((id) => availableCourses.find((course) => String(course.Id) === String(id)))
        .filter((course) => course !== undefined);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        data.append("mobile", formData.mobile);
        data.append("address", formData.address);
        data.append("email", formData.email);

        data.append("courses", JSON.stringify(selectedCoursesFull));

        if (selectedFaculty) {
            data.append("id", formData.id);
            data.append("oldImage", formData.oldImage);
            if (profilePic) data.append("image", profilePic);

            try {
                await apiModel.PostMethod(data, "FacultyUpdate", true);
                alert("Faculty updated successfully!");
            } catch (error) {
                console.error("Error updating faculty:", error);
                alert("Failed to update faculty.");
                return;
            }
        } else {
            if (profilePic) data.append("image", profilePic);

            try {
                await apiModel.PostMethod(data, "FacultyInsert", true);
                alert("Faculty added successfully!");
            } catch (error) {
                console.error("Error adding faculty:", error);
                alert("Failed to add faculty.");
                return;
            }
        }

        setShowModal(false);
    };

    const selectedCoursesFiltered = selectedCoursesFull.filter((course) =>
        course.Name.toLowerCase().includes(selectedSearchTerm.toLowerCase())
    );

    const coursesToAdd = availableCourses.filter(
        (course) => !selectedCourseIds.includes(String(course.Id))
    );

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content shadow-lg border-0 p-0 overflow-hidden">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            {selectedFaculty ? "Edit Faculty" : "Add New Faculty"}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
                    </div>

                    {/* SCROLLABLE BODY */}
                    <div className="scroll-height">
                        <form onSubmit={handleSubmit} className="modal-body">

                            {/* ===================== ALL FIELDS FULL WIDTH ===================== */}
                            <div className="row g-3">

                                <div className="col-12">
                                    <label className="form-label fw-bold">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Mobile</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        className="form-control"
                                        required
                                        value={formData.mobile}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Address</label>
                                    <textarea
                                        name="address"
                                        className="form-control"
                                        rows="2"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Profile Image</label>
                                    <input
                                        type="file"
                                        name="image"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />

                                    {formData.oldImage && !profilePic && (
                                        <div className="mt-2">
                                            <img
                                                src={`${BASE_URL}/uploads/${formData.oldImage}`}
                                                alt="Faculty"
                                                width="100"
                                                className="rounded shadow-sm"
                                            />
                                        </div>
                                    )}
                                </div>

                            </div>

                            <hr className="my-4" />

                            <div className="row row-cols-1 row-cols-md-2 g-4 course-selection">

                                <div className="col">
                                    <div className="card h-100 shadow-sm border-0">
                                        <div className="card-header bg-light">
                                            <h6 className="mb-0 fw-bold">Add Courses</h6>
                                        </div>
                                        <div className="card-body p-3 d-flex align-items-center">
                                            <select
                                                className="form-select me-2"
                                                value={selectedAvailableCourseId}
                                                onChange={(e) => setSelectedAvailableCourseId(e.target.value)}
                                            >
                                                <option value="">-- Select a course --</option>
                                                {coursesToAdd.map((course) => (
                                                    <option key={course.Id} value={course.Id}>
                                                        {course.Name}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={handleAddCourse}
                                                disabled={!selectedAvailableCourseId}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="card h-100 shadow-sm border-0">
                                        <div className="card-header bg-light">
                                            <h6 className="mb-0 fw-bold">Selected Courses</h6>
                                        </div>
                                        <div className="card-body p-2">
                                            <div className="input-group mb-2">
                                                <span className="input-group-text">🔍</span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search selected courses..."
                                                    value={selectedSearchTerm}
                                                    onChange={(e) => setSelectedSearchTerm(e.target.value)}
                                                />
                                            </div>
                                            <ul className="list-group list-group-flush course-list">
                                                {selectedCoursesFiltered.length > 0 ? (
                                                    selectedCoursesFiltered.map((course) => (
                                                        <li key={course.Id} className="list-group-item d-flex justify-content-between align-items-center">
                                                            <span><strong>{course.Id}</strong> - {course.Name}</span>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleRemoveCourse(course.Id)}
                                                            >
                                                                Remove ➖
                                                            </button>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="list-group-item text-muted text-center">No courses selected.</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="d-grid mt-4">
                                <button type="submit" className="btn btn-primary btn-lg">
                                    {selectedFaculty ? "Update Faculty" : "Save Faculty"}
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
