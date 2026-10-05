import Header from "./Componant/Header";
import Sidebar from "./Componant/Sidebar";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiModel from "../../../API/ApiModel";
import { handlePayment } from "../Student/loader";
import {useAuth} from "../../../Auth/AuthProvider"; // Razorpay helper

export default function BankDetailsPage() {
    const apiModel = new ApiModel();

    const [facultyList, setFacultyList] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [paying, setPaying] = useState(false);
    const [isExistingRecord, setIsExistingRecord] = useState(false);
    const [tableData, setTableData] = useState([]);

    const [formData, setFormData] = useState({
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        accountType: "",
        salaryType: "",
        salaryAmount: "",
        panNumber: ""
    });

    // ================= FETCH FACULTY =================
    useEffect(() => {
        fetchFaculty();
    }, [search]);

    const fetchFaculty = async () => {
        try {
            const res = await apiModel.PostMethod({ search }, "FacultyRead");
            setFacultyList(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    // ================= FETCH BANK DETAILS =================
    const fetchBankDetails = async (facultyId) => {
        try {
            setLoading(true);
            const res = await apiModel.PostMethod(
                { facultyId },
                "faculty-bank/read"
            );

            if (res.success && res.data.length > 0 && res.data[0].bank_name) {
                const row = res.data[0];

                setFormData({
                    accountHolderName: row.account_holder_name || "",
                    bankName: row.bank_name || "",
                    accountNumber: row.account_number || "",
                    ifscCode: row.ifsc_code || "",
                    accountType: row.account_type || "",
                    salaryType: row.salary_type || "",
                    salaryAmount: row.salary_amount || "",
                    panNumber: row.pan_number || ""
                });

                setTableData([row]);
                setIsExistingRecord(true);
            } else {
                resetForm();
                setTableData([]);
                setIsExistingRecord(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ================= HELPERS =================
    const resetForm = () => {
        setFormData({
            accountHolderName: "",
            bankName: "",
            accountNumber: "",
            ifscCode: "",
            accountType: "",
            salaryType: "",
            salaryAmount: "",
            panNumber: ""
        });
    };

    const handleFacultyChange = (e) => {
        const id = e.target.value;
        if (!id) return;

        const faculty = facultyList.find(f => String(f.Id) === String(id));
        setSelectedFaculty(faculty);
        fetchBankDetails(id);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ================= SAVE / UPDATE BANK =================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFaculty) return;

        const endpoint = isExistingRecord
            ? "faculty-bank/update"
            : "faculty-bank/insert";

        try {
            setLoading(true);
            const res = await apiModel.PostMethod(
                { facultyId: selectedFaculty.Id, ...formData },
                endpoint
            );

            if (res.success) {
                alert(isExistingRecord ? "Updated successfully" : "Inserted successfully");
                fetchBankDetails(selectedFaculty.Id);
            } else {
                alert(res.message || "Save failed");
            }
        } catch {
            alert("Save failed");
        } finally {
            setLoading(false);
        }
    };

    // ================= DELETE BANK =================
    const handleDelete = async () => {
        if (!window.confirm("Delete this bank record?")) return;

        try {
            const res = await apiModel.PostMethod(
                { facultyId: selectedFaculty.Id },
                "faculty-bank/delete"
            );

            if (res.success) {
                alert("Deleted successfully");
                resetForm();
                setTableData([]);
                setIsExistingRecord(false);
            }
        } catch {
            alert("Delete failed");
        }
    };

    // ================= RAZORPAY SALARY PAYMENT =================
    const handleSalaryPayment = async () => {
        if (!selectedFaculty || !formData.salaryAmount) {
            alert("Faculty or salary missing");
            return;
        }

        setPaying(true);

        // handlePayment is your Razorpay helper
        await handlePayment(Number(formData.salaryAmount), async (transactionId) => {
            try {
                // Formatting date to YYYY-MM-DD
                const currentDate = new Date().toISOString().split("T")[0];

                const res = await apiModel.PostMethod(
                    {
                        facultyId: selectedFaculty.Id,
                        transactionId: transactionId,
                        amount: Number(formData.salaryAmount),
                        date: currentDate // Key changed from 'paymentDate' to 'date'
                    },
                    "salary/insert" // Endpoint changed to match your backend route
                );

                if (res.success) {
                    alert("✅ Salary record inserted successfully");
                } else {
                    alert(res.error || "Salary record failed");
                }
            } catch (err) {
                console.error(err);
                alert("Razorpay Success, but DB Insert Failed");
            } finally {
                setPaying(false);
            }
        });
    };

    // ================= UI =================
    return (
        <div className="ttr-opened-sidebar ttr-pinned-sidebar">
            <Header />
            <Sidebar />

            <main className="ttr-wrapper pt-5">
                <div className="container-fluid">

                    {/* SELECT FACULTY */}
                    <div className="col-lg-4 mb-4">
                        <input
                            className="form-control mb-2"
                            placeholder="Search faculty..."
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            className="form-select"
                            onChange={handleFacultyChange}
                        >
                            <option value="">Select Faculty</option>
                            {facultyList.map(f => (
                                <option key={f.Id} value={f.Id}>
                                    {f.Name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* FORM */}
                    {selectedFaculty && (
                        <div className="card shadow-sm mb-4">
                            <div className="card-header fw-bold">
                                Bank Details – {selectedFaculty.Name}
                            </div>

                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        {[
                                            ["accountHolderName", "Account Holder"],
                                            ["bankName", "Bank Name"],
                                            ["accountNumber", "Account Number"],
                                            ["ifscCode", "IFSC Code"],
                                            ["salaryAmount", "Salary Amount"],
                                            ["panNumber", "PAN Number"]
                                        ].map(([key, label]) => (
                                            <div className="col-md-4" key={key}>
                                                <label className="form-label">{label}</label>
                                                <input
                                                    className="form-control"
                                                    name={key}
                                                    value={formData[key]}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4">
                                        <button className="btn btn-primary me-2" disabled={loading}>
                                            {isExistingRecord ? "Update" : "Save"}
                                        </button>

                                        {isExistingRecord && (
                                            <>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger me-2"
                                                    onClick={handleDelete}
                                                >
                                                    Delete
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-success"
                                                    disabled={paying}
                                                    onClick={handleSalaryPayment}
                                                >
                                                    {paying ? "Processing..." : "Pay Salary"}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* TABLE */}
                    {tableData.length > 0 && (
                        <div className="card shadow-sm">
                            <div className="card-header fw-bold">
                                Bank Record
                            </div>
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th>Faculty</th>
                                    <th>Bank</th>
                                    <th>Account</th>
                                    <th>IFSC</th>
                                    <th>Salary</th>
                                    <th>PAN</th>
                                </tr>
                                </thead>
                                <tbody>
                                {tableData.map((row, i) => (
                                    <tr key={i}>
                                        <td>{row.FacultyName}</td>
                                        <td>{row.bank_name}</td>
                                        <td>{row.account_number}</td>
                                        <td>{row.ifsc_code}</td>
                                        <td>₹{row.salary_amount}</td>
                                        <td>{row.pan_number}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}