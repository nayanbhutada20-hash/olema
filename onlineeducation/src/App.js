import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// Pages
import Home from "./Pages/Home";
import LogIn from "./Pages/LogIn/LogIn";
import SignUp from "./Pages/Registration/SignUp";
import Forgot from "./Pages/ForgotPass/Forgot";
import AdminDashBoard from "./Pages/DashBoard/Admin/AdminDashBoard";
import Courses from "./Pages/DashBoard/Admin/Courses";
import Faculty from "./Pages/DashBoard/Admin/Faculty";
import Event from "./Pages/DashBoard/Admin/Event";
import Fees from "./Pages/DashBoard/Admin/Fees";
import AccountDetails from "./Pages/DashBoard/Admin/AccountDetails"
import Chat from "./Pages/DashBoard/Admin/Chat";
import STUDENTDATA from "./Pages/DashBoard/Admin/STUDENTDATA"
import MyProfile from "./Pages/DashBoard/Admin/MyProfile";
import StudentDashboard from "./Pages/DashBoard/Student/StudentDashboard";
import FacultyDashboard from "./Pages/DashBoard/Facalty/FacultyDashboard";
import ProtectedRoute from "./Auth/ProtectedRoute";
import AuthProvider from "./Auth/AuthProvider";
import StudentCourses from "./Pages/DashBoard/Student/StudentCourses";
import StudentMyCourses from "./Pages/DashBoard/Student/StudentMyCourses";
import StudentProfile from "./Pages/DashBoard/Student/StudentProfile";
import StudentEvents from "./Pages/DashBoard/Student/StudentEvents";
import StudentFees from "./Pages/DashBoard/Student/StudentFees";
import FacultyCourses from "./Pages/DashBoard/Facalty/FacultyCourses";
import FacultyProfile from "./Pages/DashBoard/Facalty/FacultyProfile";
import FacultyEvents from "./Pages/DashBoard/Facalty/FacultyEvents";
import FacultyPayment from "./Pages/DashBoard/Facalty/FaculyPaymentPage";
import CalendarWithTimeSlots from "./Pages/DashBoard/Admin/Componant/BatchTime/CalendarWithTimeSlots";
import PublicEvent from "./Pages/Events";
import Contact from "./PublicPage/Contact";
import About from "./PublicPage/About";


export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<Home />} />
                    <Route path="/SignIn" element={<LogIn />} />
                    <Route path="/SignUp" element={<SignUp />} />
                    <Route path="/ForgotPassword" element={<Forgot />} />
                    <Route path="/Contact" element={<Contact/>}/>
                    <Route path="/About" element={<About/>}/>

                    <Route path="/PublicEvent" element={<PublicEvent />} />


                    {/* Admin */}
                    <Route path="/Admin/AdminDashboard" element={<ProtectedRoute requiredRole="Admin"><AdminDashBoard /></ProtectedRoute>} />
                    <Route path="/Admin/Courses" element={<ProtectedRoute requiredRole="Admin"><Courses /></ProtectedRoute>} />
                    <Route path="/Admin/Faculty" element={<ProtectedRoute requiredRole="Admin"><Faculty /></ProtectedRoute>} />
                    <Route path="/Admin/Events" element={<ProtectedRoute requiredRole="Admin"><Event /></ProtectedRoute>} />
                    <Route path="/Admin/Fees" element={<ProtectedRoute requiredRole="Admin"><Fees /></ProtectedRoute>} />
                    <Route path="/Admin/Chat" element={<ProtectedRoute requiredRole="Admin"><CalendarWithTimeSlots /></ProtectedRoute>} />
                    <Route path="/Admin/Profile" element={<ProtectedRoute requiredRole="Admin"><MyProfile /></ProtectedRoute>} />
                    <Route path="/Admin/AccountDetails" element={<ProtectedRoute requiredRole="Admin"><AccountDetails /></ProtectedRoute>} />
                    <Route path="/Admin/STUDENTDATA" element={<ProtectedRoute requiredRole="Admin"><STUDENTDATA/></ProtectedRoute>}/>
                    {/* Student */}
                    <Route path="Student/StudentDashboard" element={<ProtectedRoute requiredRole="Student"><StudentDashboard /></ProtectedRoute>} />
                    <Route path="/Student/Courses" element={<ProtectedRoute requiredRole="Student"><StudentCourses /></ProtectedRoute>} />
                    <Route path="/Student/MyCourses" element={<ProtectedRoute requiredRole="Student"><StudentMyCourses /></ProtectedRoute>} />
                    <Route path="/Student/Profile" element={<ProtectedRoute requiredRole="Student"><StudentProfile /></ProtectedRoute>} />
                    <Route path="/Student/Events" element={<ProtectedRoute requiredRole="Student"><StudentEvents /></ProtectedRoute>} />
                    <Route path="/Student/Fees" element={<ProtectedRoute requiredRole="Student"><StudentFees /></ProtectedRoute>} />

                    {/* Faculty */}
                    <Route path="/Faculty/FacultyDashboard" element={<ProtectedRoute requiredRole="Faculty"><FacultyDashboard /></ProtectedRoute>} />
                    <Route path="/Faculty/Courses" element={<ProtectedRoute requiredRole="Faculty"><FacultyCourses /></ProtectedRoute>} />
                    <Route path="/Faculty/Profile" element={<ProtectedRoute requiredRole="Faculty"><FacultyProfile /></ProtectedRoute>} />
                    <Route path="/Faculty/Events" element={<ProtectedRoute requiredRole="Faculty"><FacultyEvents /></ProtectedRoute>} />
                    <Route path="/Faculty/Payment" element={<ProtectedRoute requiredRole="Faculty"><FacultyPayment /></ProtectedRoute>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}
