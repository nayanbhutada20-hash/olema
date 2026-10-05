import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header/Header";
import Sidebar from "./SideBar/Sidebar";
import { useAuth } from "../../../Auth/AuthProvider";
import ApiModel from "../../../API/ApiModel";

/* ================= PAGE ================= */

const StudentFees = () => {
    return (
        <div className="ttr-opened-sidebar ttr-pinned-sidebar">
            <Header />
            <Sidebar />
            <FeesContent />
        </div>
    );
};

export default StudentFees;

/* ================= CONTENT ================= */

function FeesContent() {
    const { userDetail } = useAuth();
    const apiModel = new ApiModel();

    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* ================= FETCH DATA ================= */

    useEffect(() => {
        if (userDetail?.Id) {
            fetchFees();
        }
    }, [userDetail]);

    const fetchFees = async () => {
        console.log("📤 Sending StudentId:", userDetail.Id);

        try {
            setLoading(true);
            setError("");

            const data = await apiModel.PostMethod(
                { studentId: userDetail.Id },
                "FeesReadByStudentID"
            );

            console.log("✅ API DATA (already parsed):", data);

            if (!data.success) {
                console.error("❌ Backend error:", data.error);
                setError("Failed to fetch fees");
                setFees([]);
            } else {
                setFees(data.data || []);
            }
        } catch (err) {
            console.error("🔥 API Exception:", err);
            setError("Server error");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */

    return (
        <main className="ttr-wrapper">
            <div className="container-fluid">

                <h4 className="mb-4">Student Fee Records</h4>

                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <div className="card shadow-sm">
                        <div className="card-body table-responsive">
                            <table className="table table-bordered">
                                <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Course Name</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Transaction ID</th>
                                </tr>
                                </thead>
                                <tbody>
                                {fees.length > 0 ? (
                                    fees.map((item, index) => (
                                        <tr key={item.Id}>
                                            <td>{index + 1}</td>
                                            <td>{item.CourseName}</td>
                                            <td>₹{item.Amount}</td>
                                            <td>{item.Date}</td>
                                            <td>{item.TransactionID}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No data found
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
