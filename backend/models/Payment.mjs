import mongoose from 'mongoose';

// payment schema with receiver details included directly
const PaymentSchema = new mongoose.Schema({
    amount: { type: String, required: true },
    currency: { type: String, required: true },
    provider: { type: String, required: true },
    swiftCode: { type: String, required: true },
    recipientAccountNo: { type: String, required: true },
    recipientBank: { type: String, required: true },
    recipientName: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }  // Reference to the user making the payment
});

// export the payment schema
const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
