import express from 'express';
import Appointment from '../models/Appointment.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const appointments = await Appointment.find({ owner: req.userId }).populate('pet');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las citas', error });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {

        console.log('Datos del usuario autenticado (req.userId):', req.userId);
        console.log('Datos de la cita recibidos:', req.body);

        const { pet, date, type, title, subtitle, time } = req.body;

        const newAppointment = new Appointment({
            owner: req.userId,
            pet,
            type,
            title,
            subtitle,
            date,
            time
        });

        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error('Error al crear la cita:', error);
        res.status(500).json({ message: 'Error al crear la cita', error });
    }
}); 

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