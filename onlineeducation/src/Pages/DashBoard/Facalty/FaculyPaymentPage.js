import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import ApiModel from "../../../API/ApiModel";
import { useAuth } from "../../../Auth/AuthProvider";

const FacultyPayment = () => {
    return (
        <div className="ttr-opened-sidebar ttr-pinned-sidebar">
            <Header />
            <Sidebar />
            <SalaryTable />
        </div>
    );
};

export default FacultyPayment;

/* ================= SALARY TABLE ================= */

function SalaryTable() {
    const apiModel = new ApiModel();
    const { userDetail } = useAuth();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* -------- YOUR EXACT useEffect -------- */
    useEffect(() => {
        apiModel.PostMethod(
            { registrationId: userDetail.Id },
            "get-salaries-by-registration"
        ).then((data) => {
            console.log(data);

            if (data?.success) {
                setRows(data.data || []);
            } else {
                setError("No salary records found.");
            }
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            setError("Unable to fetch salary data.");
            setLoading(false);
        });
    }, []);

    return (
        <>
            <main className="ttr-wrapper">
                <div className="container-fluid">

                    <h4 className="mb-4">Salary Records</h4>

                    <div className="card border-0 shadow-sm">
                        <div className="card-body">

                            {loading && (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary"></div>
                                    <p className="mt-2">Loading salary data...</p>
                                </div>
                            )}

                            {!loading && error && (
                                <div className="alert alert-warning text-center">
                                    {error}
                                </div>
                            )}

                            {!loading && !error && (
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped align-middle">
                                        <thead className="table-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Transaction ID</th>
                                            <th>Amount</th>
                                            <th>Payment Date</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {rows.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center text-muted py-4">
                                                    No salary records available.
                                                </td>
                                            </tr>
                                        ) : (
                                            rows.map((row, index) => (
                                                <tr key={row.Id}>
                                                    <td>{index + 1}</td>
                                                    <td>{row.transactionId}</td>
                                                    <td>₹{row.amount}</td>
                                                    <td>{row.date}</td>
                                                </tr>
                                            ))
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </main>

            <div className="ttr-overlay"></div>
        </>
    );
}
