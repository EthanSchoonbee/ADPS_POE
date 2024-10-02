import mongoose from 'mongoose';
import {Int32} from "mongodb";

// payment schema with receiver details included directly
const PaymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    provider: { type: String, required: true },
    swiftCode: { type: String, required: true },
    recipientAccountNo: { type: Number, required: true },
    recipientBank: { type: String, required: true },
    recipientName: { type: String, required: true },
    isValidated: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }  // Reference to the user making the payment
});

// export the payment schema
const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
