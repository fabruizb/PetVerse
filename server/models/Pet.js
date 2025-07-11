import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    age : { type: Number, required: true },
    breed: { type: String, required: true },
    image: { type: String, default: "https://example.com/default-pet-image.jpg" }, // URL de imagen por defecto
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {timestamps: true    });

const Pet = mongoose.model("Pet", PetSchema);

export default Pet;
