import "./Login.css";
import LeftSide from "../../Componats/LogIn/LeftSide";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { SignIn, SignInWithGoogle } from "../../Model/Auth";
import ApiModel from "../../API/ApiModel";
import { useAuth } from "../../Auth/AuthProvider";

export default function Login() {
    const apiModel = new ApiModel();
    const { setUserDetail } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isDisable, setIsDisable] = useState(false);
    const [message, setMessage] = useState("");

    // 🔹 Email/Password Login
    async function LogInBTN() {
        setIsDisable(true);
        setMessage("");

        try {
            const result = await SignIn(email, password);
            setIsDisable(false);

            console.log("🔍 Login result:", result);

            if (result.status === "success" && result.data) {
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
                setMessage(result?.data?.message || "Invalid credentials. Try again.");
            }
        } catch (error) {
            console.error("❌ Login Error:", error);
            setMessage("❌ Something went wrong. Please try again later.");
            setIsDisable(false);
        }
    }

    // 🔹 Google Login
    async function GoogleButton() {
        try {
            const result = await SignInWithGoogle();
            console.log("🔍 Google SignIn result:", result);

            if (result?.status === "success" && result?.data) {
                const { uid, displayName } = result.data;
                console.log("✅ UID:", uid);
                console.log("✅ Display Name:", displayName);

                if(displayName!=null){
                    const payload = { docId: uid, displayName };
                    const response = await apiModel.PostMethod(payload, "RegistrationRead");

                    if (response?.data?.length > 0) {
                        const userData = response.data[0];
                        setUserDetail(userData);

                        const userType = userData.UserType?.trim();
                        console.log("👤 UserType:", userType);

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
                        <h2 className="title-head">
                            Login to your <span>Account</span>
                        </h2>
                        <p>
                            Don't have an account?{" "}
                            <Link to={"/SignUp"}>Create one here</Link>
                        </p>
                    </div>

                    <div className="contact-bx">
                        <div className="row placeani">
                            {/* 🔹 Email Input */}
                            <div className="col-lg-12">
                                <div className="form-group">
                                    <div className="input-group">
                                        <input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            className="form-control"
                                            placeholder="Your Email"
                                            disabled={isDisable}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 🔹 Password Input */}
                            <div className="col-lg-12">
                                <div className="form-group">
                                    <div className="input-group">
                                        <input
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            type="password"
                                            className="form-control"
                                            placeholder="Your Password"
                                            disabled={isDisable}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 🔹 Error / Info Message */}
                            {message && (
                                <div className="col-lg-12">
                                    <label
                                        className={`${
                                            message.startsWith("❌") || message.includes("Invalid")
                                                ? "text-danger"
                                                : "text-success"
                                        }`}
                                    >
                                        {message}
                                    </label>
                                </div>
                            )}

                            {/* 🔹 Forgot Password */}
                            <div className="col-lg-12">
                                <div className="form-group form-forget">
                                    <Link to={"/ForgotPassword"} className="ml-auto">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            {/* 🔹 Login Button */}
                            <div className="col-lg-12 m-b30">
                                <button
                                    onClick={LogInBTN}
                                    disabled={isDisable}
                                    className="btn btn-primary w-100"
                                >
                                    {isDisable ? "Logging in..." : "Login"}
                                </button>
                            </div>

                            {/* 🔹 Social Login */}
                            <div className="col-lg-12">
                                <h6>Login with Social media</h6>
                                <div className="d-flex gap-2">
                                    <a
                                        className="btn flex-fill btn-primary d-flex align-items-center justify-content-center"
                                        href="#"
                                    >
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
