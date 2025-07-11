import React, { useEffect, useState } from "react";

const Pets = () => {
    const [pets, setPets] = useState([]);
    const [form, setForm] = useState({
        name: "",
        species: "",
        age: "",
        breed: "",
    });
    const token = localStorage.getItem("token");
    const [image, setImage] = useState(null);

    // Obtener mascotas del usuario autenticado
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
    // Crear una nueva mascota
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("species", form.species);
            formData.append("age", form.age);
            formData.append("breed", form.breed);
            if (image) formData.append("image", image);

            const response = await fetch("http://localhost:5000/api/pets", {
                method: "POST",
                headers: {                    
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });
            if (!response.ok) throw new Error("Error al crear la mascota");
            const newPet = await response.json();
            setPets([...pets, newPet]);
            setForm({
                name: "",
                species: "",
                age: "",
                breed: "",
            });
        } catch (error) {
            console.error("Error creating pet:", error);
        }
    };
    // Actualizar una mascota
    const [editingID, setEditingID] = useState(null);   
    const handleUpdate = async (e, id) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("species", form.species);
            formData.append("age", form.age);
            formData.append("breed", form.breed);
            if (image) formData.append("image", image);
            const response = await fetch(`http://localhost:5000/api/pets/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (!response.ok) throw new Error("Error al actualizar la mascota");
            const updatedPet = await response.json();
            setPets(pets.map((pet) => (pet._id === id ? updatedPet : pet)));
            setEditingID(null);
            setForm({
                name: "",
                species: "",
                age: "",
                breed: "",
            });
        } catch (error) {
            console.error("Error updating pet:", error);
        }
    };
    // Eliminar una mascota
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
        <div>
            <h2>Mis Mascotas</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Especie"
                    value={form.species}
                    onChange={(e) => setForm({ ...form, species: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Edad"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Raza"
                    value={form.breed}
                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                    required
                />
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <div>
                    <p>Vista previa de la imagen:</p>
                    {image && <img src={URL.createObjectURL(image)} alt="Vista previa" style={{ width: "100px", height: "100px" }} />}
                </div>
                <button type="submit">Agregar Mascota</button>
            </form>
            <ul>
                {pets.map((pet) => (
                    <li key={pet._id}>
                    { editingID === pet._id ? (
                        <form onSubmit={(e) => handleUpdate(e, pet._id)}>
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Especie"
                                value={form.species}
                                onChange={(e) => setForm({ ...form, species: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Edad"
                                value={form.age}
                                onChange={(e) => setForm({ ...form, age: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Raza"
                                value={form.breed}
                                onChange={(e) => setForm({ ...form, breed: e.target.value })}
                                required
                            />
                            <button type="submit">Actualizar Mascota</button>
                        </form>
                    ) : (
                        <>
                            {pet.name} - {pet.species} - {pet.age} - {pet.breed}
                            <button onClick={() => setEditingID(pet._id)}>Editar</button>
                            <button onClick={() => handleDelete(pet._id)}>Eliminar</button>
                        </>
                    )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default Pets;
