import LeftSide from "../../Componats/LogIn/LeftSide";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignInWithGoogle, SignUp } from "../../Model/Auth";
import {useAuth} from "../../Auth/AuthProvider";
import ApiModel from "../../API/ApiModel";

export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { setUserDetail } = useAuth();
    const apiModel = new ApiModel();

    const navigate = useNavigate();

    async function SignUpBTN() {
        setLoading(true);
        setMessage('');

        try {
            const data = await SignUp(name, email, password);
            console.log(data);

            if (data?.status === "success") {
                setMessage("✅ Sign up successful! Redirecting to login...");
                setTimeout(() => navigate("/SignIn"), 2000);
            } else {
                setMessage("❌ " + (data?.data?.message || "Something went wrong."));
            }
        } catch (error) {
            console.error(error);
            setMessage("❌ Error: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    async function GoogleButton() {
        try {
            const result = await SignInWithGoogle();

            console.log("Google SignIn result:", result);

            if (result?.status === "success" && result?.data) {
                const { uid, displayName } = result.data;
                console.log("✅ UID:", uid);
                console.log("✅ Display Name:", displayName);

                const payload = { docId: uid, displayName };
                const response = await apiModel.PostMethod(payload, "RegistrationRead");

                if (response?.data?.length > 0) {
                    const userData = response.data[0];
                    setUserDetail(userData);

                    const userType = userData.UserType?.trim();
                    console.log("👤 UserType:", userType);

                    // 🔹 Redirect according to UserType
                    if (userType === "Admin") {
                        navigate("/Admin/AdminDashboard");
                    } else if (userType === "Faculty") {
                        navigate("/Faculty/FacultyDashboard");
                    } else if (userType === "Student") {
                        navigate("/Student/StudentDashboard");
                    } else {
                        setMessage("Unknown user type. Please contact support.");
                    }
                } else {
                    setMessage("User not found in database.");
                }
            } else {
                setMessage(result?.data?.message || "Google Sign-In failed.");
            }
        } catch (error) {
            console.error("❌ GoogleButton Error:", error);
            setMessage("❌ Error: " + error.message);
        }
    }

    return (
        <div className="account-form">
            <LeftSide />

            <div className="account-form-inner">
                <div className="account-container">
                    <div className="heading-bx left">
                        <h2 className="title-head">Sign Up <span>Now</span></h2>
                        <p>
                            Already have an account?{" "}
                            <Link to={"/SignIn"}>Click here to login</Link>
                        </p>
                    </div>

                    <div className="contact-bx">
                        <div className="row placeani">
                            <div className="col-lg-12">
                                <div className="form-group">
                                    <div className="input-group">
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            type="text"
                                            required
                                            className="form-control"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12">
                                <div className="form-group">
                                    <div className="input-group">
                                        <input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            required
                                            className="form-control"
                                            placeholder="Your Email Address"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12">
                                <div className="form-group">
                                    <div className="input-group">
                                        <input
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            type="password"
                                            required
                                            className="form-control"
                                            placeholder="Your Password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12 m-b30">
                                <button
                                    onClick={SignUpBTN}
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Creating Account..." : "Sign Up"}
                                </button>
                            </div>

                            <div className="col-lg-12 text-center">
                                <h6>Sign Up with Social Media</h6>
                                <div className="d-flex gap-2">
                                    <a className="btn flex-fill btn-primary d-flex align-items-center justify-content-center" href="#">
                                        <i className="bi bi-facebook me-2"></i>Facebook
                                    </a>
                                    <button
                                        type="button"
                                        onClick={GoogleButton}
                                        className="btn flex-fill btn-danger d-flex align-items-center justify-content-center"
                                    >
                                        <i className="bi bi-google me-2"></i>Google
                                    </button>
                                </div>
                            </div>

                            {message && (
                                <div className="col-lg-12 mt-3">
                                    <div
                                        className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}
                                        role="alert"
                                    >
                                        {message}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
