// routes/pets.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Pet from '../models/Pet.js';
import { verifyToken } from '../middleware/auth.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext)
            .toLowerCase()
            .replace(/\s+/g, '-')  
            .replace(/[^a-z0-9-_]/g, '');
        cb(null, `${Date.now()}-${baseName}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


router.post('/', upload.single('image'), verifyToken, async (req, res) => {
    try {
        console.log('Datos recibidos para nueva mascota:', req.body);
        console.log('Archivo subido:', req.file);

        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ningún archivo de imagen.' });
        }

        const { name, type, breed, age } = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;


        const newPet = new Pet({
            name,
            type,
            breed,
            age: parseInt(age),
            imageUrl,
            owner: req.userId,
        });

        await newPet.save();

        const user = await User.findById(req.userId);
        if (!user) {
            console.error('Usuario no encontrado al añadir mascota.');
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        user.pets.push(newPet._id);
        await user.save();

        res.status(201).json({
            message: 'Mascota añadida exitosamente',
            id: newPet._id,
            name: newPet.name,
            type: newPet.type,
            breed: newPet.breed,
            age: newPet.age,
            imageUrl: newPet.imageUrl
        });

    } catch (error) {
        console.error('❌ ERROR al añadir mascota:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error en el servidor al añadir mascota.' });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const pets = await Pet.find({ owner: req.userId });
        res.status(200).json(pets);
    } catch (error) {
        console.error('❌ ERROR al obtener mascotas:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener mascotas.' });
    }
});

export default router;
