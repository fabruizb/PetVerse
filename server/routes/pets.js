    // routes/pets.js
    import express from 'express';
    import multer from 'multer';
    import path from 'path';
    import { fileURLToPath } from 'url';
    import { dirname } from 'path';
    import Pet from '../models/Pet.js'; // Asegúrate de que la ruta sea correcta
    import { verifyToken } from '../middlewares/auth.js'; // Necesitarás esto si quieres asociar la mascota al usuario logueado

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const router = express.Router();

    // Configuración de almacenamiento para Multer
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // Asegúrate de que esta carpeta exista en tu servidor
            cb(null, path.join(__dirname, '..', 'public', 'uploads'));
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
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

    // **¡ESTA ES LA RUTA QUE DEBE EXISTIR Y ESTAR CORRECTA!**
    // router.post('/') se resuelve a POST /api/pets gracias a app.use('/api/pets', petRoutes) en index.js
    router.post('/', upload.single('image'), verifyToken, async (req, res) => {
        try {
            console.log('Datos recibidos para nueva mascota:', req.body);
            console.log('Archivo subido:', req.file);

            if (!req.file) {
                return res.status(400).json({ message: 'No se subió ningún archivo de imagen.' });
            }

            const { name, type, breed, age } = req.body;
            const imageUrl = `/uploads/${req.file.filename}`;

            // Aquí deberías guardar los datos de la mascota en tu base de datos
            const newPet = new Pet({
                name,
                type,
                breed,
                age: parseInt(age), // Asegúrate de convertir la edad a número
                imageUrl,
                owner: req.userId // req.userId viene del middleware verifyToken
            });

            await newPet.save(); // Guarda la nueva mascota en la base de datos

            res.status(201).json({
                message: 'Mascota añadida exitosamente',
                id: newPet._id, // Devuelve el ID real de la base de datos
                name: newPet.name,
                type: newPet.type,
                breed: newPet.breed,
                age: newPet.age,
                imageUrl: newPet.imageUrl // Devuelve la URL de la imagen guardada
            });

        } catch (error) {
            console.error('❌ ERROR al añadir mascota:', error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error en el servidor al añadir mascota.' });
        }
    });

    // Puedes añadir otras rutas GET, PUT, DELETE para mascotas aquí
    // router.get('/', (req, res) => { /* ... */ });

    export default router;
    