import express from 'express';
import Appointment from '../models/Appointment.js';
import { verifyToken } from '../middlewares/auth.js';
import multer from 'multer';

const router = express.Router();

// Obtener todas las citas del usuario autenticado
router.get('/', verifyToken, async (req, res) => {
    try {
        const appointments = await Appointment.find({ User: req.userId }).populate('pet');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las citas', error });
    }
});

// Crear una nueva cita
router.post('/', verifyToken, async (req, res) => {
    try {
        const { pet, date, type, description } = req.body;

        const newAppointment = new Appointment({
            User: req.userId,
            pet,
            date,
            type,
            description
        });

        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la cita', error });
    }
}); 

// Actualizar una cita
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { pet, date, type, description } = req.body;
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { pet, date, type, description },
            { new: true }
        );
        if (!updatedAppointment) return res.status(404).json({ message: 'Cita no encontrada' });
        res.json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la cita', error });
    }
});

// Eliminar una cita
router.delete('/:id', verifyToken, async (req, res) => {    
    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!deletedAppointment) return res.status(404).json({ message: 'Cita no encontrada' });
        res.json({ message: 'Cita eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la cita', error });
    }
}); 

export default router;