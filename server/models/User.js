import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userName: { type: String, required: true },

    pets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
