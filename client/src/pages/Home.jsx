import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items center justify-center bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
            
            <GlassCard>
                <h1 className="text-4xl font-bold mb-6"> Bienvenido a PetVerse </h1>
                <p>Un lugar donde podras registrar a tu mascota y obtener todos los consejos para cuidar de tu compañero,
                    en PetVerse, podras registrar a tus mascotas, asi como registrar y controlar su salud y bienestar.
                    Podras, obtener recordatorios de vacunación, seguimiento de citas veterinarias y mucho más.</p>
                <div className="mt-8 flex space-x-4 justify-center">
                <GlassButton
                    href="/login"
                >
                    Iniciar Sesión
                </GlassButton>
                <GlassButton
                    href="/register"               
                >
                    Registrarse
                </GlassButton>
            </div>
            </GlassCard>        
            
        </div>
    );
}                  


