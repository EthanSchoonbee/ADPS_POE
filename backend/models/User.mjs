import mongoose from 'mongoose';

// user schema
const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
    idNumber: { type: String, required: true, unique: true },
    role: { type: String, required: false, default: "user" },
});

// export the schema
const User = mongoose.model('User', UserSchema);

export default User;