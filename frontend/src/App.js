import React from "react";

//Routes
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css';

//Pages
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Payment from './Components/Payment/Payment';
import CustomerDash from "./Components/CustomerDashboard/CustomerDash";
import EmployeeDash from "./Components/EmployeeDash/EmployeeDash";
import Dashboard from "./Components/Dashboard/Dashboard";


function App() {
  return (
    <BrowserRouter>
    <main >
      <div>
      <Routes>
        <Route path="/" element={ <Login />} />
        <Route path="/Register" element={ <Register />} />
        <Route path="/Payment" element={ <Payment />} />
        <Route path="/CustomerDash" element={ <CustomerDash />} />
        <Route path={"/EmployeeDash"} element={ <EmployeeDash />} />
        <Route path={"/Dashboard"} element={< Dashboard />} />s
      </Routes>
      </div>
    </main>
    </BrowserRouter>
    
  );
}

export default App;
