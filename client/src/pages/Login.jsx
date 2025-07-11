export default function Login() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-teal-300 to-indigo-400 text-white">
            <h1 className="text-4xl font-bold mb-6">Iniciar Sesión</h1>
            <form className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                        Correo Electrónico
                    </label>
                    <input
                        className="border border-gray-300 p-2 w-full rounded"
                        type="email"
                        id="email"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="password">
                        Contraseña
                    </label>
                    <input
                        className="border border-gray-300 p-2 w-full rounded"
                        type="password"
                        id="password"
                        required
                    />
                </div>
                <button className="bg-teal-600 text-white px-4 py-2 rounded" type="submit">
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}
