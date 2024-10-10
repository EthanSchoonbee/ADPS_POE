import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EmployeeDash.css";

//Importing all the components that will be displayed on the Employee dashboard
import AllPayments from "./AllPayments.js";
import VerifiedPayments from "./VerifiedPayments";
import UnverifiedPayments from "./UnverifiedPayments";
import VerifyPayment from "./VerifyPayment";
import {jwtDecode} from "jwt-decode";

//The entire employee dashboard component
const EmployeeDash = () => {
    //Declaring variables
    //Payment and set payment variable
    const [payments, setPayments] = useState([]);
    const [activeSection, setActiveSection] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [employeeInfo, setEmployeeInfo] = useState(null);
    const [users, setUsers] = useState({});
    const navigate = useNavigate();

    const [authError, setAuthError] = useState(null);

    //use effect to hook into the component lifecycle
    useEffect(() => {
        //getting the token from the local storage
        const token = localStorage.getItem("token");
        //if there is no token
        if (!token) {
            //log the user out
            handleLogout();
            //else will perform necessary starting actions
        } else {

            try{
                const decodedToken = jwtDecode(token);
                if(decodedToken.role !== "employee"){
                    setAuthError("You don't have permission to access this page.");
                    setTimeout(() =>{
                        navigate("/Dashboard");
                    }, 3000)//Redirect after 3 seconds
                }else{
                    //will fetch the employee information
                    fetchEmployeeInfo();
                    //will fetch the payment information of all the payments that have been made on the system
                    fetchPayments();
                }
            }
            catch(error){
                console.error("Error decoding token:", error);
                navigate("/");
            }

        }
    }, []);

    //Function used to fetch the employee information
    const fetchEmployeeInfo = async () => {
        //try catch block
        try {
            //getting the token from the local storage
            const token = localStorage.getItem("token");
            //making a get request to the backend   to get the employee information
            const response = await axios.get(
                //the endpoint leading to the auth page and employee route
                "https://localhost:3001/api/auth/employee",
                //the headers that will be sent with the request
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            //setting the employee information to the response data
            setEmployeeInfo(response.data.employee);
            //catching any errors found
        } catch (error) {
            //logging the error
            console.error("Error fetching employee info:", error);
            //setting the error
            setError("Failed to fetch employee information.");
        }
    };

    //fetching the payment information
    const fetchPayments = async () => {
        //try catch block
        try {
            //set a loading state for all the payment information to load on the page
            setLoading(true);
            //getting the token from the local storage
            const token = localStorage.getItem("token");
            //making a get request to the backend to get all the payments that have been made
            const response = await axios.get(
                "https://localhost:3001/api/transaction/all-payments",
                //the headers that will be sent with the request
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const paymentsData = response.data.payments;

            // Fetch user details for each unique user ID
            const uniqueUserIds = [...new Set(paymentsData.map(payment => payment.userId))];
            const userDetails = await fetchUserDetails(uniqueUserIds);

            //Updating the payments with user details. The sender name and surname
            const updatedPayments = paymentsData.map(payment => ({
                ...payment,
                senderName: userDetails[payment.userId]//getting the user id from the payment collection
                    //if found. then will get the first name and last name of the user and display it
                    ? `${userDetails[payment.userId].firstname} ${userDetails[payment.userId].lastname}`
                    : 'Unknown'//else will display unknown if the user is not found
            }));

            //logging the updated payments
            console.log("Updated payments:", updatedPayments);

            //setting the payments to the updated payments
            setPayments(updatedPayments);
            setLoading(false);//setting the loading to false
        } catch (error) {
            //error found in fetching the payments
            console.error("Error fetching payments:", error);
            //setting the error
            setError("Failed to fetch payments. Please try again.");
            setLoading(false); //loading will stop
            //if the error response is 401
            if (error.response && error.response.status === 401) {
                handleLogout(); //will log the user out
            }
        }
    };

    const fetchUserDetails = async (userIds) => {
        const token = localStorage.getItem("token");
        const userDetails = {};

        for (const userId of userIds) {
            try {
                const response = await axios.get(
                    `https://localhost:3001/api/auth/user/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                userDetails[userId] = response.data.user;
            } catch (error) {
                console.error(`Error fetching user details for ID ${userId}:`, error);
            }
        }

        console.log("Fetched user details:", userDetails); //Debugging if the user details are found
        return userDetails;//returning the user details
    };

    //function to handle the logout of the user
    const handleLogout = () => {
        //removing the token
        localStorage.removeItem("token");
        navigate("/"); //navigating back to the login page
    };

    // Function to handle selecting a payment for verification
    const handleSelectPayment = (payment) => {
        setSelectedPayment(payment); //setting the selected payment to the payment that was selected
        setActiveSection("verify"); //setting the active section to verify
    };

    // Function to handle going back to the unverified payments list
    const handleBackToUnverified = () => {
        setSelectedPayment(null); //setting the selected payment to null
        setActiveSection("unverified"); //setting the active section to unverified
    };

    //Function that will be used to render the content on the main menu dashboard
    const renderContent = () => {
        //switch statement to check the active section
        switch (activeSection) {
            //if the active section is all
            case "all":
                //then will call the "all payments" component that gets all the 'set payments' that was retrieved from the backend
                //This is set to the current activated section. So on start. this is where the user will be directed to
                return (
                    <AllPayments payments={payments} onSectionChange={setActiveSection} />
                );
            //if the case is verified
            case "verified":
                //then calling the verified payments component that will display all the payments that have been verified
                return <VerifiedPayments payments={payments} />;
            //if the case is unverified
            case "unverified":
                return (
                    //then calling the unverified payments component that will display all the payments that have not been verified
                    <UnverifiedPayments
                        payments={payments}
                        //on select payment will be called when a payment is selected
                        onSelectPayment={handleSelectPayment}
                    />
                );
            //if the case is verify
            case "verify":
                return (
                    //will call the verify payment component that will display the payment that was selected
                    <VerifyPayment
                        payment={selectedPayment} /*getting the selected payment details*/
                        onBack={
                            handleBackToUnverified
                        } /*on back will go back to the previous page*/
                        onVerificationComplete={
                            fetchPayments
                        } /*on verification complete will fetch the payments again*/
                    />
                );
            default:
                /*if none of the above cases are met then will return the all payments component*/
                return (
                    <AllPayments payments={payments} onSectionChange={setActiveSection} />
                );
        }
    };

    //returning the main employee dashboard component
    return (
        //the main container for the employee dashboard
        <div className="employee-dashboard-container">
            {authError? (
              <div className="error-container">
                  <div className="errorMessage">
                      <h2>Access Denied</h2>
                      <p className="flash">{authError}</p>
                      <p className="flash">Redirecting you to the Customer Dashboard...</p>
                  </div>
              </div>
            ) : (
                <>
                    {/*The employee dash*/}
                    <div className="employee-dashboard">
                    {/*The sidebar for the menu*/}
                        <div className="sidebar">
                            {/*if there is employee info then will say welcome and the username*/}
                            {employeeInfo && <h2>Welcome, {employeeInfo.username}</h2>}
                            {/*All the menu items on the sidebar*/}
                            <div className="menu-items">
                                {/*setting the active section for the menu to all payments section. */}
                                <button
                                    className={activeSection === "all" ? "active" : ""}
                                    onClick={() =>
                                        setActiveSection("all")
                                    } /*on click will set the active section to all*/
                                >
                                    All Payments
                                </button>
                                {/*setting the active section for the menu to unverified payments section. */}
                                <button
                                    className={activeSection === "unverified" ? "active" : ""}
                                    onClick={() => setActiveSection("unverified")}
                                >
                                    Unverified Payments
                                </button>
                                {/*setting the active section for the menu to verified payments section. */}
                                <button
                                    className={activeSection === "verified" ? "active" : ""}
                                    onClick={() => setActiveSection("verified")}
                                >
                                    Verified Payments
                                </button>
                            </div>
                            {/*The logout button*/}
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                        {/*The main content for the dashboard*/}
                        <div className="main-content">
                            {/*if loading is true then will display the loading screen*/}
                            {loading ? (
                                //the loading screen. using the loading-payment style
                                <div className="loading-payment">
                                    {/*loading payments*/}
                                    <p>Loading Payments...</p>
                                    {/*loading animation ring*/}
                                    <div className="lds-ring">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            ) : error ? (
                                //if there is an error then will display the error message
                                <p className="error-message">{error}</p>
                            ) : (
                                //else will render all the content(ie the payments)
                                renderContent()
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default EmployeeDash;
