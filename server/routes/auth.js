import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middlewares/auth.js';
import User from '../models/User.js';


const router = express.Router();

// Registro 
router.post('/register', async (req, res) => {
    try {
        console.log('❗ datos recibidos en /register:', req.body);
        const { email, password, userName } = req.body;

        if (!email || !password || !userName) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Validar si el usuario ya existe
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'Usuario ya existe' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashed, userName }); // Asegúrate que userName esté en el modelo
        await newUser.save();

        // Generar token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Responder con token y datos del usuario
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                _id: newUser._id,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('❌ ERROR en /register:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});


// Inicio de sesión

router.post('/login', async (req, res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({ email }); 
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });    

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });  
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        console.error('❌ ERROR en /me:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

export default router;