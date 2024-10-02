import mongoose from 'mongoose';

// employee schema
const PaymentSchema = new mongoose.Schema({
    amount: { type: String, required: true, unique: true },
    currency: { type: String, required: true, unique: true },
    provider: { type: String, required: true },
});

// export the schema
const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;