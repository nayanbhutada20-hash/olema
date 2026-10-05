import React, { useEffect, useState } from "react";
import Header from "./Componant/Header";
import Sidebar from "./Componant/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiModel from "../../../API/ApiModel";

export default function FeesPage() {
    return (
        <div className="ttr-opened-sidebar ttr-pinned-sidebar">
            <Header />
            <Sidebar />
            <FeesData />
        </div>
    );
}

/* ================= MAIN SECTION ================= */
function FeesData() {
    const [search, setSearch] = useState("");

    return (
        <main className="ttr-wrapper">
            <div className="container-fluid py-3">
                <h4 className="mb-3">Fees Management (Admin)</h4>

                <FeesHeader search={search} setSearch={setSearch} />
                <FeesTable search={search} />
            </div>
        </main>
    );
}

/* ================= HEADER ================= */
function FeesHeader({ search, setSearch }) {
    return (
        <div className="mb-3">
            <input
                type="text"
                className="form-control"
                placeholder="Search by student or course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
}

/* ================= TABLE ================= */
function FeesTable({ search }) {
    const apiModel = new ApiModel();
    const [fees, setFees] = useState([]);

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            const res = await apiModel.PostMethod({}, "FeesRead");
            if (res.success) {
                setFees(res.data);
                console.log("ADMIN FEES:", res.data);
            }
        } catch (err) {
            console.error("Error fetching fees:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this transaction?")) return;

        const res = await apiModel.PostMethod({ id }, "FeesDelete");
        if (res.success) {
            setFees(fees.filter((f) => f.FeesId !== id));
        }
    };

    const filteredFees = fees.filter(
        (f) =>
            f.StudentName.toLowerCase().includes(search.toLowerCase()) ||
            f.CourseName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="table-responsive bg-white shadow rounded">
            <table className="table table-bordered table-hover align-middle mb-0">
                <thead className="table-dark text-center">
                <tr>
                    <th>#</th>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Amount (₹)</th>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {filteredFees.length > 0 ? (
                    filteredFees.map((f, index) => (
                        <tr key={f.FeesId}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">{f.StudentID}</td>
                            <td>{f.StudentName}</td>
                            <td>{f.CourseName}</td>
                            <td className="fw-bold text-success">
                                ₹{f.Amount}
                            </td>
                            <td>{f.TransactionID}</td>
                            <td>
                                {new Date(f.Date).toLocaleDateString()}
                            </td>
                            <td className="text-center">
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(f.FeesId)}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" className="text-center text-muted py-4">
                            No transactions found
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
