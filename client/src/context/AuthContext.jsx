import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [isLoading, setLoading] = React.useState(true);

    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await axios.get("http://localhost:5000/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(res.data);
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
                localStorage.removeItem("token");
                setUser(null);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (token) => {
        localStorage.setItem("token", token);
        await fetchUser();
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, logout, login, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};