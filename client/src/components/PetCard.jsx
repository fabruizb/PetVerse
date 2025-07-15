import React from 'react';

export default function PetCard({ imageUrl, name, breed, age, type }) {
    // ¡DEBUG: Verifica qué imageUrl recibe el componente PetCard!
    console.log(`PetCard para ${name} recibiendo imageUrl: ${imageUrl}`);

    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
            <a href="#">
                <img
                    className="rounded-t-lg w-full h-48 object-cover object-center"
                    src={imageUrl} // Asegúrate de que esto sea correcto
                    alt={name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/400x300/cccccc/000000?text=No+Image';
                        console.error(`Error al cargar la imagen para ${name}. URL que intentó: ${imageUrl}`);
                    }}
                />
            </a>
            <div className="p-5">
                <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {breed}, {age} years. ({type})
                </p>
            </div>
        </div>
    );
}
