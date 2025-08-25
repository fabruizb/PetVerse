import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import GlassButton from "../components/ui/GlassButton";
import GlassCard from "../components/ui/GlassCard";
import GlassInput from "../components/ui/GlassInput";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Login failed");
                return;
            }

            await login(data.token);
            navigate("/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            setError("Server error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center  bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
            <GlassCard className=" p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold font-color-black mb-4 text-center">
                    Iniciar Sesión
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <GlassInput
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <GlassInput
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <GlassButton type="submit">Iniciar sesión</GlassButton>
                </form>
            </GlassCard>
        </div>
    );
}