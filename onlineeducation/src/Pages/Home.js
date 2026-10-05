import Header from "../Componats/Header";
import Footer from "../Componats/Footer";
import React from "react";
import "./Home.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import PublicEvent from "./Events";


export default function () {

    return <>
    <Header/>

        <div className={"page-content bg-white"}>


            <div className="content-block">

                <div className="rev-slider">

                    <Carousel showThumbs={false} >
                        <div >
                            <img src="assets/images/slider/slide1.jpg" />
                            {/**/}
                        </div>
                        <div>
                            <img src="assets/images/slider/slide2.jpg" />
                        </div>
                    </Carousel>

                    <div className={"slider-dark-color"}>

                    </div>
                </div>

                <div class="section-area content-inner service-info-bx">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-4 col-md-4 col-sm-6">
                                <div class="service-bx">
                                    <div class="action-box">
                                        <img src="assets/images/our-services/pic1.jpg" alt=""/>
                                    </div>
                                    <div class="info-bx text-center">
                                        <div class="feature-box-sm radius bg-white">
                                            <i class="fa fa-bank text-primary"></i>
                                        </div>
                                        <h4><a href="#">Best Industry Leaders</a></h4>
                                        <a href="#" class="btn radius-xl">View More</a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-6">
                                <div class="service-bx">
                                    <div class="action-box">
                                        <img src="assets/images/our-services/pic2.jpg" alt=""/>
                                    </div>
                                    <div class="info-bx text-center">
                                        <div class="feature-box-sm radius bg-white">
                                            <i class="fa fa-book text-primary"></i>
                                        </div>
                                        <h4><a href="#">Learn Courses Online</a></h4>
                                        <a href="#" class="btn radius-xl">View More</a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-12">
                                <div class="service-bx m-b0">
                                    <div class="action-box">
                                        <img src="assets/images/our-services/pic3.jpg" alt=""/>
                                    </div>
                                    <div class="info-bx text-center">
                                        <div class="feature-box-sm radius bg-white">
                                            <i class="fa fa-file-text-o text-primary"></i>
                                        </div>
                                        <h4><a href="#">Book Library & Store</a></h4>
                                        <a href="#" class="btn radius-xl">View More</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section-area section-sp2 popular-courses-bx">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12 heading-bx left">
                                <h2 class="title-head">Popular <span>Courses</span></h2>
                                <p>It is a long established fact that a reader will be distracted by the readable content of a page</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="courses-carousel owl-carousel owl-btn-1 col-12 p-lr0">
                                <div class="item">
                                    <div class="cours-bx">
                                        <div class="action-box">
                                            <img src="assets/images/courses/pic1.jpg" alt=""/>
                                                <a href="#" class="btn">Read More</a>
                                        </div>
                                        <div class="info-bx text-center">
                                            <h5><a href="#">Introduction EduChamp – LMS plugin</a></h5>
                                            <span>Programming</span>
                                        </div>
                                        <div class="cours-more-info">
                                            <div class="review">
                                                <span>3 Review</span>
                                                <ul class="cours-star">
                                                    <li class="active"><i class="fa fa-star"></i></li>
                                                    <li class="active"><i class="fa fa-star"></i></li>
                                                    <li class="active"><i class="fa fa-star"></i></li>
                                                    <li><i class="fa fa-star"></i></li>
                                                    <li><i class="fa fa-star"></i></li>
                                                </ul>
                                            </div>
                                            <div class="price">
                                                <del>$190</del>
                                                <h5>$120</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="cours-bx">
                                        <div class="action-box">
                                            <img src="assets/images/courses/pic2.jpg" alt=""/>
                                                <a href="#" class="btn">Read More</a>
                                        </div>
                                        <div class="info-bx text-center">
                                            <h5><a href="#">Introduction EduChamp – LMS plugin</a></h5>
                                            <span>Programming</span>
                                        </div>
                                        <div class="cours-more-info">
                                            <div class="review">
                                                <span>3 Review</span>
                                                <ul class="cours-star">
                                                    <li class="active"><i class="fa fa-star"></i></li>
                                                    <li class="active"><i class="fa fa-star"></i></li>
                                                    <li class="active"><i class="fa fa-star"></i></li>
                                                    <li><i class="fa fa-star"></i></li>
                                                    <li><i class="fa fa-star"></i></li>
                                                </ul>
                                            </div>
                                            <div class="price">
                                                <del>$190</del>
                                                <h5>$120</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="cours-bx">
                                        <div class="action-box">
                                            <img src="assets/images/courses/pic3.jpg" alt=""/>
                                                <a href="#" class="btn">Read More</a>
                                        </div>
                                        <div class="info-bx text-center">
                                            <h5><a href="#">Introduction EduChamp – LMS plugin</a></h5>
                                            <span>Programming</span>
                                        </div>
                                        <div class="cours-more-info">
                                            <div class="review">
                                                <span>3 Review</span>
                                                <ul class="cours-star">
                                                    <li class="active"><i class="fa fa-star"></i></li>
                                                    <li class="active"><i class="fa fa-star"></i></li>
                                                    <li class="active"><i class="fa fa-star"></i></li>
                                                    <li><i class="fa fa-star"></i></li>
                                                    <li><i class="fa fa-star"></i></li>
                                                </ul>
                                            </div>
                                            <div class="price">
                                                <del>$190</del>
                                                <h5>$120</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="cours-bx">
                                        <div class="action-box">
                                            <img src="assets/images/courses/pic4.jpg" alt=""/>
                                                <a href="#" class="btn">Read More</a>
                                        </div>
                                        <div class="info-bx text-center">
                                            <h5><a href="#">Introduction EduChamp – LMS plugin</a></h5>
                                            <span>Programming</span>
                                        </div>
                                        <div class="cours-more-info">
                                            <div class="review">
                                                <span>3 Review</span>
                                                <ul class="cours-star">
                                                    <li class="active"><i class="fa fa-star"></i></li>
                                                    <li class="active"><i class="fa fa-star"></i></li>
                                                    <li class="active"><i class="fa fa-star"></i></li>
                                                    <li><i class="fa fa-star"></i></li>
                                                    <li><i class="fa fa-star"></i></li>
                                                </ul>
                                            </div>
                                            <div class="price">
                                                <del>$190</del>
                                                <h5>$120</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="section-area section-sp1 ovpr-dark bg-fix online-cours bgImage"
                >
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center text-white">
                                <h2>Online Courses To Learn</h2>
                                <h5>Own Your Feature Learning New Skills Online</h5>
                                <form className="cours-search">
                                    <div className="input-group">
                                        <input type="text" className="form-control"
                                               placeholder="What do you want to learn today?	"/>
                                            <div className="input-group-append">
                                                <button className="btn" type="submit">Search</button>
                                            </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="mw800 m-auto">
                            <div className="row">
                                <div className="col-md-4 col-sm-6">
                                    <div className="cours-search-bx m-b30">
                                        <div className="icon-box">
                                            <h3><i className="ti-user"></i><span className="counter">5</span>M</h3>
                                        </div>
                                        <span className="cours-search-text">Over 5 million student</span>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                    <div className="cours-search-bx m-b30">
                                        <div className="icon-box">
                                            <h3><i className="ti-book"></i><span className="counter">30</span>K</h3>
                                        </div>
                                        <span className="cours-search-text">30,000 Courses.</span>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                    <div className="cours-search-bx m-b30">
                                        <div className="icon-box">
                                            <h3><i className="ti-layout-list-post"></i><span
                                                className="counter">20</span>K</h3>
                                        </div>
                                        <span className="cours-search-text">Learn Anythink Online.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ======================= Upcoming Events Section ======================= */}
                <div className="section-area section-sp2 bg-light">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center heading-bx">
                                <h2 className="title-head m-b0">
                                    Upcoming <span>Events</span>
                                </h2>
                                <p className="m-b0">
                                    Upcoming Education Events To Feed Brain.
                                </p>
                            </div>
                        </div>

                        <div>
                            <PublicEvent/>
                        </div>

                        <div className="text-center mt-4">
                            <Link to="/PublicEvent"  className="btn btn-primary rounded-pill px-4">
                                View All Events
                            </Link>


                        </div>
                    </div>
                </div>

                {/* ======================= Testimonials Section ======================= */}
                <div className="section-area section-sp2 bg-fix ovbl-dark text-white py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 heading-bx left">
                                <h2 className="title-head text-uppercase text-white">
                                    What People <span>Say</span>
                                </h2>
                                <p className="text-light">
                                    It is a long established fact that a reader will be distracted by the readable content of a page.
                                </p>
                            </div>
                        </div>

                        <div id="testimonialCarousel" className="carousel slide mt-4" data-bs-ride="carousel">
                            <div className="carousel-inner">

                                {/* Testimonial 1 */}
                                <div className="carousel-item active">
                                    <div className="testimonial-bx text-center">
                                        <div className="testimonial-thumb mb-3">
                                            <img
                                                src="assets/images/testimonials/pic1.jpg"
                                                alt="Testimonial 1"
                                                className="rounded-circle"
                                                width="90"
                                                height="90"
                                            />
                                        </div>
                                        <div className="testimonial-info mb-2">
                                            <h5 className="name mb-0">Peter Packer</h5>
                                            <p className="text-muted">- Art Director</p>
                                        </div>
                                        <div className="testimonial-content px-4">
                                            <p>
                                                “Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                It has been the industry's standard dummy text ever since the 1500s.”
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial 2 */}
                                <div className="carousel-item">
                                    <div className="testimonial-bx text-center">
                                        <div className="testimonial-thumb mb-3">
                                            <img
                                                src="assets/images/testimonials/pic2.jpg"
                                                alt="Testimonial 2"
                                                className="rounded-circle"
                                                width="90"
                                                height="90"
                                            />
                                        </div>
                                        <div className="testimonial-info mb-2">
                                            <h5 className="name mb-0">Jane Cooper</h5>
                                            <p className="text-muted">- Project Manager</p>
                                        </div>
                                        <div className="testimonial-content px-4">
                                            <p>
                                                “Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                It has survived not only five centuries, but also the leap into electronic typesetting.”
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Carousel Controls */}
                            <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            </button>
                        </div>
                    </div>
                </div>


                <div className="section-area section-sp2">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 heading-bx left">
                                <h2 className="title-head">Recent <span>News</span></h2>
                                <p>It is a long established fact that a reader will be distracted by the readable
                                    content of a page</p>
                            </div>
                        </div>
                        <div className="recent-news-carousel owl-carousel owl-btn-1 col-12 p-lr0">
                            <div className="item">
                                <div className="recent-news">
                                    <div className="action-box">
                                        <img src="assets/images/blog/latest-blog/pic1.jpg" alt=""/>
                                    </div>
                                    <div className="info-bx">
                                        <ul className="media-post">
                                            <li><a href="#"><i className="fa fa-calendar"></i>Jan 02 2019</a></li>
                                            <li><a href="#"><i className="fa fa-user"></i>By William</a></li>
                                        </ul>
                                        <h5 className="post-title"><a href="blog-details.html">This Story Behind
                                            Education Will Haunt You Forever.</a></h5>
                                        <p>Knowing that, you’ve optimised your pages countless amount of times, written
                                            tons.</p>
                                        <div className="post-extra">
                                            <a href="#" className="btn-link">READ MORE</a>
                                            <a href="#" className="comments-bx"><i className="fa fa-comments-o"></i>20
                                                Comment</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="recent-news">
                                    <div className="action-box">
                                        <img src="assets/images/blog/latest-blog/pic2.jpg" alt=""/>
                                    </div>
                                    <div className="info-bx">
                                        <ul className="media-post">
                                            <li><a href="#"><i className="fa fa-calendar"></i>Feb 05 2019</a></li>
                                            <li><a href="#"><i className="fa fa-user"></i>By John</a></li>
                                        </ul>
                                        <h5 className="post-title"><a href="blog-details.html">What Will Education Be
                                            Like In The Next 50 Years?</a></h5>
                                        <p>As desperate as you are right now, you have done everything you can on
                                            your.</p>
                                        <div className="post-extra">
                                            <a href="#" className="btn-link">READ MORE</a>
                                            <a href="#" className="comments-bx"><i className="fa fa-comments-o"></i>14
                                                Comment</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="recent-news">
                                    <div className="action-box">
                                        <img src="assets/images/blog/latest-blog/pic3.jpg" alt=""/>
                                    </div>
                                    <div className="info-bx">
                                        <ul className="media-post">
                                            <li><a href="#"><i className="fa fa-calendar"></i>April 14 2019</a></li>
                                            <li><a href="#"><i className="fa fa-user"></i>By George</a></li>
                                        </ul>
                                        <h5 className="post-title"><a href="blog-details.html">Master The Skills Of
                                            Education And Be.</a></h5>
                                        <p>You will see in the guide all my years of valuable experience together
                                            with.</p>
                                        <div className="post-extra">
                                            <a href="#" className="btn-link">READ MORE</a>
                                            <a href="#" className="comments-bx"><i className="fa fa-comments-o"></i>23
                                                Comment</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>


        </div>

        <Footer/>
    </>
}