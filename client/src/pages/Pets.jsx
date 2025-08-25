// src/components/dashboard/Pets.jsx

import React, { useEffect, useState } from "react";
import { Meteors } from "@/components/magicui/meteors";
import PetCard from "@/components/dashboard/PetCard";
import AddPetForm from "@/components/dashboard/PetForm";
import GlassButton from "@/components/ui/GlassButton";
import Navbar from "@/components/dashboard/Navbar";

const Pets = () => {
    const [pets, setPets] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const token = localStorage.getItem("token");

    const fetchPets = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/pets", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Error al obtener las mascotas");
            const data = await response.json();
            setPets(data);
        } catch (error) {
            console.error("Error fetching pets:", error);
        }
    };

    const handleAddPet = async (petData) => {
        try {
            const formData = new FormData();
            formData.append("name", petData.name);
            formData.append("species", petData.type); 
            formData.append("age", petData.age);
            formData.append("breed", petData.breed);
            if (petData.image) {
                formData.append("image", petData.image);
            }

           
            const response = await fetch("http://localhost:5000/api/pets", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Error al crear la mascota");

            const newPet = await response.json();
            setPets([...pets, newPet]);
            setShowAddForm(false);
        } catch (error) {
            console.error("Error creating pet:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/pets/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Error al eliminar la mascota");
            setPets(pets.filter((pet) => pet._id !== id));
        } catch (error) {
            console.error("Error deleting pet:", error);
        }
    };

    useEffect(() => {
        fetchPets();
    }, [token]);

    return (
        <main className="relative">
            <div className="min-h-screen flex flex-col items-center justify-center bg-[url('/bddashboard.png')] bg-cover bg-center bg-no-repeat">
                <Navbar />
                <Meteors />
                <div className="relative z-10 w-full max-w-7xl mx-auto mt-6">
                    <div className="flex justify-between items-center mb-8 mt-12">
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                            Mis Mascotas 🐾
                        </h2>
                        <GlassButton
                            onClick={() => setShowAddForm(true)}
                            className="px-6 py-2 border-2 rounded-full text-white font-semibold transition-transform duration-300 hover:scale-105"
                        >
                            Añadir Mascota
                        </GlassButton>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {pets.length > 0 ? (
                            pets.map((pet) => (
                                <PetCard key={pet._id} pet={pet} onDelete={handleDelete} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-400">
                                No tienes mascotas registradas. ¡Añade una ahora mismo!
                            </p>
                        )}
                    </div>
                </div>
            </div>
            
            <AddPetForm
                show={showAddForm}
                onClose={() => setShowAddForm(false)}
                onAddPet={handleAddPet}
            />
        </main>
    );
};

export default Pets;