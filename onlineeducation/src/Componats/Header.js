import { Link } from "react-router-dom";
import React from "react";
import "./Header.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Header() {
    return (
        <header className="header rs-nav header-transparent">
            <div className="top-bar">
                <div className="container">
                    <div className="d-flex justify-content-between">
                        <div className="topbar-left">
                            <ul>
                                <li><a href="faq-1.html"><i className="fa fa-question-circle"></i>Ask a Question</a></li>
                                <li><a href="javascript:"><i className="fa fa-envelope-o"></i>Support@website.com</a></li>
                            </ul>
                        </div>
                        <div className="topbar-right">
                            <ul>

                                <li><Link to={"/SignIn"}>Login</Link></li>
                                <li><Link to={"/SignUp"}>Register</Link></li>
                                <li><Link to={"/Contact"}>Contact</Link></li>
                                <li><Link to={"/About"}>About</Link></li>


                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sticky-header navbar-expand-lg">
                <div className="menu-bar clearfix">
                    <div className="container clearfix">
                        <div className="menu-logo">
                            <Link to={"/"}><img src="assets/images/logo-white.png" alt="" /></Link>
                        </div>

                        <button className="navbar-toggler collapsed menuicon justify-content-end" type="button"
                                data-toggle="collapse" data-target="#menuDropdown" aria-controls="menuDropdown"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>

                        {/* Author Nav */}
                        <div className="secondary-menu">
                            <div className="secondary-inner">
                                <ul>
                                    <li>
                                        <a href="#" className="btn-link" onClick={(e) => e.preventDefault()}>
                                            <i className="fab fa-facebook-f"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="btn-link" onClick={(e) => e.preventDefault()}>
                                            <i className="fab fa-google"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="btn-link" onClick={(e) => e.preventDefault()}>
                                            <i className="fab fa-linkedin-in"></i>
                                        </a>
                                    </li>
                                    {/* Search Button */}
                                    <li className="search-btn">
                                        <button id="quik-search-btn" type="button" className="btn-link">
                                            <i className="fa fa-search"></i>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Search Box */}
                        <div className="nav-search-bar">
                            <form action="#">
                                <input name="search" type="text" className="form-control" placeholder="Type to search" />
                                <span><i className="ti-search"></i></span>
                            </form>
                            <span id="search-remove"><i className="ti-close"></i></span>
                        </div>

                        {/* Navigation Menu */}
                        <div className="menu-links navbar-collapse collapse justify-content-start" id="menuDropdown">
                            <div className="menu-logo">
                                <Link to={"/"}><img src="assets/images/logo.png" alt="" /></Link>
                            </div>
                            <ul className="nav navbar-nav">
                                <li className="active menu-one">
                                    <Link to={"/"} className={"no-arrow"}>Home </Link>
                                </li>

                                <li className="add-mega-menu">
                                    <a href="javascript:;">Our Courses <i className="fa fa-chevron-down"></i></a>
                                    <ul className="sub-menu add-menu">
                                        <li className="add-menu-left">
                                            <h5 className="menu-adv-title">Our Courses</h5>
                                            <ul>
                                                <li><a href="courses.html">Courses </a></li>
                                                <li><a href="courses-details.html">Courses Details</a></li>
                                                <li><a href="profile.html">Instructor Profile</a></li>
                                                <li><a href="event.html">Upcoming Event</a></li>
                                                <li><a href="membership.html">Membership</a></li>
                                            </ul>
                                        </li>
                                        <li className="add-menu-right">
                                            <img src="assets/images/adv/adv.jpg" alt="" />
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link className={"no-arrow"}>Blog</Link>
                                </li>
                                <li>
                                    <Link className={"no-arrow"}>About</Link>
                                </li>
                                <li>
                                    <Link className={"no-arrow"}>Contact</Link>
                                </li>
                            </ul>

                            <div className="nav-social-link">
                                <a href="#"><i className="fab fa-facebook-f"></i></a>
                                <a href="#"><i className="fab fa-google"></i></a>
                                <a href="#"><i className="fab fa-linkedin-in"></i></a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
