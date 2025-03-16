import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    lounge: { type: String, required: true },
    space: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },
    person: { type: String, required: true }
});

export default mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);