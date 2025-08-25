import React from "react";
import { Link } from "react-router-dom";
import { MagicCard } from "@/components/magicui/magic-card";




export default function PetCard({ pet }) {
    const { imageUrl, name, breed, age, type } = pet;
    const finalImageUrl = imageUrl || "https://placehold.co/400x300/e2e8f0/000000?text=Pet+Image";

    let borderColorClass = "border-blue-500";
    let textColorClass = "text-blue-500";
    let icon = "🐾";

    switch ((breed || '').toLowerCase()) {
        case "dog":
            borderColorClass = "border-orange-500";
            textColorClass = "text-orange-500";
            icon = "🐶"; break;
        case "cat":
            borderColorClass = "border-fuchsia-500";
            textColorClass = "text-fuchsia-500";
            icon = "🐱"; break;
        case "bird":
            borderColorClass = "border-yellow-500";
            textColorClass = "text-yellow-500";
            icon = "🦜"; break;
        case "fish":
            borderColorClass = "border-blue-500";
            textColorClass = "text-blue-500";
            icon = "🐟"; break;
        case "reptil":
            borderColorClass = "border-emerald-500";
            textColorClass = "text-emerald-500";
            icon = "🦎"; break;
        case "huron":
            borderColorClass = "border-stone-500";
            textColorClass = "text-stone-500";
            icon = "🦦"; break;
        case "hamster":
            borderColorClass = "border-amber-500";
            textColorClass = "text-amber-500";
            icon = "🐹"; break;
        default:
            borderColorClass = "border-[#f3701e]";
            textColorClass = "text-[#f3701e]";
            icon = "🐾";
    }


    let linkBgClass = 'bg-blue-500 hover:bg-blue-600';
    if (borderColorClass) {
    }


    return (


        <MagicCard className="rounded-lg glass-pet-card border-2 ">
            <div className={`overflow-hidden rounded-lg shadow-lg border-2 ${borderColorClass} flex flex-col items-center justify-center p-4 transform transition-transform hover:scale-105`}>
                <div className="w-full h-48 overflow-hidden border-l-4 border-transparent">
                    <img
                        className="w-full h-full object-cover"
                        src={finalImageUrl}
                        alt={`Foto de ${name}`}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/400x300/e2e8f0/000000?text=Pet+Image";
                        }}
                    />
                </div>
                <div className="p-4 w-full">
                    <h4 className={`text-xl font-bold text-center ${textColorClass} mb-2`}>{name} {icon}</h4>
                    <div className="text-white-600 text-sm">
                        <p className="flex justify-between items-center w-full">
                            <span className={`font-medium ${textColorClass}`}>Type:</span>
                            <span className="capitalize">{type}</span>
                        </p>
                        <p className="flex justify-between items-center w-full">
                            <span className={`font-medium ${textColorClass}`}>Breed:</span>
                            <span className="capitalize">{breed}</span>
                        </p>
                        <p className="flex justify-between items-center w-full">
                            <span className={`font-medium ${textColorClass}`}>Age:</span>
                            <span>{age} years old</span>
                        </p>
                    </div>
                </div>
            </div>
        </MagicCard>

    );
}