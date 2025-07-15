import React, { useEffect, useState } from 'react';
import { initFlowbite } from 'flowbite';
import PetCard from '../components/PetCard';
import AppointmentCard from '../components/AppontmentCard';
import axios from 'axios';

export default function Dashboard() {
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            type: 'checkup',
            title: 'Annual Checkup for Buddy',
            subtitle: 'Dr. Smith at VetCare Clinic',
            date: 'July 15',
            time: '10:30 AM',
        },
        {
            id: 2,
            type: 'grooming',
            title: 'Grooming for Whiskers',
            subtitle: 'Pawsitively Perfect Groomers',
            date: 'August 20',
            time: '2:00 PM',
        },
    ]);

    const [newAppointment, setNewAppointment] = useState({
        type: '',
        title: '',
        subtitle: '',
        date: '',
        time: '',
    });

    const [user, setUser] = useState(null);
    const [userPets, setUserPets] = useState([]);
    const [showAddPetForm, setShowAddPetForm] = useState(false);
    const [newPetData, setNewPetData] = useState({
        name: '',
        breed: '',
        age: '',
        type: '',
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');


    useEffect(() => {
        initFlowbite();

        const fetchUserAndPets = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(res.data);
                if (res.data.pets && Array.isArray(res.data.pets)) {
                    setUserPets(res.data.pets);
                } else {
                    setUserPets([
                        {
                            id: 'predefined-1',
                            imageUrl: "/imagenes/ChatGPT Image 13 jul 2025, 17_25_16.png",
                            name: "Boston",
                            breed: "JackRussell Terrier",
                            age: 9,
                            type: "Dog"
                        },
                        {
                            id: 'predefined-2',
                            imageUrl: "/imagenes/ChatGPT Image 13 jul 2025, 17_25_02.png",
                            name: "Jalapeño",
                            breed: "Champagne",
                            age: 2,
                            type: "Ferret"
                        },
                        {
                            id: 'predefined-3',
                            imageUrl: "/imagenes/ChatGPT Image 13 jul 2025, 17_25_20.png",
                            name: "Dewey",
                            breed: "Sable",
                            age: 3,
                            type: "Ferret"
                        },
                    ]);
                }
            } catch (error) {
                console.error("Error al obtener el usuario o sus mascotas:", error);
            }
        };

        fetchUserAndPets();
    }, []);

    const handleAppointmentInputChange = (e) => {
        const { name, value } = e.target;
        setNewAppointment(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlePetInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const file = files[0];
            setSelectedImage(file);
            if (file) {
                setImagePreviewUrl(URL.createObjectURL(file));
            } else {
                setImagePreviewUrl('');
            }
        } else {
            setNewPetData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmitAppointment = (e) => {
        e.preventDefault();
        if (!newAppointment.type || !newAppointment.title || !newAppointment.date || !newAppointment.time) {
            console.warn('Please fill in all required fields for the appointment.');
            return;
        }

        const newId = appointments.length > 0 ? Math.max(...appointments.map(app => app.id)) + 1 : 1;

        setAppointments(prevAppointments => [
            ...prevAppointments,
            { ...newAppointment, id: newId }
        ]);

        setNewAppointment({ type: '', title: '', subtitle: '', date: '', time: '' });
        setShowAppointmentForm(false);
    };

    const handleAddPetSubmit = async (e) => {
        e.preventDefault();

        if (!newPetData.name || !newPetData.type || !newPetData.breed || !newPetData.age || !selectedImage) {
            console.warn('Please fill in all required fields and select an image for the new pet.');
            return;
        }

        const formData = new FormData();
        formData.append('name', newPetData.name);
        formData.append('type', newPetData.type);
        formData.append('breed', newPetData.breed);
        formData.append('age', newPetData.age);
        formData.append('image', selectedImage);

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No se encontró el token de autenticación.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/pets', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            const addedPet = response.data;
            console.log('✅ Mascota añadida exitosamente (respuesta del backend):', addedPet);
            console.log('URL de la imagen recibida del backend:', addedPet.imageUrl);

            // *** Depuración clave aquí ***
            console.log('Estado actual de userPets ANTES de actualizar:', userPets);
            setUserPets(prevPets => {
                const updatedPets = [...prevPets, addedPet];
                console.log('Estado de userPets DESPUÉS de actualizar:', updatedPets);
                return updatedPets;
            });

            setNewPetData({ name: '', breed: '', age: '', type: '' });
            setSelectedImage(null);
            setImagePreviewUrl('');
            setShowAddPetForm(false);

        } catch (error) {
            console.error('❌ Error al añadir la mascota:', error.response ? error.response.data : error.message);
        }
    };


    if (!user) {
        return <p className="text-center mt-10">Cargando usuario...</p>;
    }

    return (
        <>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">PetVerse</span>
                    </a>
                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <button type="button" className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                            <span className="sr-only">Open user menu</span>
                            <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="user photo"></img>
                        </button>

                        <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
                            <div className="px-4 py-3">
                                <span className="block text-sm text-gray-900 dark:text-white">{user.userName || 'Usuario'}</span>
                                <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">{user.email || 'email@example.com'}</span>
                            </div>
                            <ul className="py-2" aria-labelledby="user-menu-button">
                                <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">My profile</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">My Pets</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Appointments</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Log out</a>
                                </li>
                            </ul>
                        </div>
                        <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
                            </li>
                            <li>
                                <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Dashboard</a>
                            </li>
                            <li>
                                <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">MyPets</a>
                            </li>
                            <li>
                                <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Appointments</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <main className="px-10 lg:px-20 xl:px-40 py-8 flex flex-1 justify-center">
                <div className="layout-content-container flex flex-col w-full max-w-7xl">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--text-dark)]">Welcome back, {user.userName}!</h1>
                        <p className="text-[var(--text-light)] text-lg mt-2">Here's a quick overview of your pets' world.</p>
                    </div>

                    <h2 className="text-2xl font-bold text-header-sage-green mb-4 flex items-center gap-2">
                        Your Pets
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {userPets.map((pet, index) => (
                            <PetCard
                                key={pet.id || index}
                                imageUrl={pet.imageUrl}
                                name={pet.name}
                                breed={pet.breed}
                                age={pet.age}
                                type={pet.type}
                            />
                        ))}

                        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center p-5 min-h-[250px]">
                            <button onClick={() => setShowAddPetForm(true)} className="flex flex-col items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white w-full h-full">
                                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                <span className="text-lg font-medium">Add a new pet</span>
                            </button>
                        </div>
                    </div>

                    {/* Sección de Citas y Acciones Rápidas */}
                    <div className="mt-10 flex flex-col lg:flex-row gap-6">
                        {/* Columna de Citas Próximas */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-header-sage-green mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                Upcoming Appointments
                            </h2>
                            <div className="space-y-4">
                                {appointments.length > 0 ? (
                                    appointments.map(appointment => (
                                        <AppointmentCard
                                            key={appointment.id}
                                            type={appointment.type}
                                            title={appointment.title}
                                            subtitle={appointment.subtitle}
                                            date={appointment.date}
                                            time={appointment.time}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500">No upcoming appointments.</p>
                                )}
                            </div>
                        </div>

                        {/* Columna de Acciones Rápidas */}
                        <div className="lg:w-1/3 flex flex-col gap-4">
                            <h2 className="text-2xl font-bold text-header-sage-green mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H3"></path>
                                </svg>
                                Quick Actions
                            </h2>
                            <button
                                onClick={() => setShowAppointmentForm(true)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-300"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                Book Appointment
                            </button>
                            <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                Find a Service
                            </button>
                            <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-6 13a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2H9z"></path>
                                </svg>
                                Contact Vet
                            </button>
                        </div>
                    </div>

                    {/* Formulario de Nueva Cita (Modal/Overlay) */}
                    {showAppointmentForm && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                                <h3 className="text-xl font-bold mb-4">Book New Appointment</h3>
                                <form onSubmit={handleSubmitAppointment} className="space-y-4">
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Appointment Type</label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={newAppointment.type}
                                            onChange={handleAppointmentInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">Select type</option>
                                            <option value="checkup">Checkup</option>
                                            <option value="grooming">Grooming</option>
                                            <option value="vaccination">Vaccination</option>
                                            <option value="surgery">Surgery</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title (e.g., Annual Checkup for Buddy)</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={newAppointment.title}
                                            onChange={handleAppointmentInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtitle (e.g., Dr. Smith at Clinic)</label>
                                        <input
                                            type="text"
                                            id="subtitle"
                                            name="subtitle"
                                            value={newAppointment.subtitle}
                                            onChange={handleAppointmentInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date (e.g., July 15)</label>
                                        <input
                                            type="text"
                                            id="date"
                                            name="date"
                                            value={newAppointment.date}
                                            onChange={handleAppointmentInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="e.g., July 15"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time (e.g., 10:30 AM)</label>
                                        <input
                                            type="text"
                                            id="time"
                                            name="time"
                                            value={newAppointment.time}
                                            onChange={handleAppointmentInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="e.g., 10:30 AM"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowAppointmentForm(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Save Appointment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Formulario para Añadir Nueva Mascota (Modal/Overlay) */}
                    {showAddPetForm && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                                <h3 className="text-xl font-bold mb-4">Add New Pet</h3>
                                <form onSubmit={handleAddPetSubmit} className="space-y-4">
                                    {/* Campo para subir la imagen */}
                                    <div>
                                        <label htmlFor="petImage" className="block text-sm font-medium text-gray-700">Pet Image</label>
                                        <input
                                            type="file"
                                            id="petImage"
                                            name="image"
                                            accept="image/*"
                                            onChange={handlePetInputChange}
                                            className="mt-1 block w-full text-sm text-gray-500
                                                       file:mr-4 file:py-2 file:px-4
                                                       file:rounded-full file:border-0
                                                       file:text-sm file:font-semibold
                                                       file:bg-green-50 file:text-green-700
                                                       hover:file:bg-green-100"
                                            required
                                        />
                                        {imagePreviewUrl && (
                                            <div className="mt-4">
                                                <img src={imagePreviewUrl} alt="Image Preview" className="w-32 h-32 object-cover rounded-md mx-auto" />
                                                <p className="text-center text-sm text-gray-500 mt-1">Image Preview</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Campos de texto para los datos de la mascota */}
                                    <div>
                                        <label htmlFor="petName" className="block text-sm font-medium text-gray-700">Pet Name</label>
                                        <input
                                            type="text"
                                            id="petName"
                                            name="name"
                                            value={newPetData.name}
                                            onChange={handlePetInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="petType" className="block text-sm font-medium text-gray-700">Pet Type</label>
                                        <select
                                            id="petType"
                                            name="type"
                                            value={newPetData.type}
                                            onChange={handlePetInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">Select type</option>
                                            <option value="Dog">Dog</option>
                                            <option value="Cat">Cat</option>
                                            <option value="Bird">Bird</option>
                                            <option value="Fish">Fish</option>
                                            <option value="Reptile">Reptile</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="petBreed" className="block text-sm font-medium text-gray-700">Breed</label>
                                        <input
                                            type="text"
                                            id="petBreed"
                                            name="breed"
                                            value={newPetData.breed}
                                            onChange={handlePetInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="petAge" className="block text-sm font-medium text-gray-700">Age (Years)</label>
                                        <input
                                            type="number"
                                            id="petAge"
                                            name="age"
                                            value={newPetData.age}
                                            onChange={handlePetInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddPetForm(false);
                                                setNewPetData({ name: '', breed: '', age: '', type: '' });
                                                setSelectedImage(null);
                                                setImagePreviewUrl('');
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            Add Pet
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
