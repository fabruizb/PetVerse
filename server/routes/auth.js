import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const router = express.Router();

// Registro 
router.post('/register', async (req, res) => {
    try {
        const {  email, password } = req.body;

        // Validar si el usuario ya existe
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'Usuario ya existe' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({  email, password: hashed });
        await newUser.save();


        res.status(201).json({ message: 'Usuario registrado exitosamente' });
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




export default router;