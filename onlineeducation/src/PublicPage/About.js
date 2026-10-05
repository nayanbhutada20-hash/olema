import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="container py-5">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="btn btn-link text-decoration-none mb-3"
            >
                <i className="bi bi-arrow-left me-1"></i> Back
            </button>

            {/* Header Section */}
            <div className="text-center mb-5">
                <h2 className="fw-bold">
                    About <span className="text-primary">Us</span>
                </h2>
                <p className="text-muted">
                    Empowering communities through welfare, education, and innovation.
                </p>
            </div>

            {/* Who We Are */}
            <div className="row align-items-center mb-5">
                <div className="col-md-6 mb-4 mb-md-0">
                    <img
                        src="https://images.unsplash.com/photo-1581091870622-9b6c2a7d20c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80"
                        alt="About Us"
                        className="img-fluid rounded-4 shadow-sm"
                    />
                </div>
                <div className="col-md-6">
                    <h4 className="fw-semibold text-primary mb-3">Who We Are</h4>
                    <p className="text-muted">
                        Human Welfare Initiative is a non-profit organization dedicated to
                        improving lives through education, employment, healthcare, and
                        sustainable development. Our mission is to build a society where
                        everyone has equal access to opportunities for growth and well-being.
                    </p>
                    <p className="text-muted">
                        With multiple programs focusing on women empowerment, skill
                        development, and community health, we strive to make a measurable
                        difference in the lives of those we serve.
                    </p>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="row text-center mb-5">
                <div className="col-md-6 mb-4 mb-md-0">
                    <div className="card shadow-sm border-0 rounded-4 h-100">
                        <div className="card-body">
                            <i className="bi bi-bullseye text-primary fs-2 mb-3"></i>
                            <h5 className="fw-semibold">Our Mission</h5>
                            <p className="text-muted small">
                                To empower underprivileged individuals through quality education,
                                healthcare, and sustainable livelihood programs that promote
                                social equity and independence.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm border-0 rounded-4 h-100">
                        <div className="card-body">
                            <i className="bi bi-eye-fill text-primary fs-2 mb-3"></i>
                            <h5 className="fw-semibold">Our Vision</h5>
                            <p className="text-muted small">
                                To create a self-reliant and inclusive society where every person
                                can lead a healthy, dignified, and productive life — contributing
                                to the nation’s growth.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Impact Section */}
            <div className="text-center mb-5">
                <h4 className="fw-semibold text-primary mb-4">Our Impact</h4>
                <div className="row g-4">
                    <div className="col-6 col-md-3">
                        <div className="p-3 border rounded-4 shadow-sm bg-light">
                            <h5 className="fw-bold text-primary">10,000+</h5>
                            <p className="text-muted small mb-0">Lives Impacted</p>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="p-3 border rounded-4 shadow-sm bg-light">
                            <h5 className="fw-bold text-primary">120+</h5>
                            <p className="text-muted small mb-0">Events Conducted</p>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="p-3 border rounded-4 shadow-sm bg-light">
                            <h5 className="fw-bold text-primary">500+</h5>
                            <p className="text-muted small mb-0">Women Empowered</p>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="p-3 border rounded-4 shadow-sm bg-light">
                            <h5 className="fw-bold text-primary">15+</h5>
                            <p className="text-muted small mb-0">Active Programs</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="text-center mb-5">
                <h4 className="fw-semibold text-primary mb-4">Our Core Values</h4>
                <div className="row g-4">
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-3">
                            <i className="bi bi-heart-fill text-danger fs-3 mb-2"></i>
                            <h6 className="fw-semibold">Compassion</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-3">
                            <i className="bi bi-lightbulb-fill text-warning fs-3 mb-2"></i>
                            <h6 className="fw-semibold">Innovation</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-3">
                            <i className="bi bi-people-fill text-primary fs-3 mb-2"></i>
                            <h6 className="fw-semibold">Collaboration</h6>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-3">
                            <i className="bi bi-shield-check text-success fs-3 mb-2"></i>
                            <h6 className="fw-semibold">Integrity</h6>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team or Founder Section */}
            <div className="text-center">
                <h4 className="fw-semibold text-primary mb-4">Meet Our Founder</h4>
                <div className="card border-0 shadow-sm rounded-4 p-4 mx-auto" style={{ maxWidth: "500px" }}>
                    <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                        alt="Founder"
                        className="rounded-circle mx-auto mb-3"
                        width="120"
                        height="120"
                    />
                    <h5 className="fw-semibold mb-1">Nayan Bhutada</h5>
                    <p className="text-muted small">Founder & Director, Human Welfare Scheme</p>
                    <p className="text-muted small">
                        “Our goal is to uplift communities and create a sustainable impact through
                        compassion, innovation, and inclusive growth.”
                    </p>
                </div>
            </div>
        </div>
    );
}
