import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { verifyToken } from './middleware/auth.js';
import petRoutes from './routes/pets.js';
import appointmentRoutes from './routes/appointments.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', (req, res, next) => {
    console.log(`[DEBUG] Solicitud a /uploads recibida: ${req.method} ${req.originalUrl}`);
    next(); 
});

const uploadsPath = path.join(__dirname, 'public', 'uploads');
console.log('Ruta de uploads que express.static intentará servir:', uploadsPath);

// 2. Middleware para servir archivos estáticos
app.use('/uploads', express.static(uploadsPath));
console.log('Middleware express.static para /uploads registrado.');


app.get('/uploads/test.txt', (req, res) => {
    console.log('Accediendo a /uploads/test.txt - Esto NO debería ejecutarse si express.static funciona.');
    res.send('Este es un archivo de prueba. Si ves esto, express.static no está sirviendo.');
});
console.log('Ruta de depuración /uploads/test.txt registrada.');

app.get('/uploads/test-image.png', (req, res) => {
    const testImagePath = path.join(uploadsPath, 'test-image.png');
    console.log(`[DEBUG] Intentando servir test-image.png desde: ${testImagePath}`);
    fs.readFile(testImagePath, (err, data) => {
        if (err) {
            console.error(`[DEBUG] Error al leer test-image.png: ${err}`);
            return res.status(404).send('Imagen de prueba no encontrada o error al leer.');
        }
        res.writeHead(200, { 'Content-Type': 'image/png' }); 
        res.end(data);
        console.log('[DEBUG] test-image.png servida directamente.');
    });
});
console.log('Ruta de depuración /uploads/test-image.png registrada.');


app.use('/api/auth', authRoutes);
console.log('Rutas de autenticación (/api/auth) registradas.');
app.use('/api/pets', petRoutes);
console.log('Rutas de mascotas (/api/pets) registradas.');
app.use('/api/appointments', appointmentRoutes);
console.log('Rutas de citas (/api/appointments) registradas.');

app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: 'Protected route accessed', user: req.user });
});
console.log('Ruta protegida (/api/protected) registrada.');


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});

app.use((err, req, res, next) => {
    console.error('❌ ERROR GLOBAL CAPTURADO:', err.stack);
    res.status(500).send('Something broke on the server!');
});
console.log('Middleware de manejo de errores global registrado (al final).');
