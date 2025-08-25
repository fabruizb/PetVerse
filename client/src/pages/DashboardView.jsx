import React from "react";
import PetCard from "../components/dashboard/PetCard";
import AppointmentCard from "../components/dashboard/AppontmentCard";
import AddPetForm from "../components/dashboard/PetForm";
import GlassButton from "../components/ui/GlassButton";
import { Dialog } from "../components/ui/dialog";
import Navbar from "../components/dashboard/Navbar";
import { Meteors } from "@/components/magicui/meteors";
import { Marquee } from "@/components/magicui/marquee";



export default function DashboardView({
    user,
    userPets,
    appointments,
    showAddPetForm,
    onLogout,
    onShowAddPetForm,
    onCloseAddPetForm,
    onAddPet,
}) {
    const userName = user?.userName || "Usuario";

    return (


        <div className="min-h-screen flex flex-col items-center justify-center bg-[url('/bddashboard.png')] bg-cover bg-center bg-no-repeat">
            <Meteors />
            <Navbar user={user} handleLogout={onLogout} />
            <main className="container mx-auto p-4 md:p-6 lg:p-8 pt-20">
                <div className="mt-9 flex flex-col md:flex-row items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-[#084680] mb-4 md:mb-0">
                        Hola, {userName}, nos alegra verte de vuelta!
                    </h2>
                </div>

                {/* Sección de Mascotas */}
                <section className="mb-12">
                    <Marquee pauseOnHover className="[--duration:120s] bg-transparent">
                        <div className="flex items-center gap-6">
                            {userPets.length > 0 ? (
                                userPets.map((pet, index) => (
                                    <div key={pet._id || index} className="flex-shrink-0 w-72">
                                        <PetCard pet={pet} />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No tienes mascotas registradas.</p>
                            )}
                        </div>
                    </Marquee>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-800">
                            Citas Médicas
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {appointments.length > 0 ? (
                            appointments.map((appointment) => (
                                <AppointmentCard key={appointment._id} appointment={appointment} />
                            ))
                        ) : (
                            <p className="text-gray-600">
                                No tienes citas registradas.
                            </p>
                        )}
                    </div>
                </section>                
            </main>
        </div>
    );
}


