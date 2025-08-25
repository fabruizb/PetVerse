import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    date: { type: String, required: true },
    type: { type: String, required: true }, 
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    time: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Appointment", AppointmentSchema);
