import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userName: { type: String, required: true },

    pets: [{
        petName: { type: String,  },
        petType: { type: String,  },
    }]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
