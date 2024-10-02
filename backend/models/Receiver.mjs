import mongoose from 'mongoose';

// employee schema
const ReceiverSchema = new mongoose.Schema({
    swiftCode: { type: String, required: true, unique: true },
    recipientAccountNo: { type: String, required: true, unique: true },
    recipientBank: { type: String, required: true },
    recipientName: { type: String, required: true },
});

// export the schema
const Receiver = mongoose.model('Receiver', ReceiverSchema);

export default Receiver;