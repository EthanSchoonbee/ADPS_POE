import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EmployeeDash.css";
import AllPayments from "./AllPayments";
import UnverifiedPayments from "./UnverifiedPayments";
import VerifiedPayments from "./VerifiedPayments";

const EmployeeDash = () => {
    const [activeSection, setActiveSection] = useState("all");
    const [employeeInfo, setEmployeeInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            handleLogout();
        } else {
            fetchEmployeeInfo();
        }
    }, []);

    const fetchEmployeeInfo = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "https://localhost:3001/api/auth/employee",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setEmployeeInfo(response.data.employee);
        } catch (error) {
            console.error("Error fetching employee info:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const renderContent = () => {
        switch (activeSection) {
            case "all":
                return <AllPayments />;
            case "verified":
                return <VerifiedPayments />;
            case "unverified":
                return <UnverifiedPayments />;
            default:
                return <AllPayments />;
        }
    };

    return (
        <div className="employee-dashboard-container">
            <div className="employee-dashboard">
                <div className="sidebar">
                    {employeeInfo && (
                        <h2>Welcome, {employeeInfo.username}</h2>
                    )}
                    <div className="menu-items">
                        <button
                            className={activeSection === "all" ? "active" : ""}
                            onClick={() => setActiveSection("all")}
                        >
                            All Payments
                        </button>
                        <button
                            className={activeSection === "unverified" ? "active" : ""}
                            onClick={() => setActiveSection("unverified")}
                        >
                            Unverified Payments
                        </button>
                        <button
                            className={activeSection === "verified" ? "active" : ""}
                            onClick={() => setActiveSection("verified")}
                        >
                            Verified Payments
                        </button>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
                <div className="main-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDash;
