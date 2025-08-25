import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: { 
        type: String,
        required: true,
        trim: true
    },
    breed: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    imageUrl: { 
        type: String,
        required: true
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
}, {
    timestamps: true 
});

const Pet = mongoose.model('Pet', petSchema);

export default Pet;