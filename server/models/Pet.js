import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: { // Ej: Dog, Cat, Bird, etc.
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
    imageUrl: { // La URL de la imagen que Multer te dará
        type: String,
        required: true
    },
    owner: { // Para asociar la mascota a un usuario
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Asume que tu modelo de usuario se llama 'User'
        required: true
    },
    // Puedes añadir más campos aquí si lo necesitas (ej: description, medicalHistory, etc.)
}, {
    timestamps: true // Añade createdAt y updatedAt automáticamente
});

const Pet = mongoose.model('Pet', petSchema);

export default Pet;