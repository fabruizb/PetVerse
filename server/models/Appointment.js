import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    User: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true }, 
    description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Appointment", AppointmentSchema);
