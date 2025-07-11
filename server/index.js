import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';    
import authRoutes from './routes/auth.js';
import { verifyToken } from './middlewares/auth.js';
import petRoutes from './routes/pets.js';
import appointmentRoutes from './routes/appointments.js';   

dotenv.config();

const app = express();  
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('upload', express.static('uploads'));
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () =>  {
        console.log(`Server is running on port ${PORT}`);
    }); 
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
});
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});

app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: 'Protected route accessed', user: req.user });
});
