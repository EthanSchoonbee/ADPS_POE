import mongoose from 'mongoose';

// employee schema
const EmployeeSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: false, default: "employee" },
});

// export the schema
const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;