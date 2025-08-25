import React, { useEffect, useState } from "react";

const Appointments = () => {
    const token = localStorage.getItem("token");

    const [appointments, setAppointments] = useState([]);
    const [pets, setPets] = useState([]);
    const [form, setForm] = useState({
        type: '',
        title: '',
        subtitle: '',
        date: '',
        time: '',
        pet: '',
    });
    const [editingId, setEditingId] = useState(null);

    const fetchAppointments = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/appointments", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setAppointments(data);
        } catch (err) {
            console.error("Error fetching appointments:", err);
        }
    };


    const fetchPets = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/pets", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setPets(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching pets:", err);
            setPets([]); 
        }
    };

    useEffect(() => {
        fetchAppointments();
        fetchPets();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Error creando cita");

            const newAppointment = await res.json();
            setAppointments([...appointments, newAppointment]);
            setForm({ pet: "", date: "", description: "" });
        } catch (err) {
            console.error(err);
        }
    };


    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Error eliminando cita");

            setAppointments(appointments.filter(a => a._id !== id));
        } catch (err) {
            console.error(err);
        }
    };


    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/appointments/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Error actualizando cita");

            const updated = await res.json();
            setAppointments(appointments.map((a) => (a._id === editingId ? updated : a)));
            setEditingId(null);
            setForm({ pet: "", date: "", description: "" });
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditClick = (appointment) => {
        setEditingId(appointment._id);
        setForm({
            pet: appointment.pet._id || appointment.pet,
            date: appointment.date.slice(0, 10),
            description: appointment.description,
        });
    };

    return (
        <div>
            <h2>Citas Médicas</h2>

            <form onSubmit={editingId ? handleUpdate : handleSubmit}>
                <select
                    value={form.pet}
                    onChange={(e) => setForm({ ...form, pet: e.target.value })}
                    required
                >
                    {Array.isArray(pets) && pets.map((pet) => (
                        <option key={pet._id} value={pet._id}>
                            {pet.name} ({pet.type})
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Descripción"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                />
                <button type="submit">{editingId ? "Actualizar" : "Agregar"} Cita</button>
                {editingId && <button onClick={() => {
                    setEditingId(null);
                    setForm({ pet: "", date: "", description: "" });
                }}>Cancelar</button>}
            </form>

            <ul>
                {appointments.map((a) => (
                    <li key={a._id}>
                        <strong>{a.pet?.name || "Mascota eliminada"}</strong> - {new Date(a.date).toLocaleDateString()} - {a.reason}
                        <button onClick={() => handleEditClick(a)}>Editar</button>
                        <button onClick={() => handleDelete(a._id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Appointments;
