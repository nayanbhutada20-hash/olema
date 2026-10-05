import React, { useState, useEffect } from "react";
import ApiModel from "../../../../../API/ApiModel";

export default function CourseForm({ setShowModal, selectedCourse }) {
    const apiModel = new ApiModel();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        fees: "",
        duration: "",
        image: null,
        oldImage: "", // 🔹 store old image here
    });

    const [syllabus, setSyllabus] = useState([{ topic: "", subtopics: [""] }]);

    // 🔹 Prefill data when editing
    useEffect(() => {
        if (selectedCourse) {
            setFormData({
                name: selectedCourse.Name,
                description: selectedCourse.Description,
                fees: selectedCourse.Fees,
                duration: selectedCourse.Duration,
                image: null,
                oldImage: selectedCourse.Image || "", // 🔹 keep old image
            });

            setSyllabus(JSON.parse(selectedCourse.Sylabus));
        }
    }, [selectedCourse]);

    // 🔹 Handle normal inputs
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // 🔹 Handle syllabus changes
    const handleTopicChange = (index, value) => {
        const newSyllabus = [...syllabus];
        newSyllabus[index].topic = value;
        setSyllabus(newSyllabus);
    };

    const handleSubtopicChange = (topicIndex, subIndex, value) => {
        const newSyllabus = [...syllabus];
        newSyllabus[topicIndex].subtopics[subIndex] = value;
        setSyllabus(newSyllabus);
    };

    // 🔹 Add / Delete topic & subtopic
    const addTopic = () => setSyllabus([...syllabus, { topic: "", subtopics: [""] }]);

    const addSubtopic = (topicIndex) => {
        const newSyllabus = [...syllabus];
        newSyllabus[topicIndex].subtopics.push("");
        setSyllabus(newSyllabus);
    };

    const deleteTopic = (topicIndex) =>
        setSyllabus(syllabus.filter((_, idx) => idx !== topicIndex));

    const deleteSubtopic = (topicIndex, subIndex) => {
        const newSyllabus = [...syllabus];
        newSyllabus[topicIndex].subtopics.splice(subIndex, 1);
        if (newSyllabus[topicIndex].subtopics.length === 0) {
            newSyllabus[topicIndex].subtopics.push("");
        }
        setSyllabus(newSyllabus);
    };

    // 🔹 Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("fees", formData.fees);
        data.append("duration", formData.duration);
        data.append("sylabus", JSON.stringify(syllabus));

        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            let response;
            if (selectedCourse) {
                // ✅ EDIT Mode
                data.append("id", selectedCourse.Id);
                data.append("Oldimage", formData.oldImage); // 🔹 send old image
                response = await apiModel.PostMethod(data, "CoursesUpdate");
            } else {
                // ✅ ADD Mode
                response = await apiModel.PostMethod(data, "CoursesInsert");
            }

            console.log("Course Saved:", response);
            alert(selectedCourse ? "Course updated successfully!" : "Course added successfully!");
            setShowModal(false);
        } catch (err) {
            console.error("Error saving course:", err);
        }
    };

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content shadow-lg border-0">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            {selectedCourse ? "Edit Course" : "Add New Course"}
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={() => setShowModal(false)}
                        ></button>
                    </div>

                    <div className="modal-body">
                        <div className="courseform">
                            {/* Name */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">📘 Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">📝 Description</label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="3"
                                    required
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div className="row">
                                {/* Fees */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">💰 Fees</label>
                                    <input
                                        type="number"
                                        name="fees"
                                        className="form-control"
                                        required
                                        value={formData.fees}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Duration */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">⏳ Duration</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        className="form-control"
                                        required
                                        value={formData.duration}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Syllabus Section */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">🗂 Syllabus</label>
                                {syllabus.map((item, topicIndex) => (
                                    <div key={topicIndex} className="card mb-3 shadow-sm">
                                        <div className="card-body">
                                            {/* Topic Input */}
                                            <div className="d-flex align-items-center mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Topic"
                                                    value={item.topic}
                                                    onChange={(e) =>
                                                        handleTopicChange(topicIndex, e.target.value)
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger ms-2"
                                                    onClick={() => deleteTopic(topicIndex)}
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                            {/* Subtopics */}
                                            {item.subtopics.map((sub, subIndex) => (
                                                <div
                                                    key={subIndex}
                                                    className="d-flex align-items-center mb-2 ms-3"
                                                >
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Subtopic"
                                                        value={sub}
                                                        onChange={(e) =>
                                                            handleSubtopicChange(
                                                                topicIndex,
                                                                subIndex,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger ms-2"
                                                        onClick={() =>
                                                            deleteSubtopic(topicIndex, subIndex)
                                                        }
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Add Subtopic */}
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary mt-2 ms-3"
                                                onClick={() => addSubtopic(topicIndex)}
                                            >
                                                + Add Subtopic
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="btn btn-outline-success"
                                    onClick={addTopic}
                                >
                                    + Add Topic
                                </button>
                            </div>

                            {/* Image */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">🖼 Course Image</label>
                                {formData.oldImage && !formData.image && (
                                    <div className="mb-2">
                                        <img
                                            src={`/uploads/${formData.oldImage}`}
                                            alt="Old Course"
                                            style={{ maxWidth: "150px", borderRadius: "8px" }}
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="image"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="d-grid">
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                >
                                    {selectedCourse ? "Update Course" : "Save Course"}
                                </button>
                            </div>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
