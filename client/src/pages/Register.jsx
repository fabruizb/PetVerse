import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GlassButton from '../components/ui/GlassButton';
import GlassCard from '../components/ui/GlassCard';
import GlassInput from '../components/ui/GlassInput';

export default function RegistrationForm() {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate(); 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Datos a enviar:', formData);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                userName: formData.userName,
                email: formData.email,
                password: formData.password
            });

            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', user._id);

            console.log('✅ ¡Cuenta creada con éxito!');
            console.log('Usuario registrado:', res.data);

            
            navigate('/dashboard'); 

        } catch (err) {
            console.error('❌ Error en el registro:', err);

            let errorMessage = 'Error al registrar. Por favor, inténtalo de nuevo.';

            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            console.error(`Mensaje de error del servidor: ${errorMessage}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center  bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
            <GlassCard   className=" p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <img src="/imagenes/Gemini_Generated_Image_xdgunexdgunexdgu.png" alt="PetVerse Logo" className="h-16 rounded-lg" />
                </div>
                <h2 className="text-3xl font-bold text-center text-white-800 mb-2">
                    Create your account
                </h2>
                <p className="text-center text-white-600 mb-8">
                    Join our community of pet lovers!
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <GlassInput type="text" name="userName" placeholder="Your Name" value={formData.userName} onChange={handleInputChange} required />
                    <GlassInput type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleInputChange} required />
                    <GlassInput type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />

                    <GlassButton type="submit" className="w-full mt-6">
                        Create Account
                    </GlassButton>
                </form>

                <p className="text-center text-white-600 mt-6">
                    Already have an account? <a href="/login" className="text-[#084680] hover:underline">Sign in</a>
                </p>
            </GlassCard>
        </div>
    );
}
