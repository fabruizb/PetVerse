import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import Pet from '../models/Pet.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


const router = express.Router();


// Configuración de multer para manejar la carga de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Obtener todas las mascotas del usuario autenticado
router.get('/', verifyToken, async (req, res) => {
    try {
        const pets = await Pet.find({ owner: req.userId });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las mascotas', error });
    }
});
// Crear una nueva mascota
router.post('/', verifyToken, async (req, res) => {
    try {
    const { name, species, age, breed } = req.body;

    
        const newPet = new Pet({
            name,
            species,
            age,
            breed,
            owner: req.userId
        });

        await newPet.save();
        res.status(201).json(newPet);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la mascota', error });
    }
});

// Actualizar una mascota
router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { name, species, age, breed } = req.body;
        const updatedPet = await Pet.findByIdAndUpdate(
            req.params.id,
            { name, species, age, breed, image: req.file.path },
            { new: true }
        );
        if (!updatedPet) return res.status(404).json({ message: 'Mascota no encontrada' });
        res.json(updatedPet);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la mascota', error });
    }
});

// Eliminar una mascota

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deletedPet = await Pet.findByIdAndDelete(req.params.id);
        if (!deletedPet) return res.status(404).json({ message: 'Mascota no encontrada' });
        res.json({ message: 'Mascota eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la mascota', error });
    }
});

// Subir una imagen de mascota
router.post('/upload', verifyToken, multer({ storage }).single('image'), async (req, res) => {
    try {
        const newPet = new Pet({
            name: req.body.name,
            species: req.body.species,
            age: req.body.age,
            breed: req.body.breed,
            owner: req.userId,
            image: req.file.path
        });
        await newPet.save();
        res.status(201).json(newPet);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la mascota', error });
    }
});







export default router;