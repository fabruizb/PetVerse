import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import DashboardView from "../../pages/DashboardView";

export default function DashboardContainer() {
    const { user, logout, isLoading } = useContext(AuthContext);

    const [userPets, setUserPets] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [showAddPetForm, setShowAddPetForm] = useState(false);
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    const fetchDashboardData = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const petsWithFullUrl = (res.data.pets || []).map(pet => ({
                ...pet,
                imageUrl: pet.imageUrl ? `${API_URL.replace("/api", "")}${pet.imageUrl}` : null
            }));

            setUserPets(petsWithFullUrl);
            setAppointments(res.data.appointments || []);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            if (error.response && error.response.status === 401) {
                logout();
            }
        }
    };

    
    const handleAddPet = async (petData) => {
        const { name, breed, age, type, image } = petData;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("breed", breed);
        formData.append("age", age);
        formData.append("type", type);
        if (image) formData.append("image", image);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${API_URL}/pets`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Pet added:", res.data);

            const newPet = {
                ...res.data,
                imageUrl: res.data.imageUrl ? `${API_URL.replace("/api", "")}${res.data.imageUrl}` : null
            };

            setUserPets(prev => [...prev, newPet]);
            setShowAddPetForm(false);
        } catch (error) {
            console.error("Error adding pet:", error);
        }
    };

    const handleAddAppointment = async (appointmentData) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${API_URL}/appointments`,
                appointmentData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            console.log("Appointment added:", res.data);
            setAppointments(prev => [...prev, res.data]);
            setShowAppointmentForm(false);
        } catch (error) {
            console.error("Error adding appointment:", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [user, logout, API_URL]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <DashboardView
            user={user}
            userPets={userPets}
            appointments={appointments}
            showAddPetForm={showAddPetForm}
            showAppointmentForm={showAppointmentForm}
            onLogout={logout}
            onShowAddPetForm={() => setShowAddPetForm(true)}
            onCloseAddPetForm={() => setShowAddPetForm(false)}
            onAddPet={handleAddPet}
            onShowAppointmentForm={() => setShowAppointmentForm(true)}
            onCloseAppointmentForm={() => setShowAppointmentForm(false)}
            onAddAppointment={handleAddAppointment}
        />
    );
}