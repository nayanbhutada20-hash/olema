import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <div className="container py-5">
            {/* Page Header */}
            <div className="text-center mb-5">
                <h2 className="fw-bold">
                    Contact <span className="text-primary">Us</span>
                </h2>
                <p className="text-muted">
                    We’d love to hear from you! Reach out for collaborations, event
                    queries, or support.
                </p>
            </div>

            {/* Main Layout */}
            <div className="row g-5 align-items-start">
                {/* Left Section – Contact Info */}
                <div className="col-md-5">
                    <h4 className="fw-semibold mb-4 text-primary">Get in Touch</h4>

                    <div className="mb-4">
                        <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                        <span>123 Human Welfare Street, Pune, Maharashtra, India</span>
                    </div>

                    <div className="mb-4">
                        <i className="bi bi-telephone-fill text-primary me-2"></i>
                        <span>+91 98765 43210</span>
                    </div>

                    <div className="mb-4">
                        <i className="bi bi-envelope-fill text-primary me-2"></i>
                        <span>support@humanwelfare.org</span>
                    </div>

                    <div className="mb-4">
                        <i className="bi bi-clock-fill text-primary me-2"></i>
                        <span>Mon – Sat: 9:00 AM – 6:00 PM</span>
                    </div>

                    <div className="d-flex gap-3 mt-4">
                        <a href="#" className="text-primary fs-4">
                            <i className="bi bi-facebook"></i>
                        </a>
                        <a href="#" className="text-primary fs-4">
                            <i className="bi bi-twitter"></i>
                        </a>
                        <a href="#" className="text-primary fs-4">
                            <i className="bi bi-instagram"></i>
                        </a>
                        <a href="#" className="text-primary fs-4">
                            <i className="bi bi-linkedin"></i>
                        </a>
                    </div>
                </div>

                {/* Right Section – Contact Form */}
                <div className="col-md-7">
                    <div className="card shadow-sm border-0 p-4 rounded-4">
                        <h5 className="fw-semibold mb-4 text-center">Send a Message</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="subject"
                                        placeholder="Subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-12">
                  <textarea
                      className="form-control"
                      name="message"
                      rows="5"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                  ></textarea>
                                </div>
                                <div className="col-12 text-center mt-3">
                                    <button type="submit" className="btn btn-primary px-5">
                                        Send Message
                                    </button>
                                </div>
                            </div>
                        </form>

                        {submitted && (
                            <div className="alert alert-success text-center mt-4 mb-0" role="alert">
                                🌸 Thank you for reaching out! We’ll get back to you soon.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Google Map Embed */}
            <div className="mt-5">
                <iframe
                    title="Human Welfare Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.684080814734!2d73.84778197496542!3d18.54731846803792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf8e23c90c0d%3A0xb4b4d1e0dddb1c0a!2sPune!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="350"
                    style={{ border: 0, borderRadius: "12px" }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    );
}
