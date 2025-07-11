export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items center justify-center bg-gradient-to-r from-teal-300 to-indigo-400 text-white">
            <h1 className="text-4xl font-bold mb-6"> Bienvenido a PetVerse </h1>
            <p className="text-lg">Adopta, cuida y entrena a tu mascota virtual</p>
            <div className="mt-8">
                <a
                    href="/login"
                    className="bg-white text-teal-600 px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
                >
                    Iniciar Sesión
                </a>
                <a
                    href="/register"
                    className="ml-4 bg-white text-teal-600 px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
                >
                    Registrarse
                </a>
            </div>
        </div>
    );
}                  


