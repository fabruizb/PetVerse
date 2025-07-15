import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

export default function RegistrationForm() {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate(); // Inicializa useNavigate

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

            // Redirige al usuario al dashboard
            navigate('/dashboard'); // <--- ¡Aquí está el cambio clave!

        } catch (err) {
            console.error('❌ Error en el registro:', err);

            let errorMessage = 'Error al registrar. Por favor, inténtalo de nuevo.';

            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            console.error(`Mensaje de error del servidor: ${errorMessage}`);
            // Considera mostrar un mensaje de error en la UI aquí, en lugar de un alert
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <img src="/imagenes/ChatGPT Image 13 jul 2025, 17_25_38.png" alt="PetVerse Logo" className="h-16" />
                </div>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Create your account
                </h2>
                <p className="text-center text-gray-600 mb-8">
                    Join our community of pet lovers!
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="userName" placeholder="Your Name" value={formData.userName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-md border border-gray-300" required />
                    <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-md border border-gray-300" required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 rounded-md border border-gray-300" required />

                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md mt-6">
                        Create Account
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Already have an account? <a href="/login" className="text-green-600 hover:underline">Sign in</a>
                </p>
            </div>
        </div>
    );
}
