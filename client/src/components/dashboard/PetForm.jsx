import GlassInput from "../ui/GlassInput";
import GlassButton from "../ui/GlassButton";
import { useState } from "react";
import CoolMode from "../magicui/CoolMode";


/**
 * @param {object} props 
 * @param {boolean} props.show 
 * @param {function} props.onClose 
 * @param {function} props.onAddPet 
 */
export default function AddPetForm({ show, onClose, onAddPet }) {
    const [newPetData, setNewPetData] = useState({
        name: "",
        breed: "",
        age: "",
        type: "",
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");

    if (!show) {
        return null;
    }

    /**
     * @param {object} e .
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPetData({
            ...newPetData,
            [name]: value,
        });
    };

    /**
    * @param {object} e 
     */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, breed, age, type } = newPetData;

        if (!name || !breed || !age || !type || !selectedImage) {
            alert("Por favor, completa todos los campos del formulario, incluyendo la imagen.");
            return;
        }

        if (isNaN(parseInt(age))) {
            alert("La edad debe ser un número válido.");
            return;
        }

        onAddPet({ ...newPetData, image: selectedImage });
    };

    return (
        <div className="bg-none fixed inset-0 z-50 flex items-center justify-center">
            <div className="pet-form rounded-lg shadow-lg p-6 max-w-lg w-full">
                <h3 className="text-xl font-bold mb-4">Añadir Nueva Mascota</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="pet-name" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <GlassInput type="text" id="pet-name" name="name" value={newPetData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="pet-breed"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Raza
                        </label>
                        <div className="relative mt-2">
                            <select
                                id="pet-breed"
                                name="breed"
                                value={newPetData.breed}
                                onChange={handleChange}
                                className="block w-full appearance-none rounded-md bg-white/5 py-2 pl-3 pr-10 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="Dog">Perro</option>
                                <option value="Cat">Gato</option>
                                <option value="Bird">Ave</option>
                                <option value="Fish">Pez</option>
                                <option value="Reptile">Reptil</option>
                                <option value="Huron">Hurón</option>
                                <option value="Hamster">Hámster</option>
                                <option value="Other">Otro</option>
                            </select>
                            {/* Icono del select */}
                            <svg
                                className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="pet-age" className="block text-sm font-medium text-gray-700">Edad</label>
                        <GlassInput type="number" id="pet-age" name="age" value={newPetData.age} onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="pet-type" className="block text-sm font-medium text-gray-700">Tipo</label>
                        <GlassInput type="text" id="pet-type" name="type" value={newPetData.type} onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="pet-image" className="block text-sm font-medium text-gray-700">Imagen</label>
                        <input
                            type="file"
                            id="pet-image"
                            name="image"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 border rounded-md bg-[#084680] text-white"
                            accept="image/*"
                            required
                        />
                        {imagePreviewUrl && (
                            <div className="mt-4 w-[28rem] h-[28rem]">
                                <img src={imagePreviewUrl} alt="Vista previa de la mascota" className="w-full h-full object-cover rounded-md" />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-end space-x-4">                       
                        <GlassButton
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </GlassButton>                        
                        <GlassButton
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Añadir Mascota
                        </GlassButton>
                    </div>
                </form>

            </div>

        </div>
    );
}